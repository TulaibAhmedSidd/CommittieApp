import Member from "@/app/api/models/Member";
import Committee from "@/app/api/models/Committee";
import { requireAdmin, adminCanManageMember } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { normalizePkPhone, normalizeEmail } from "@/app/utils/phone";
import { isTaken } from "@/app/utils/accounts";
import { MEMBER_KYC } from "@/app/utils/fields";

export const dynamic = "force-dynamic";

async function load(req, id) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth;
  if (!isObjectId(id)) return { error: fail(400, "Invalid member.") };
  const member = await Member.findById(id).select(MEMBER_KYC + " status organizers createdBy referredBy payoutDetails");
  if (!member || !adminCanManageMember(auth.user, member)) return { error: fail(404, "Member not found in your list.") };
  return { ...auth, member };
}

// GET -> member details for their organizer (incl. documents for checking).
export async function GET(req, { params }) {
  try {
    const r = await load(req, params.id);
    if (r.error) return r.error;
    const m = r.member.toObject();
    delete m.organizers;
    delete m.createdBy;
    delete m.referredBy;
    return ok({ member: { ...m, _id: String(m._id), phone: m.phone ? String(m.phone) : "" } });
  } catch (err) {
    return serverError(err, "admin/members/[id] GET");
  }
}

// PATCH { name?, phone?, email? } -> fix details of a member who has not set a password yet.
export async function PATCH(req, { params }) {
  try {
    const r = await load(req, params.id);
    if (r.error) return r.error;
    if (r.member.status !== "invited") return fail(400, "This member manages their own details now.");
    const body = await readJson(req);
    const update = {};
    if (typeof body.name === "string" && body.name.trim().length >= 2) update.name = body.name.trim().slice(0, 80);
    if (body.phone !== undefined) {
      const phone = normalizePkPhone(body.phone);
      if (!phone) return fail(400, "Please enter a valid mobile number.");
      if (await isTaken(Member, { phone }, r.member._id)) return fail(409, "Another member already uses this phone.");
      update.phone = phone;
    }
    if (body.email !== undefined) {
      const email = body.email ? normalizeEmail(body.email) : null;
      if (body.email && !email) return fail(400, "That email does not look right.");
      if (email && (await isTaken(Member, { email }, r.member._id))) return fail(409, "Another member already uses this email.");
      if (email) update.email = email;
      else update.$unset = { email: 1 };
    }
    await Member.updateOne({ _id: r.member._id }, update);
    return ok({ updated: true });
  } catch (err) {
    return serverError(err, "admin/members/[id] PATCH");
  }
}

// DELETE -> remove this member from my list (not from BCs they are in).
export async function DELETE(req, { params }) {
  try {
    const r = await load(req, params.id);
    if (r.error) return r.error;
    const inMyBc = await Committee.exists({ createdBy: r.user._id, $or: [{ members: r.member._id }, { pendingMembers: r.member._id }], status: { $ne: "finished" } });
    if (inMyBc) return fail(400, "This member is in one of your BCs. Remove them from the BC first.");
    await Member.updateOne({ _id: r.member._id }, { $pull: { organizers: r.user._id } });
    return ok({ removed: true });
  } catch (err) {
    return serverError(err, "admin/members/[id] DELETE");
  }
}
