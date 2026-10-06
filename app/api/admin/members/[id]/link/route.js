import Member from "@/app/api/models/Member";
import { requireAdmin, adminCanResetMember } from "@/app/utils/auth";
import { ok, fail, serverError, isObjectId } from "@/app/utils/http";
import { makePasswordLinkMessage } from "@/app/utils/invites";
import { linkUpdate } from "@/app/utils/tokens";
import { createLog } from "@/app/utils/logger";
import { notify } from "@/app/utils/notify";

export const dynamic = "force-dynamic";

// POST -> new invite / password link for one of my members, to send on WhatsApp.
export async function POST(req, { params }) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    if (!isObjectId(params.id)) return fail(400, "Invalid member.");
    const member = await Member.findById(params.id).select("name phone status organizers createdBy referredBy");
    if (!member) return fail(404, "Member not found in your list.");
    if (!adminCanResetMember(auth.user, member)) {
      return fail(403, "Only the organizer who added this member can make a password link. They can use Forgot password instead.");
    }

    const invite = makePasswordLinkMessage(member, auth.user.name);
    await Member.updateOne({ _id: member._id }, linkUpdate(member));

    if (member.status !== "invited") {
      await notify({
        recipient: member,
        model: "Member",
        sender: auth.user._id,
        senderModel: "Admin",
        type: "security",
        message: `${auth.user.name} created a new password link for you. If you did not ask for it, tell them.`,
      });
    }
    await createLog({ action: "CREATE_PASSWORD_LINK", performedBy: auth.user._id, onModel: "Admin", targetId: member._id, details: { purpose: invite.purpose } });
    return ok({ invite });
  } catch (err) {
    return serverError(err, "admin/members link");
  }
}
