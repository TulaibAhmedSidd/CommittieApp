import bcrypt from "bcryptjs";
import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";
import Member from "@/app/api/models/Member";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { normalizePkPhone, normalizeEmail } from "@/app/utils/phone";
import { isTaken, publicAccount } from "@/app/utils/accounts";
import { signToken } from "@/app/utils/auth";
import { notify } from "@/app/utils/notify";
import { limit, clientIp } from "@/app/utils/rateLimit";

export const dynamic = "force-dynamic";

// POST { role: "member" | "organizer", name, phone, email?, password, city?, referralCode? }
// Members can log in right away. Organizers wait for super admin approval.
export async function POST(req) {
  try {
    const body = await readJson(req);
    const role = body.role === "organizer" ? "organizer" : "member";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const phone = normalizePkPhone(body.phone);
    const email = body.email ? normalizeEmail(body.email) : null;
    const password = typeof body.password === "string" ? body.password : "";
    const city = typeof body.city === "string" ? body.city.trim().slice(0, 60) : undefined;

    if (name.length < 2) return fail(400, "Please enter your name.");
    if (!phone) return fail(400, "Please enter a valid mobile number, e.g. 0300 1234567.");
    if (body.email && !email) return fail(400, "That email does not look right. You can leave it empty.");
    if (password.length < 6) return fail(400, "Password must be at least 6 characters.");

    await connectToDatabase();
    const limited = await limit([[`register:ip:${clientIp(req)}`, 10, 3600]]);
    if (limited) return limited;
    const Model = role === "organizer" ? Admin : Member;
    const taken = await isTaken(Model, { phone, email });
    if (taken === "phone") return fail(409, "This phone number already has an account. Please log in.");
    if (taken === "email") return fail(409, "This email already has an account. Please log in.");

    const hashed = await bcrypt.hash(password, 10);

    if (role === "organizer") {
      await Admin.create({ name, phone, email: email || undefined, password: hashed, city, status: "pending", isAdmin: true });
      return ok({ pending: true, message: "Thanks! Your organizer account will be checked by the admin. You can log in after approval." }, 201);
    }

    let referrer = null;
    if (typeof body.referralCode === "string" && body.referralCode.trim()) {
      referrer = await Admin.findOne({ referralCode: body.referralCode.trim().toUpperCase(), status: "approved" }).select("_id name");
    }

    const member = await Member.create({
      name,
      phone,
      email: email || undefined,
      password: hashed,
      city,
      status: "approved",
      referredBy: referrer?._id,
      organizers: referrer ? [referrer._id] : [],
      // Not createdBy: a self-signup owns their account (the organizer cannot make password links for them).
    });

    if (referrer) {
      await Admin.updateOne({ _id: referrer._id }, { $inc: { referralScore: 1 } });
      await notify({
        recipient: referrer._id,
        model: "Admin",
        message: `${name} joined using your invite link.`,
        link: "/admin/members",
        type: "info",
      });
    }

    return ok({ token: signToken(member, "member"), account: publicAccount(member, "member") }, 201);
  } catch (err) {
    return serverError(err, "auth/register");
  }
}
