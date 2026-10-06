import Member from "@/app/api/models/Member";
import { requireMember } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { notify } from "@/app/utils/notify";

export const dynamic = "force-dynamic";

// POST { adminId, action: "approve" | "reject" } -> member answers an organizer's request.
export async function POST(req) {
  try {
    const auth = await requireMember(req);
    if (auth.error) return auth.error;
    const { adminId, action } = await readJson(req);
    if (!isObjectId(adminId) || !["approve", "reject"].includes(action)) return fail(400, "Invalid request.");
    const me = auth.user;
    if (!(me.pendingOrganizers || []).some((id) => String(id) === adminId)) return fail(400, "No request from this organizer.");

    const update = { $pull: { pendingOrganizers: adminId } };
    if (action === "approve") update.$addToSet = { organizers: adminId };
    await Member.updateOne({ _id: me._id }, update);

    if (action === "approve") {
      await notify({
        recipient: adminId,
        model: "Admin",
        sender: me._id,
        senderModel: "Member",
        message: `${me.name} accepted your request.`,
        link: "/admin/members",
      });
    }
    return ok({ done: true });
  } catch (err) {
    return serverError(err, "respond-request");
  }
}
