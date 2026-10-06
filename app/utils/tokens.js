import crypto from "crypto";

// One-time password links (invite + reset). Only the sha256 hash is stored.

export const LINK_TTL = {
  invite: 7 * 24 * 60 * 60 * 1000, // 7 days
  reset: 60 * 60 * 1000, // 1 hour
};

export function hashToken(raw) {
  return crypto.createHash("sha256").update(String(raw)).digest("hex");
}

/** Create a new link on the doc (does not save). Returns the raw token for the URL. */
export function createPasswordLink(doc, purpose = "reset", now = Date.now()) {
  const raw = crypto.randomBytes(32).toString("base64url");
  doc.passwordLink = {
    hash: hashToken(raw),
    purpose,
    expiresAt: new Date(now + (LINK_TTL[purpose] || LINK_TTL.reset)),
  };
  return raw;
}

/** True when the token matches the doc's link and has not expired. */
export function isLinkValid(doc, raw, now = Date.now()) {
  const link = doc?.passwordLink;
  if (typeof raw !== "string" || raw.length < 20 || !link?.hash || !link?.expiresAt) return false;
  if (new Date(link.expiresAt).getTime() < now) return false;
  const a = Buffer.from(hashToken(raw));
  const b = Buffer.from(String(link.hash));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Short random code, e.g. referral codes: "REF-7KQ2MX". */
export function randomCode(prefix = "REF-", length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[crypto.randomInt(alphabet.length)];
  return prefix + out;
}

/** Plain update object for the link just created on doc (use with Model.updateOne). */
export function linkUpdate(doc) {
  const l = doc.passwordLink;
  return { passwordLink: { hash: l.hash, purpose: l.purpose, expiresAt: l.expiresAt } };
}
