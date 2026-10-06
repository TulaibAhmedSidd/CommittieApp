import bcrypt from "bcryptjs";
import connectToDatabase from "@/app/utils/db";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { signToken } from "@/app/utils/auth";
import { publicAccount, findByLinkToken } from "@/app/utils/accounts";
import { limit, clientIp } from "@/app/utils/rateLimit";

export const dynamic = "force-dynamic";

// POST { token, password } -> sets password, logs the user in.
export async function POST(req) {
  try {
    const { token, password } = await readJson(req);
    if (typeof password !== "string" || password.length < 6) return fail(400, "Password must be at least 6 characters.");

    await connectToDatabase();
    const limited = await limit([[`setpw:ip:${clientIp(req)}`, 20, 600]]);
    if (limited) return limited;
    const found = await findByLinkToken(token);
    if (!found) return fail(400, "This link has expired or was already used. Ask for a new one.");

    const { doc, role } = found;
    const update = {
      password: await bcrypt.hash(password, 10),
      $unset: { passwordLink: 1 },
      $inc: { tokenVersion: 1 },
      loginFails: 0,
      lockUntil: null,
    };
    if (role === "member" && doc.status === "invited") update.status = "approved";
    const res = await doc.constructor.updateOne({ _id: doc._id, "passwordLink.hash": doc.passwordLink.hash }, update);
    if (!res.modifiedCount) return fail(400, "This link was already used. Ask for a new one.");

    const fresh = await doc.constructor.findById(doc._id);
    if (role === "admin" && fresh.status !== "approved") {
      return ok({ pending: true, message: "Password saved. You can log in after your account is approved." });
    }
    return ok({ token: signToken(fresh, role), account: publicAccount(fresh, role) });
  } catch (err) {
    return serverError(err, "auth/set-password");
  }
}
