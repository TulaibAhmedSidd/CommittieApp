import Admin from "@/app/api/models/Admin";
import Member from "@/app/api/models/Member";
import { requireAdmin } from "@/app/utils/auth";
import { ok, serverError } from "@/app/utils/http";
import { randomCode } from "@/app/utils/tokens";
import { appUrl } from "@/app/utils/mailer";
import { waLink } from "@/app/utils/whatsapp";

export const dynamic = "force-dynamic";

// GET -> my invite link (referral) and how many people joined with it.
export async function GET(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const admin = auth.user;

    let code = admin.referralCode;
    for (let i = 0; !code && i < 5; i++) {
      const candidate = randomCode();
      const res = await Admin.updateOne({ _id: admin._id, referralCode: { $exists: false } }, { referralCode: candidate }).catch(() => null);
      if (res?.modifiedCount) code = candidate;
      else code = (await Admin.findById(admin._id).select("referralCode"))?.referralCode;
    }

    const link = appUrl(`/join/${code}`);
    const text = `Assalam o Alaikum! Join my BC group on CommittieApp. Make your account here: ${link}`;
    const joined = await Member.countDocuments({ referredBy: admin._id });
    return ok({ referralCode: code, link, text, waLink: waLink(null, text), joined, score: admin.referralScore || 0 });
  } catch (err) {
    return serverError(err, "admin/referral");
  }
}
