import Admin from "@/app/api/models/Admin";
import { requireSuperAdmin } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { notify } from "@/app/utils/notify";
import { emails } from "@/app/utils/emailTemplates";
import { createLog } from "@/app/utils/logger";

export const dynamic = "force-dynamic";

// PATCH { status: "approved" | "rejected" } -> approve or reject an organizer (super admin only)
export async function PATCH(req, { params }) {
  try {
    const auth = await requireSuperAdmin(req);
    if (auth.error) return auth.error;
    if (!isObjectId(params.id)) return fail(400, "Invalid organizer.");
    const { status } = await readJson(req);
    if (!["approved", "rejected"].includes(status)) return fail(400, "Unknown status.");
    if (String(params.id) === String(auth.user._id)) return fail(400, "You can't change your own account.");

    const admin = await Admin.findById(params.id).select("name email status isSuperAdmin");
    if (!admin) return fail(404, "Organizer not found.");
    if (admin.isSuperAdmin) return fail(400, "You can't change a super admin.");

    await Admin.updateOne({ _id: admin._id }, { status, $inc: { tokenVersion: status === "rejected" ? 1 : 0 } });
    if (status === "approved") {
      await notify({
        recipient: admin,
        model: "Admin",
        sender: auth.user._id,
        senderModel: "Admin",
        message: "Your organizer account is approved. You can now create a BC.",
        link: "/admin",
        email: emails.organizerApproved({ name: admin.name }),
      });
    }
    await createLog({ action: status === "approved" ? "APPROVE_ORGANIZER" : "REJECT_ORGANIZER", performedBy: auth.user._id, onModel: "Admin", targetId: admin._id });
    return ok({ done: true });
  } catch (err) {
    return serverError(err, "organizers PATCH");
  }
}
