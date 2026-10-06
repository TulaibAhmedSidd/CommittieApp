import bcrypt from "bcryptjs";
import connectToDatabase from "@/app/utils/db";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { parseIdentifier } from "@/app/utils/phone";
import { findAccounts, publicAccount } from "@/app/utils/accounts";
import { signToken } from "@/app/utils/auth";
import { limit, clientIp } from "@/app/utils/rateLimit";

export const dynamic = "force-dynamic";

const MAX_FAILS = 10;
const LOCK_MS = 15 * 60 * 1000;

// POST { identifier: "email or phone", password, role?: "admin" | "member" }
// role is only needed when the same phone/email has both an organizer and a member account.
export async function POST(req) {
  try {
    const { identifier, password, role } = await readJson(req);
    const id = parseIdentifier(identifier);
    if (!id || typeof password !== "string" || !password) {
      return fail(400, "Enter your email or phone number, and your password.");
    }

    await connectToDatabase();
    const idKey = id.email || id.phone;
    const limited = await limit([[`login:ip:${clientIp(req)}`, 30, 600], [`login:id:${idKey}`, 15, 600]]);
    if (limited) return limited;
    const { admins, members } = await findAccounts(id);
    const candidates = [
      ...admins.map((doc) => ({ doc, role: "admin" })),
      ...members.map((doc) => ({ doc, role: "member" })),
    ].filter((c) => !role || c.role === role);

    if (!candidates.length) return fail(401, "Wrong email/phone or password.");

    const now = Date.now();
    const matches = [];
    let locked = false;
    for (const c of candidates) {
      if (c.doc.lockUntil && c.doc.lockUntil.getTime() > now) {
        locked = true;
        continue;
      }
      const good = c.doc.password && (await bcrypt.compare(password, c.doc.password));
      if (good) {
        matches.push(c);
      } else {
        // Atomic counter: two wrong tries at once both count.
        const after = await c.doc.constructor.findOneAndUpdate({ _id: c.doc._id }, { $inc: { loginFails: 1 } }, { new: true }).select("+loginFails");
        if ((after?.loginFails || 0) >= MAX_FAILS) {
          await c.doc.constructor.updateOne({ _id: c.doc._id }, { loginFails: 0, lockUntil: new Date(now + LOCK_MS) });
        }
      }
    }

    if (!matches.length) {
      return fail(locked ? 429 : 401, locked ? "Too many wrong tries. Try again in 15 minutes." : "Wrong email/phone or password.");
    }

    if (matches.length > 1) {
      return ok({ choose: matches.map((m) => m.role) });
    }

    const { doc, role: matchedRole } = matches[0];

    if (matchedRole === "admin" && doc.status !== "approved") {
      return fail(403, doc.status === "rejected" ? "Your organizer request was not approved." : "Your organizer account is waiting for approval.");
    }
    if (matchedRole === "member" && doc.status === "invited") {
      return fail(403, "Open the invite link your organizer sent to set your password.");
    }

    await doc.constructor.updateOne({ _id: doc._id }, { loginFails: 0, lockUntil: null, lastLoginAt: new Date() });

    return ok({ token: signToken(doc, matchedRole), account: publicAccount(doc, matchedRole) });
  } catch (err) {
    return serverError(err, "auth/login");
  }
}
