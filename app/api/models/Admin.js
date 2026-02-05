import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: String,
    referralCode: { type: String, unique: true, sparse: true },
    referralScore: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: true },  // Field that distinguishes admin users
    isSuperAdmin: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    country: { type: String, default: "Pakistan" },
    city: String,
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
}, { timestamps: true });

AdminSchema.index({ location: "2dsphere" });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export default Admin;
