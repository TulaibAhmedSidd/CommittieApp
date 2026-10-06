import crypto from "crypto";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import { requireCommitteeOwner } from "@/app/utils/auth";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { createLog } from "@/app/utils/logger";
import { notify } from "@/app/utils/notify";
import { emails } from "@/app/utils/emailTemplates";
import { canStart, shuffle, monthLabel, potAmount } from "@/app/utils/bcRules";
import { formatPKR } from "@/app/utils/format";

export const dynamic = "force-dynamic";

// POST { mode: "random" | "manual", order?: [memberId, ...] } -> start the BC and fix the payout order.
export async function POST(req, { params }) {
  try {
    const auth = await requireCommitteeOwner(req, params.id);
    if (auth.error) return auth.error;
    const c = auth.committee;
    const { mode, order } = await readJson(req);

    const check = canStart(c);
    if (!check.ok) return fail(400, check.reason);

    const memberIds = c.members.map(String);
    let ordered;
    if (mode === "manual") {
      if (!Array.isArray(order) || order.length !== memberIds.length) return fail(400, "Put every member in the order once.");
      const set = new Set(order.map(String));
      if (set.size !== memberIds.length || !memberIds.every((id) => set.has(id))) return fail(400, "Put every member in the order once.");
      ordered = order.map(String);
    } else {
      ordered = shuffle(memberIds, (n) => crypto.randomInt(n));
    }
    const result = ordered.map((member, i) => ({ member, position: i + 1 }));

    const updated = await Committee.findOneAndUpdate(
      { _id: c._id, status: { $in: ["open", "full"] }, "result.0": { $exists: false } },
      {
        result,
        status: "ongoing",
        currentMonth: 1,
        startedAt: new Date(),
        payoutOrderMode: mode === "manual" ? "manual" : "random",
        announcementDate: new Date(),
      },
      { new: true }
    );
    if (!updated) return fail(409, "This BC has already started.");

    const pot = potAmount(updated, 1);
    const members = await Member.find({ _id: { $in: ordered } }).select("name email");
    const byId = Object.fromEntries(members.map((m) => [String(m._id), m]));
    for (const r of result) {
      const m = byId[r.member];
      if (!m) continue;
      const turn = `Month ${r.position} (${monthLabel(updated, r.position)})`;
      await notify({
        recipient: m,
        model: "Member",
        sender: auth.user._id,
        senderModel: "Admin",
        type: "bc_started",
        message: `${c.name} has started. Your turn: ${turn}.`,
        link: `/userDash/bc/${c._id}`,
        email: emails.bcStarted({ name: m.name, bcName: c.name, bcId: c._id, turnLabel: turn, amountText: `Rs ${formatPKR(pot)}` }),
      });
    }

    await createLog({ action: "START_COMMITTEE", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { mode: mode === "manual" ? "manual" : "random" } });
    return ok({ started: true });
  } catch (err) {
    return serverError(err, "committee start");
  }
}
