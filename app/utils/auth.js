import jwt from "jsonwebtoken";
import connectToDatabase from "./db";
import Admin from "../api/models/Admin";
import Member from "../api/models/Member";
import Committee from "../api/models/Committee";
import { fail, isObjectId } from "./http";

// Usage in a route:
//   const auth = await requireAdmin(req);
//   if (auth.error) return auth.error;
//   auth.user   -> the Admin/Member document (from the database, not the token)
//
// Identity always comes from the verified token + database, never from the request body.

const TOKEN_TTL = "14d";

function secret() {
  const s = process.env.JWT_SECRET || "";
  if (s.length < 32) {
    // Fail closed: a short secret can be guessed and tokens forged.
    if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET must be at least 32 characters. See .env.example.");
    console.warn("[security] JWT_SECRET is shorter than 32 characters. Rotate it (see .env.example).");
  }
  return s;
}

export function signToken(account, role) {
  return jwt.sign(
    {
      userId: String(account._id),
      role,
      isAdmin: role === "admin",
      tv: account.tokenVersion || 0,
    },
    secret(),
    { expiresIn: TOKEN_TTL }
  );
}

function getBearerToken(req) {
  const header = req.headers.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

function decode(req) {
  const token = getBearerToken(req);
  if (!token) return { error: fail(401, "Please log in.") };
  try {
    const payload = jwt.verify(token, secret(), { algorithms: ["HS256"] });
    const role = payload.role;
    // Only tokens made by signToken (they always carry role + tv). Old-format tokens are refused.
    if (!isObjectId(payload.userId) || !["admin", "member"].includes(role) || typeof payload.tv !== "number") {
      return { error: fail(401, "Please log in again.") };
    }
    return { payload, role };
  } catch {
    return { error: fail(401, "Please log in again.") };
  }
}

/** Any logged-in user (organizer or member). */
export async function requireUser(req) {
  const d = decode(req);
  if (d.error) return d;
  await connectToDatabase();
  const Model = d.role === "admin" ? Admin : Member;
  const user = await Model.findById(d.payload.userId);
  if (!user) return { error: fail(401, "Please log in again.") };
  if ((user.tokenVersion || 0) !== (d.payload.tv || 0)) return { error: fail(401, "Please log in again.") };
  if (d.role === "admin" && user.status !== "approved") return { error: fail(403, "Your organizer account is waiting for approval.") };
  if (d.role === "member" && user.status === "invited") return { error: fail(403, "Open your invite link to set a password first.") };
  return { user, role: d.role, model: d.role === "admin" ? "Admin" : "Member", isAdmin: d.role === "admin" };
}

export async function requireAdmin(req) {
  const auth = await requireUser(req);
  if (auth.error) return auth;
  if (!auth.isAdmin) return { error: fail(403, "Only organizers can do this.") };
  return auth;
}

export async function requireSuperAdmin(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth;
  if (!auth.user.isSuperAdmin) return { error: fail(403, "Only the super admin can do this.") };
  return auth;
}

export async function requireMember(req) {
  const auth = await requireUser(req);
  if (auth.error) return auth;
  if (auth.isAdmin) return { error: fail(403, "Please log in with your member account.") };
  return auth;
}

/** Organizer who owns the BC (or super admin). Returns { user, committee }. */
export async function requireCommitteeOwner(req, committeeId) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth;
  if (!isObjectId(String(committeeId))) return { error: fail(400, "Invalid BC id.") };
  const committee = await Committee.findById(committeeId);
  if (!committee) return { error: fail(404, "BC not found.") };
  if (String(committee.createdBy) !== String(auth.user._id) && !auth.user.isSuperAdmin) {
    return { error: fail(403, "This is not your BC.") };
  }
  return { ...auth, committee };
}

/** True if this organizer may make password links for this member: only members they created (or super admin). */
export function adminCanResetMember(admin, member) {
  if (!admin || !member) return false;
  return !!admin.isSuperAdmin || String(member.createdBy || "") === String(admin._id);
}

/** True if this organizer may manage this member (linked to them with consent, created by them, or super admin). */
export function adminCanManageMember(admin, member) {
  if (!admin || !member) return false;
  if (admin.isSuperAdmin) return true;
  const id = String(admin._id);
  return (
    (member.organizers || []).some((o) => String(o) === id) ||
    String(member.createdBy || "") === id ||
    String(member.referredBy || "") === id
  );
}
