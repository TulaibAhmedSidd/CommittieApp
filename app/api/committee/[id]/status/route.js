import Committee from "@/app/api/models/Committee";
import { requireCommitteeOwner } from "@/app/utils/auth";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { createLog } from "@/app/utils/logger";
import Notification from "@/app/api/models/Notification";
import { stage, canAdvance, isLastMonth, whoMustPay, beneficiaryFor, idOf } from "@/app/utils/bcRules";
import { formatPKR } from "@/app/utils/format";

export const dynamic = "force-dynamic";

// PATCH { action: "advance_month" }                 -> next month (or finish on the last month)
// PATCH { action: "end_early", confirm: true }       -> stop the BC now
export async function PATCH(req, { params }) {
  try {
    const auth = await requireCommitteeOwner(req, params.id);
    if (auth.error) return auth.error;
    const c = auth.committee;
    const { action, confirm } = await readJson(req);
    const month = c.currentMonth || 1;

    if (action === "advance_month") {
      const check = canAdvance(c);
      if (!check.ok) return fail(400, check.reason);

      if (isLastMonth(c)) {
        const res = await Committee.updateOne(
          { _id: c._id, currentMonth: month, status: { $ne: "finished" } },
          { status: "finished", finishedAt: new Date() }
        );
        if (!res.modifiedCount) return fail(409, "Already done.");
        await notifyAll(c, auth.user._id, `${c.name} is finished. Thank you!`);
        await createLog({ action: "CLOSE_COMMITTEE", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { month } });
        return ok({ finished: true });
      }

      const res = await Committee.updateOne(
        { _id: c._id, currentMonth: month, status: { $in: ["ongoing", "full"] } },
        { $inc: { currentMonth: 1 }, status: "ongoing" }
      );
      if (!res.modifiedCount) return fail(409, "Month already moved. Refresh the page.");

      const next = month + 1;
      const nextBc = { ...c.toObject(), currentMonth: next };
      const receiver = beneficiaryFor(nextBc, next);
      const payers = whoMustPay(nextBc, next);
      await Notification.insertMany(
        payers.map((id) => ({
          recipient: id,
          recipientModel: "Member",
          sender: auth.user._id,
          senderModel: "Admin",
          type: "month_started",
          message: `${c.name}: month ${next} has started. Please pay Rs ${formatPKR(c.monthlyAmount)}.`,
          link: `/userDash/bc/${c._id}`,
        }))
      );
      if (receiver) {
        await Notification.create({
          recipient: idOf(receiver.member),
          recipientModel: "Member",
          sender: auth.user._id,
          senderModel: "Admin",
          type: "your_turn",
          message: `${c.name}: this month (${next}) is your turn to receive the pot.`,
          link: `/userDash/bc/${c._id}`,
        });
      }
      await createLog({ action: "ADVANCE_MONTH", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { from: month, to: next } });
      return ok({ currentMonth: next });
    }

    if (action === "end_early") {
      if (confirm !== true) return fail(400, "Please confirm.");
      if (stage(c) === "finished") return fail(400, "This BC is already finished.");
      if (stage(c) === "upcoming") return fail(400, "This BC has not started. Delete it instead.");
      await Committee.updateOne({ _id: c._id }, { status: "finished", finishedAt: new Date(), endedEarly: true });
      await notifyAll(c, auth.user._id, `${c.name} was ended by the organizer.`);
      await createLog({ action: "END_COMMITTEE_EARLY", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { month } });
      return ok({ finished: true });
    }

    return fail(400, "Unknown action.");
  } catch (err) {
    return serverError(err, "committee status");
  }
}

async function notifyAll(c, adminId, message) {
  const ids = (c.members || []).map(String);
  if (!ids.length) return;
  await Notification.insertMany(
    ids.map((id) => ({ recipient: id, recipientModel: "Member", sender: adminId, senderModel: "Admin", type: "info", message, link: `/userDash/bc/${c._id}` }))
  );
}
