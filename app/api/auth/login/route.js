import bcrypt from "bcryptjs";
import connectToDatabase from "@/app/utils/db";
import { ok, fail, readJson, serverError } from "@/app/utils/http";
import { parseIdentifier } from "@/app/utils/phone";
import { findAccounts, publicAccount } from "@/app/utils/accounts";
import { signToken } from "@/app/utils/auth";

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
        c.doc.loginFails = (c.doc.loginFails || 0) + 1;
        if (c.doc.loginFails >= MAX_FAILS) {
          c.doc.lockUntil = new Date(now + LOCK_MS);
          c.doc.loginFails = 0;
        }
        await c.doc.constructor.updateOne({ _id: c.doc._id }, { loginFails: c.doc.loginFails, lockUntil: c.doc.lockUntil });
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
