import mongoose from 'mongoose';

const passwordLinkSchema = new mongoose.Schema(
    {
        hash: { type: String, select: false },
        purpose: { type: String, enum: ['invite', 'reset'] },
        expiresAt: Date,
    },
    { _id: false }
);

// Admin = organizer. isSuperAdmin = platform owner (set by hand in the database).
const AdminSchema = new mongoose.Schema({
    name: String,
    // Optional now: organizers can log in with phone. Unique index is partial (see migration).
    email: { type: String, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    phoneLegacy: { type: mongoose.Schema.Types.Mixed, select: false },
    referralCode: { type: String, unique: true, sparse: true },
    referralScore: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: true },
    isSuperAdmin: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    country: { type: String, default: "Pakistan" },
    city: String,
    county: String,
    nicNumber: String,
    nicImage: String,
    verificationStatus: {
        type: String,
        enum: ["unverified", "pending", "verified"],
        default: "unverified"
    },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
    },
    passwordLink: { type: passwordLinkSchema, default: undefined },
    tokenVersion: { type: Number, default: 0 },
    loginFails: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
    lastLoginAt: Date,
}, { timestamps: true });

AdminSchema.index({ location: "2dsphere" });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export default Admin;
