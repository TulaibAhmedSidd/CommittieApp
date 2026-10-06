import bcrypt from "bcryptjs";
import Member from "@/app/api/models/Member";
import { requireMember, signToken } from "@/app/utils/auth";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { normalizePkPhone, normalizeEmail } from "@/app/utils/phone";
import { isTaken, publicAccount } from "@/app/utils/accounts";
import { MEMBER_SELF } from "@/app/utils/fields";
import { resolveImage } from "@/app/utils/assets";

export const dynamic = "force-dynamic";

const DOC_FIELDS = { nicFront: "CNIC front", nicBack: "CNIC back", electricityBill: "Electricity bill" };

// GET -> my own profile (incl. my documents)
export async function GET(req) {
  try {
    const auth = await requireMember(req);
    if (auth.error) return auth.error;
    const me = await Member.findById(auth.user._id).select(MEMBER_SELF).populate("pendingOrganizers", "name city").lean();
    return ok({ profile: { ...me, _id: String(me._id), phone: me.phone ? String(me.phone) : "" } });
  } catch (err) {
    return serverError(err, "member/profile GET");
  }
}

// PATCH -> update my details, payout bank, documents, password.
// { name?, phone?, email?, city?, nicNumber?, payoutDetails?, location?, nicFront?, nicBack?, electricityBill?,
//   document?: { name, image }, currentPassword?, newPassword? }
export async function PATCH(req) {
  try {
    const auth = await requireMember(req);
    if (auth.error) return auth.error;
    const me = await Member.findById(auth.user._id).select("+password");
    const body = await readJson(req);
    const update = {};
    const s = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : undefined);

    if (s(body.name, 80)?.length >= 2) update.name = s(body.name, 80);
    if (body.city !== undefined) update.city = s(body.city, 60) || "";
    if (body.nicNumber !== undefined) update.nicNumber = String(body.nicNumber || "").replace(/[^\d-]/g, "").slice(0, 15);

    if (body.phone !== undefined) {
      const phone = normalizePkPhone(body.phone);
      if (!phone) return fail(400, "Please enter a valid mobile number.");
      if (await isTaken(Member, { phone }, me._id)) return fail(409, "Another account uses this phone.");
      update.phone = phone;
    }
    if (body.email !== undefined) {
      const email = body.email ? normalizeEmail(body.email) : null;
      if (body.email && !email) return fail(400, "That email does not look right.");
      if (email && (await isTaken(Member, { email }, me._id))) return fail(409, "Another account uses this email.");
      if (email) update.email = email;
      else update.$unset = { email: 1 };
    }
    if (body.payoutDetails && typeof body.payoutDetails === "object") {
      update.payoutDetails = {
        accountTitle: s(body.payoutDetails.accountTitle, 80) || "",
        bankName: s(body.payoutDetails.bankName, 80) || "",
        iban: (s(body.payoutDetails.iban, 40) || "").replace(/\s+/g, "").toUpperCase(),
      };
    }
    if (body.location && Array.isArray(body.location.coordinates)) {
      const [lng, lat] = body.location.coordinates.map(Number);
      if (Number.isFinite(lng) && Number.isFinite(lat) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        update.location = { type: "Point", coordinates: [lng, lat] };
      }
    }

    for (const field of Object.keys(DOC_FIELDS)) {
      if (body[field]) {
        const img = await resolveImage(body[field], me._id, "Member", field);
        if (img.error) return fail(400, img.error);
        update[field] = img.url;
      }
    }
    if (body.document?.name && body.document?.image) {
      const img = await resolveImage(body.document.image, me._id, "Member", body.document.name);
      if (img.error) return fail(400, img.error);
      const name = String(body.document.name).slice(0, 40);
      const docs = (me.documents || []).filter((d) => d.name !== name).map((d) => d.toObject?.() || d);
      update.documents = [...docs, { name, url: img.url, uploadedAt: new Date() }];
    }
    const hasAll = (update.nicFront || me.nicFront) && (update.nicBack || me.nicBack) && (update.electricityBill || me.electricityBill);
    if (hasAll && me.verificationStatus === "unverified") update.verificationStatus = "pending";

    let token;
    if (body.newPassword) {
      if (typeof body.newPassword !== "string" || body.newPassword.length < 6) return fail(400, "New password must be at least 6 characters.");
      if (typeof body.currentPassword !== "string" || !(await bcrypt.compare(body.currentPassword, me.password))) {
        return fail(400, "Your current password is not correct.");
      }
      update.password = await bcrypt.hash(body.newPassword, 10);
      update.tokenVersion = (me.tokenVersion || 0) + 1;
    }

    await Member.updateOne({ _id: me._id }, update);
    const fresh = await Member.findById(me._id);
    if (update.password) token = signToken(fresh, "member");
    return ok({
      account: publicAccount(fresh, "member"),
      verificationStatus: fresh.verificationStatus,
      profile: { nicFront: fresh.nicFront, nicBack: fresh.nicBack, electricityBill: fresh.electricityBill, documents: fresh.documents, payoutDetails: fresh.payoutDetails },
      token,
    });
  } catch (err) {
    return serverError(err, "member/profile PATCH");
  }
}
