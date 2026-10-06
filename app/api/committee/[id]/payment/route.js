import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import { requireMember, requireCommitteeOwner } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { createLog } from "@/app/utils/logger";
import { notify } from "@/app/utils/notify";
import { resolveImage } from "@/app/utils/assets";
import { stage, whoMustPay, paymentFor, idOf } from "@/app/utils/bcRules";

export const dynamic = "force-dynamic";

const str = (v, n = 120) => (typeof v === "string" ? v.trim().slice(0, n) : "");

// POST { month, screenshot, transactionId?, description? } -> member sends a payment receipt.
export async function POST(req, { params }) {
  try {
    const auth = await requireMember(req);
    if (auth.error) return auth.error;
    if (!isObjectId(params.id)) return fail(400, "Invalid BC id.");
    const body = await readJson(req);

    await connectToDatabase();
    const c = await Committee.findById(params.id);
    if (!c) return fail(404, "BC not found.");
    const me = String(auth.user._id);

    if (!(c.members || []).some((m) => String(m) === me)) return fail(403, "You are not a member of this BC.");
    if (stage(c) !== "running") return fail(400, "This BC has not started yet.");

    const month = Math.round(Number(body.month) || c.currentMonth || 1);
    if (month < 1 || month > (c.currentMonth || 1)) return fail(400, "You can only pay for the current or past months.");
    if (!whoMustPay(c, month).includes(me)) return fail(400, "You don't pay this month. It is your turn to receive.");

    const existing = paymentFor(c, month, me);
    if (existing?.status === "verified") return fail(400, "This month is already paid.");
    if (existing?.status === "pending") return fail(400, "Your receipt is already sent. Please wait for the organizer to check it.");

    const image = await resolveImage(body.screenshot, auth.user._id, "Member", `receipt-${c._id}-m${month}`);
    if (image.error) return fail(400, image.error);

    let res;
    const submission = {
      screenshot: image.url,
      transactionId: str(body.transactionId, 60),
      description: str(body.description, 300),
      submittedAt: new Date(),
    };

    if (existing) {
      res = await Committee.updateOne(
        { _id: c._id, payments: { $elemMatch: { _id: existing._id, status: existing.status } } },
        { $set: { "payments.$.status": "pending", "payments.$.submission": submission, "payments.$.method": "online", "payments.$.rejectReason": "", "payments.$.updatedAt": new Date() } }
      );
    } else {
      res = await Committee.updateOne(
        { _id: c._id, payments: { $not: { $elemMatch: { month, member: auth.user._id } } } },
        { $push: { payments: { month, member: auth.user._id, status: "pending", method: "online", submission, updatedAt: new Date() } } }
      );
    }

    if (!res.modifiedCount) return fail(409, "This payment was just changed. Please refresh the page.");

    await notify({
      recipient: c.createdBy,
      model: "Admin",
      sender: auth.user._id,
      senderModel: "Member",
      type: "payment_submitted",
      message: `${auth.user.name} sent a receipt for ${c.name} (month ${month}).`,
      link: `/admin/bc/${c._id}`,
    });
    await createLog({ action: "SUBMIT_PAYMENT", performedBy: auth.user._id, onModel: "Member", targetId: c._id, details: { month } });
    return ok({ done: true, screenshot: image.url });
  } catch (err) {
    return serverError(err, "payment POST");
  }
}

// PATCH { action: "approve" | "reject" | "mark_cash", memberId, month?, reason? } -> organizer checks a payment.
export async function PATCH(req, { params }) {
  try {
    const auth = await requireCommitteeOwner(req, params.id);
    if (auth.error) return auth.error;
    const c = auth.committee;
    const { action, memberId, reason, month } = await readJson(req);

    if (!["approve", "reject", "mark_cash"].includes(action)) return fail(400, "Unknown action.");
    if (!isObjectId(memberId)) return fail(400, "Invalid member.");
    const m = Math.round(Number(month)) || c.currentMonth || 1;
    return await reviewPayment(c, auth.user, action, memberId, reason, m);
  } catch (err) {
    return serverError(err, "payment PATCH");
  }
}

async function reviewPayment(c, admin, action, memberId, reason, month) {
  if (!(c.members || []).some((m) => String(m) === String(memberId))) return fail(400, "This person is not in the BC.");
  if (stage(c) !== "running") return fail(400, "This BC is not running.");
  if (month < 1 || month > (c.currentMonth || 1)) return fail(400, "Invalid month.");
  if (!whoMustPay(c, month).includes(String(memberId))) return fail(400, "This member receives the pot this month and does not pay.");

  const existing = paymentFor(c, month, memberId);
  const now = new Date();
  let message;
  let res;

  if (action === "approve") {
    if (!existing || existing.status !== "pending") return fail(400, "There is no receipt waiting to be checked.");
    res = await Committee.updateOne(
      { _id: c._id, payments: { $elemMatch: { _id: existing._id, status: "pending" } } },
      { $set: { "payments.$.status": "verified", "payments.$.reviewedBy": admin._id, "payments.$.reviewedAt": now, "payments.$.updatedAt": now } }
    );
    message = `Your payment for ${c.name} (month ${month}) is approved.`;
  } else if (action === "reject") {
    const why = str(reason, 200);
    if (!why) return fail(400, "Please write why you are rejecting it.");
    if (!existing || existing.status !== "pending") return fail(400, "There is no receipt waiting to be checked.");
    res = await Committee.updateOne(
      { _id: c._id, payments: { $elemMatch: { _id: existing._id, status: "pending" } } },
      { $set: { "payments.$.status": "rejected", "payments.$.rejectReason": why, "payments.$.reviewedBy": admin._id, "payments.$.reviewedAt": now, "payments.$.updatedAt": now } }
    );
    message = `Your receipt for ${c.name} (month ${month}) was not accepted: ${why}. Please send it again.`;
  } else {
    if (existing?.status === "verified") return fail(400, "Already paid.");
    if (existing) {
      res = await Committee.updateOne(
        { _id: c._id, payments: { $elemMatch: { _id: existing._id, status: existing.status } } },
        { $set: { "payments.$.status": "verified", "payments.$.method": "cash", "payments.$.reviewedBy": admin._id, "payments.$.reviewedAt": now, "payments.$.updatedAt": now } }
      );
    } else {
      res = await Committee.updateOne(
        { _id: c._id, payments: { $not: { $elemMatch: { month, member: memberId } } } },
        { $push: { payments: { month, member: memberId, status: "verified", method: "cash", reviewedBy: admin._id, reviewedAt: now, updatedAt: now } } }
      );
    }
    message = `Your cash payment for ${c.name} (month ${month}) is marked as paid.`;
  }

  if (!res?.modifiedCount) return fail(409, "This payment was just changed. Please refresh the page.");

  const member = await Member.findById(memberId).select("name email");
  if (member) {
    await notify({
      recipient: member,
      model: "Member",
      sender: admin._id,
      senderModel: "Admin",
      type: "payment_reviewed",
      message,
      link: `/userDash/bc/${c._id}`,
    });
  }
  await createLog({
    action: action === "reject" ? "REJECT_PAYMENT" : "VERIFY_PAYMENT",
    performedBy: admin._id,
    onModel: "Admin",
    targetId: c._id,
    details: { memberId: idOf(memberId), month, method: action === "mark_cash" ? "cash" : "online" },
  });
  return ok({ done: true });
}
