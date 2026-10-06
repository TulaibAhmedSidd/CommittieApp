import mongoose from "mongoose";

// Counters for app/utils/rateLimit.js. A TTL index on expiresAt (created by the migration) removes old rows.
const RateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, index: true },
  count: { type: Number, default: 1 },
  expiresAt: { type: Date, required: true },
});

export default mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
