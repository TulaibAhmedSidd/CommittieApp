import crypto from "crypto";
import bcrypt from "bcryptjs";
import Admin from "@/app/api/models/Admin";
import Committee from "@/app/api/models/Committee";
import { requireSuperAdmin } from "@/app/utils/auth";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { normalizePkPhone, normalizeEmail } from "@/app/utils/phone";
import { isTaken } from "@/app/utils/accounts";
import { createPasswordLink, linkUpdate } from "@/app/utils/tokens";
import { appUrl, sendMail } from "@/app/utils/mailer";
import { waLink } from "@/app/utils/whatsapp";
import { emails } from "@/app/utils/emailTemplates";
import { createLog } from "@/app/utils/logger";

export const dynamic = "force-dynamic";

// GET ?status=pending|approved|rejected|all -> organizers list (super admin only)
export async function GET(req) {
  try {
    const auth = await requireSuperAdmin(req);
    if (auth.error) return auth.error;
    const status = new URL(req.url).searchParams.get("status") || "pending";
    const filter = status === "all" ? {} : { status };
    const admins = await Admin.find(filter).select("name phone email city status isSuperAdmin verificationStatus createdAt").sort({ createdAt: -1 }).limit(500).lean();
    const counts = await Committee.aggregate([{ $group: { _id: "$createdBy", n: { $sum: 1 } } }]);
    const bcCount = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
    return ok({
      organizers: admins.map((a) => ({ ...a, _id: String(a._id), phone: a.phone ? String(a.phone) : "", bcCount: bcCount[String(a._id)] || 0 })),
    });
  } catch (err) {
    return serverError(err, "organizers GET");
  }
}

// POST { name, phone, email? } -> add an approved organizer. Returns a link to set their password.
export async function POST(req) {
  try {
    const auth = await requireSuperAdmin(req);
    if (auth.error) return auth.error;
    const body = await readJson(req);
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const phone = normalizePkPhone(body.phone);
    const email = body.email ? normalizeEmail(body.email) : null;
    if (name.length < 2) return fail(400, "Please enter a name.");
    if (!phone) return fail(400, "Please enter a valid mobile number.");
    if (body.email && !email) return fail(400, "That email does not look right.");
    const taken = await isTaken(Admin, { phone, email });
    if (taken) return fail(409, `This ${taken} already has an organizer account.`);

    const admin = new Admin({
      name,
      phone,
      email: email || undefined,
      password: await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10),
      status: "approved",
      createdBy: auth.user._id,
    });
    const raw = createPasswordLink(admin, "invite");
    await admin.save();
    await Admin.updateOne({ _id: admin._id }, linkUpdate(admin));

    const link = appUrl(`/invite/${raw}`);
    const text = `Assalam o Alaikum ${name}! You are now an organizer on CommittieApp. Set your password here (works for 7 days): ${link}`;
    if (email) await sendMail({ to: email, ...emails.invite({ name, organizerName: auth.user.name, link }) });
    await createLog({ action: "CREATE_ORGANIZER", performedBy: auth.user._id, onModel: "Admin", targetId: admin._id });
    return ok({ organizer: { _id: String(admin._id), name }, invite: { link, text, waLink: waLink(phone, text) } }, 201);
  } catch (err) {
    return serverError(err, "organizers POST");
  }
}
