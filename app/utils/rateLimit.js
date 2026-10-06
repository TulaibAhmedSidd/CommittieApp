import RateLimit from "../api/models/RateLimit";
import { fail } from "./http";

export function clientIp(req) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Count one hit for key. Returns true if still under the limit.
 * Fails open (returns true) if the database call itself fails, so the app keeps working.
 */
export async function hit(key, limit, windowSec) {
  try {
    const now = new Date();
    const doc = await RateLimit.findOneAndUpdate({ key, expiresAt: { $gt: now } }, { $inc: { count: 1 } }, { new: true });
    if (doc) return doc.count <= limit;
    await RateLimit.create({ key, count: 1, expiresAt: new Date(now.getTime() + windowSec * 1000) });
    return true;
  } catch (err) {
    console.error("[rateLimit]", err?.message);
    return true;
  }
}

/** Check several limits; returns a 429 Response if any is over, else null. */
export async function limit(rules) {
  for (const [key, max, windowSec] of rules) {
    if (!(await hit(key, max, windowSec))) return fail(429, "Too many tries. Please wait a few minutes and try again.");
  }
  return null;
}
