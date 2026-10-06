import Admin from "@/app/api/models/Admin";
import { requireSuperAdmin } from "@/app/utils/auth";
import { ok, fail, serverError, isObjectId } from "@/app/utils/http";
import { createPasswordLink, linkUpdate } from "@/app/utils/tokens";
import { appUrl } from "@/app/utils/mailer";
import { waLink } from "@/app/utils/whatsapp";
import { createLog } from "@/app/utils/logger";

export const dynamic = "force-dynamic";

// POST -> new password link for an organizer (super admin only), to send on WhatsApp.
export async function POST(req, { params }) {
  try {
    const auth = await requireSuperAdmin(req);
    if (auth.error) return auth.error;
    if (!isObjectId(params.id)) return fail(400, "Invalid organizer.");
    const admin = await Admin.findById(params.id).select("name phone isSuperAdmin");
    if (!admin) return fail(404, "Organizer not found.");
    const raw = createPasswordLink(admin, "reset");
    await Admin.updateOne({ _id: admin._id }, linkUpdate(admin));
    const link = appUrl(`/invite/${raw}`);
    const text = `Assalam o Alaikum ${admin.name}! Set a new CommittieApp password here (works for 1 hour): ${link}`;
    await createLog({ action: "CREATE_PASSWORD_LINK", performedBy: auth.user._id, onModel: "Admin", targetId: admin._id });
    return ok({ invite: { link, text, waLink: waLink(admin.phone, text) } });
  } catch (err) {
    return serverError(err, "organizers link");
  }
}
