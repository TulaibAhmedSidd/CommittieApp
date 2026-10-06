import Member from "@/app/api/models/Member";
import Admin from "@/app/api/models/Admin";
import { requireUser } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { notify } from "@/app/utils/notify";

export const dynamic = "force-dynamic";

// POST { memberId } (organizer) -> ask a member to join my members list (member must accept).
// POST { adminId }  (member)    -> follow an organizer, to see their upcoming BCs.
export async function POST(req) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;
    const body = await readJson(req);

    if (auth.isAdmin) {
      if (!isObjectId(body.memberId)) return fail(400, "Invalid member.");
      const member = await Member.findById(body.memberId).select("name organizers pendingOrganizers status");
      if (!member || member.status === "invited") return fail(404, "Member not found.");
      const me = String(auth.user._id);
      if ((member.organizers || []).some((o) => String(o) === me)) return fail(400, "Already in your members list.");
      if ((member.pendingOrganizers || []).some((o) => String(o) === me)) return fail(400, "Request already sent.");
      await Member.updateOne({ _id: member._id }, { $addToSet: { pendingOrganizers: auth.user._id } });
      await notify({
        recipient: member,
        model: "Member",
        sender: auth.user._id,
        senderModel: "Admin",
        type: "connect_request",
        message: `${auth.user.name} (organizer) wants to add you to their members.`,
        details: { adminId: me },
        link: "/userDash/notifications",
      });
      return ok({ sent: true });
    }

    if (!isObjectId(body.adminId)) return fail(400, "Invalid organizer.");
    const admin = await Admin.findOne({ _id: body.adminId, status: "approved" }).select("name");
    if (!admin) return fail(404, "Organizer not found.");
    await Member.updateOne({ _id: auth.user._id }, { $addToSet: { organizers: admin._id }, $pull: { pendingOrganizers: admin._id } });
    await notify({
      recipient: admin._id,
      model: "Admin",
      sender: auth.user._id,
      senderModel: "Member",
      type: "info",
      message: `${auth.user.name} added you as their organizer.`,
      link: "/admin/members",
    });
    return ok({ following: true });
  } catch (err) {
    return serverError(err, "member/pool");
  }
}
