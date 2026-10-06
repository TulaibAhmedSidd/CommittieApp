import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import { requireAdmin, requireCommitteeOwner } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { createLog } from "@/app/utils/logger";
import { cardSummary } from "@/app/utils/committeeView";
import { stage } from "@/app/utils/bcRules";

export const dynamic = "force-dynamic";

const DOC_OPTIONS = ["NIC Front", "NIC Back", "Electricity Bill", "Gas Bill", "Water Bill", "Work ID"];

function parseStart(value) {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(/^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value);
  return isNaN(d.getTime()) ? null : d;
}

function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

function cleanBank(b) {
  if (!b || typeof b !== "object") return undefined;
  const s = (v) => (typeof v === "string" ? v.trim().slice(0, 80) : "");
  return { accountTitle: s(b.accountTitle), bankName: s(b.bankName), iban: s(b.iban).replace(/\s+/g, "").toUpperCase() };
}

function cleanOptional(body) {
  const out = {};
  if (typeof body.description === "string") out.description = body.description.trim().slice(0, 500);
  if (body.bankDetails !== undefined) out.bankDetails = cleanBank(body.bankDetails);
  if (body.organizerFee !== undefined) {
    const fee = Math.max(0, Math.round(Number(body.organizerFee) || 0));
    out.organizerFee = Math.min(fee, 1000000);
  }
  if (body.isFeeMandatory !== undefined) out.isFeeMandatory = !!body.isFeeMandatory;
  if (body.requireDocuments !== undefined) out.requireDocuments = !!body.requireDocuments;
  if (Array.isArray(body.mandatoryDocuments)) out.mandatoryDocuments = body.mandatoryDocuments.filter((d) => DOC_OPTIONS.includes(d));
  return out;
}

// GET -> my BCs as cards. Super admin: ?all=1 for every BC.
export async function GET(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "1" && auth.user.isSuperAdmin;

    const filter = all ? {} : { createdBy: auth.user._id };
    const list = await Committee.find(filter)
      .select("-payments.submission.screenshot -payouts.screenshot")
      .populate({ path: "result.member", select: "name", model: "Member" })
      .populate({ path: "createdBy", select: "name", model: "Admin" })
      .sort({ startDate: -1, _id: -1 })
      .limit(300)
      .lean();

    return ok({ committees: list.map((c) => cardSummary(c)) });
  } catch (err) {
    return serverError(err, "committee GET");
  }
}

// POST -> create a BC. New rules: months = members.
export async function POST(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const body = await readJson(req);

    const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";
    const maxMembers = Math.round(Number(body.maxMembers));
    const monthlyAmount = Math.round(Number(body.monthlyAmount));
    const startDate = parseStart(body.startDate);

    if (name.length < 2) return fail(400, "Please give the BC a name.");
    if (!(maxMembers >= 2 && maxMembers <= 60)) return fail(400, "Members must be between 2 and 60.");
    if (!(monthlyAmount >= 100 && monthlyAmount <= 10000000)) return fail(400, "Monthly amount must be at least Rs 100.");
    if (!startDate) return fail(400, "Please choose the start month.");

    await connectToDatabase();
    const committee = await Committee.create({
      name,
      maxMembers,
      monthlyAmount,
      monthDuration: maxMembers,
      totalAmount: monthlyAmount * maxMembers,
      startDate,
      endDate: addMonths(startDate, maxMembers - 1),
      createdBy: auth.user._id,
      status: "open",
      currentMonth: 1,
      rulesVersion: 2,
      ...cleanOptional(body),
    });

    await createLog({ action: "CREATE_COMMITTEE", performedBy: auth.user._id, onModel: "Admin", targetId: committee._id, details: { name } });
    return ok({ committee: { _id: String(committee._id), name: committee.name } }, 201);
  } catch (err) {
    return serverError(err, "committee POST");
  }
}

// PATCH { id, ...fields } -> edit. Amount, members and start month only before the BC starts.
export async function PATCH(req) {
  try {
    const body = await readJson(req);
    const auth = await requireCommitteeOwner(req, body.id);
    if (auth.error) return auth.error;
    const c = auth.committee;

    const update = cleanOptional(body);
    if (typeof body.name === "string" && body.name.trim().length >= 2) update.name = body.name.trim().slice(0, 60);

    const changingCore = body.maxMembers !== undefined || body.monthlyAmount !== undefined || body.startDate !== undefined;
    if (changingCore) {
      if (stage(c) !== "upcoming") return fail(400, "Amount, members and start month can't change after the BC has started.");
      const maxMembers = body.maxMembers !== undefined ? Math.round(Number(body.maxMembers)) : c.maxMembers;
      const monthlyAmount = body.monthlyAmount !== undefined ? Math.round(Number(body.monthlyAmount)) : c.monthlyAmount;
      const startDate = body.startDate !== undefined ? parseStart(body.startDate) : c.startDate;
      const taken = (c.members?.length || 0) + (c.pendingMembers?.length || 0);
      if (!(maxMembers >= 2 && maxMembers <= 60)) return fail(400, "Members must be between 2 and 60.");
      if (maxMembers < (c.members?.length || 0)) return fail(400, `This BC already has ${c.members.length} members.`);
      if (maxMembers < taken) return fail(400, "Reject some join requests first.");
      if (!(monthlyAmount >= 100)) return fail(400, "Monthly amount must be at least Rs 100.");
      if (!startDate) return fail(400, "Please choose the start month.");
      const months = (c.rulesVersion || 1) >= 2 ? maxMembers : c.monthDuration || maxMembers;
      Object.assign(update, {
        maxMembers,
        monthlyAmount,
        startDate,
        monthDuration: months,
        totalAmount: monthlyAmount * months,
        endDate: addMonths(startDate, months - 1),
      });
    }

    await Committee.updateOne({ _id: c._id }, update);
    await createLog({ action: "UPDATE_COMMITTEE", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: Object.keys(update) });
    return ok({ updated: true });
  } catch (err) {
    return serverError(err, "committee PATCH");
  }
}

// DELETE ?id= -> only a BC with no members and no payments.
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await readJson(req);
    const id = searchParams.get("id") || body.id;
    if (!isObjectId(String(id))) return fail(400, "Invalid BC id.");
    const auth = await requireCommitteeOwner(req, id);
    if (auth.error) return auth.error;
    const c = auth.committee;

    if ((c.members?.length || 0) > 0 || (c.payments?.length || 0) > 0) {
      return fail(400, "This BC has members. Remove them first, or use End BC instead.");
    }

    await Member.updateMany({ "committees.committee": c._id }, { $pull: { committees: { committee: c._id } } });
    await Committee.deleteOne({ _id: c._id });
    await createLog({ action: "DELETE_COMMITTEE", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { name: c.name } });
    return ok({ deleted: true });
  } catch (err) {
    return serverError(err, "committee DELETE");
  }
}
