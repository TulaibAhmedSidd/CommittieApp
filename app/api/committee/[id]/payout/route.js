import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import { requireCommitteeOwner } from "@/app/utils/auth";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { createLog } from "@/app/utils/logger";
import { notify } from "@/app/utils/notify";
import { emails } from "@/app/utils/emailTemplates";
import { resolveImage } from "@/app/utils/assets";
import { stage, beneficiaryFor, payoutFor, potAmount, idOf } from "@/app/utils/bcRules";
import { formatPKR } from "@/app/utils/format";

export const dynamic = "force-dynamic";

// POST { method: "cash" | "online", amount?, transactionId?, screenshot? } -> record this month's payout.
export async function POST(req, { params }) {
  try {
    const auth = await requireCommitteeOwner(req, params.id);
    if (auth.error) return auth.error;
    const c = auth.committee;
    const body = await readJson(req);

    if (stage(c) !== "running") return fail(400, "This BC is not running.");
    const month = c.currentMonth || 1;
    const receiver = beneficiaryFor(c, month);
    if (!receiver) return fail(400, "No payout order yet. Start the BC first.");
    if (payoutFor(c, month)) return fail(409, "Payout for this month is already recorded.");

    const pot = potAmount(c, month);
    const amount = body.amount !== undefined && body.amount !== "" ? Math.round(Number(body.amount)) : pot;
    if (!(amount > 0)) return fail(400, "Enter the amount given.");

    const method = body.method === "online" ? "online" : "cash";
    let screenshot = "";
    if (body.screenshot) {
      const img = await resolveImage(body.screenshot, auth.user._id, "Admin", `payout-${c._id}-m${month}`);
      if (img.error) return fail(400, img.error);
      screenshot = img.url;
    }

    const res = await Committee.updateOne(
      { _id: c._id, currentMonth: month, "payouts.month": { $ne: month } },
      {
        $push: {
          payouts: {
            month,
            member: idOf(receiver.member),
            amount,
            method,
            transactionId: typeof body.transactionId === "string" ? body.transactionId.trim().slice(0, 60) : "",
            screenshot,
            paidAt: new Date(),
            recordedBy: auth.user._id,
          },
        },
      }
    );
    if (!res.modifiedCount) return fail(409, "Payout for this month is already recorded.");

    const member = await Member.findById(idOf(receiver.member)).select("name email");
    if (member) {
      await notify({
        recipient: member,
        model: "Member",
        sender: auth.user._id,
        senderModel: "Admin",
        type: "payout",
        message: `You got your payout of Rs ${formatPKR(amount)} from ${c.name}.`,
        link: `/userDash/bc/${c._id}`,
        email: emails.payoutRecorded({ name: member.name, bcName: c.name, bcId: c._id, amountText: `Rs ${formatPKR(amount)}` }),
      });
    }
    await createLog({ action: "RECORD_PAYOUT", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { month, amount, method } });
    return ok({ done: true });
  } catch (err) {
    return serverError(err, "payout POST");
  }
}
