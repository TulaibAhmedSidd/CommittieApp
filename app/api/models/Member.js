// import mongoose from 'mongoose';

// const MemberSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
//     status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
// });

// const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);
// export default Member;

import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  resetToken: String,
  password: { type: String, required: true }, // Add password field
  phone: { type: Number, required: false },
  committee: { type: mongoose.Schema.Types.ObjectId, ref: "Committee" },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  committees: [
    {
      committee: { type: mongoose.Schema.Types.ObjectId, ref: "Committee" },
      status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending",
      },
    },
  ],
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  pendingOrganizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }], // For request-approval flow
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false }, // Maintain legacy
  createdByAdminName: { type: String, required: false }, // Store creator's name for easy lookup
  country: { type: String, default: "Pakistan" },
  city: String,
  nicNumber: String,
  nicFront: String, // Explicit field for verification
  nicBack: String,  // Explicit field for verification
  electricityBill: String, // Explicit field for verification
  verificationStatus: {
    type: String,
    enum: ["unverified", "pending", "verified"],
    default: "unverified"
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
});

MemberSchema.index({ location: "2dsphere" });

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
export default Member;
