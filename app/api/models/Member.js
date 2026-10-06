import mongoose from "mongoose";

const passwordLinkSchema = new mongoose.Schema(
  {
    hash: { type: String, select: false },
    purpose: { type: String, enum: ["invite", "reset"] },
    expiresAt: Date,
  },
  { _id: false }
);

const MemberSchema = new mongoose.Schema(
  {
    name: String,
    // Optional. Stored lowercase. Login works with email OR phone.
    email: { type: String, lowercase: true, trim: true },
    // Never returned unless asked for with .select("+password").
    password: { type: String, required: true, select: false },
    // Old reset links (no longer used, kept so old documents still load).
    resetToken: { type: String, select: false },
    // E.164, e.g. "+923001234567". Old documents may still hold a number until migrated.
    phone: { type: String, trim: true },
    phoneLegacy: { type: mongoose.Schema.Types.Mixed, select: false },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: "Committee" }, // legacy
    // invited = added by an organizer, has not set a password yet
    status: { type: String, enum: ["pending", "approved", "invited"], default: "approved" },
    committees: [
      {
        committee: { type: mongoose.Schema.Types.ObjectId, ref: "Committee" },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected", "removed"],
          default: "pending",
        },
      },
    ],
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    pendingOrganizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    // Organizers this member follows to see their new BCs. Gives the organizer NO rights over the member.
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
    createdByAdminName: { type: String, required: false },
    country: { type: String, default: "Pakistan" },
    city: String,
    county: String,
    nicNumber: String,
    nicFront: String,
    nicBack: String,
    electricityBill: String,
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified",
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    payoutDetails: {
      accountTitle: String,
      bankName: String,
      iban: String,
    },
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    passwordLink: { type: passwordLinkSchema, default: undefined },
    // Bump to log out every device (password change, reset).
    tokenVersion: { type: Number, default: 0 },
    loginFails: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

MemberSchema.index({ location: "2dsphere" });

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
export default Member;
