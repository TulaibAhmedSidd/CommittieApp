import bcrypt from "bcryptjs";
import Admin from "@/app/api/models/Admin";
import { requireAdmin } from "@/app/utils/auth";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { normalizePkPhone, normalizeEmail } from "@/app/utils/phone";
import { isTaken, publicAccount } from "@/app/utils/accounts";
import { ADMIN_SELF } from "@/app/utils/fields";
import { saveImage, assetIdFromUrl } from "@/app/utils/assets";
import { signToken } from "@/app/utils/auth";

export const dynamic = "force-dynamic";

// GET -> my organizer profile
export async function GET(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const me = await Admin.findById(auth.user._id).select(ADMIN_SELF).lean();
    return ok({ profile: { ...me, _id: String(me._id), phone: me.phone ? String(me.phone) : "" } });
  } catch (err) {
    return serverError(err, "admin/profile GET");
  }
}

// PATCH { name?, phone?, email?, city?, nicNumber?, nicImage?, currentPassword?, newPassword? }
export async function PATCH(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const me = await Admin.findById(auth.user._id).select("+password");
    const body = await readJson(req);
    const update = {};

    if (typeof body.name === "string" && body.name.trim().length >= 2) update.name = body.name.trim().slice(0, 80);
    if (typeof body.city === "string") update.city = body.city.trim().slice(0, 60);
    if (typeof body.nicNumber === "string") update.nicNumber = body.nicNumber.replace(/[^\d-]/g, "").slice(0, 15);

    if (body.phone !== undefined) {
      const phone = normalizePkPhone(body.phone);
      if (!phone) return fail(400, "Please enter a valid mobile number.");
      if (await isTaken(Admin, { phone }, me._id)) return fail(409, "Another organizer uses this phone.");
      update.phone = phone;
    }
    if (body.email !== undefined) {
      const email = body.email ? normalizeEmail(body.email) : null;
      if (body.email && !email) return fail(400, "That email does not look right.");
      if (email && (await isTaken(Admin, { email }, me._id))) return fail(409, "Another organizer uses this email.");
      if (!email && !(update.phone || me.phone)) return fail(400, "Keep at least a phone or an email.");
      if (email) update.email = email;
      else update.$unset = { email: 1 };
    }

    if (body.nicImage) {
      if (String(body.nicImage).startsWith("data:")) {
        const img = await saveImage(body.nicImage, me._id, "Admin", "organizer-cnic");
        if (img.error) return fail(400, img.error);
        update.nicImage = img.url;
      } else if (assetIdFromUrl(body.nicImage)) {
        update.nicImage = body.nicImage;
      }
      if (me.verificationStatus !== "verified") update.verificationStatus = "pending";
    }

    let token;
    if (body.newPassword) {
      if (typeof body.newPassword !== "string" || body.newPassword.length < 6) return fail(400, "New password must be at least 6 characters.");
      if (typeof body.currentPassword !== "string" || !(await bcrypt.compare(body.currentPassword, me.password))) {
        return fail(400, "Your current password is not correct.");
      }
      update.password = await bcrypt.hash(body.newPassword, 10);
      update.tokenVersion = (me.tokenVersion || 0) + 1;
    }

    await Admin.updateOne({ _id: me._id }, update);
    const fresh = await Admin.findById(me._id);
    if (update.password) token = signToken(fresh, "admin");
    return ok({ account: publicAccount(fresh, "admin"), token });
  } catch (err) {
    return serverError(err, "admin/profile PATCH");
  }
}
