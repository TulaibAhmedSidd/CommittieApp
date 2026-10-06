import Member from "@/app/api/models/Member";
import { requireCommitteeOwner } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { createLog } from "@/app/utils/logger";
import { notify } from "@/app/utils/notify";
import { waLink } from "@/app/utils/whatsapp";
import { appUrl } from "@/app/utils/mailer";
import { formatPKR } from "@/app/utils/format";

export const dynamic = "force-dynamic";

// POST { memberId } -> in-app reminder to pay. Returns a WhatsApp link the organizer can also use.
export async function POST(req, { params }) {
  try {
    const auth = await requireCommitteeOwner(req, params.id);
    if (auth.error) return auth.error;
    const c = auth.committee;
    const { memberId } = await readJson(req);
    if (!isObjectId(memberId) || !(c.members || []).some((m) => String(m) === memberId)) return fail(400, "This person is not in the BC.");

    const member = await Member.findById(memberId).select("name phone");
    if (!member) return fail(404, "Member not found.");
    const month = c.currentMonth || 1;
    const text = `Assalam o Alaikum ${member.name}, reminder: please pay Rs ${formatPKR(c.monthlyAmount)} for ${c.name} (month ${month}). ${appUrl(`/userDash/bc/${c._id}`)}`;

    await notify({
      recipient: member,
      model: "Member",
      sender: auth.user._id,
      senderModel: "Admin",
      type: "reminder",
      message: `Reminder: please pay Rs ${formatPKR(c.monthlyAmount)} for ${c.name} (month ${month}).`,
      link: `/userDash/bc/${c._id}`,
    });
    await createLog({ action: "PING_MEMBER", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { memberId } });
    return ok({ done: true, waLink: waLink(member.phone, text) });
  } catch (err) {
    return serverError(err, "ping");
  }
}
