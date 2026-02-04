import mongoose from "mongoose";

const CommitteeSchema = new mongoose.Schema({
  name: String,
  description: String,
  maxMembers: Number,
  monthlyAmount: Number,
  monthDuration: Number,
  totalAmount: Number,
  startDate: Date, // Added start date field
  endDate: Date, // Added end date field
  bankDetails: {
    accountTitle: String,
    bankName: String,
    iban: String,
  },
  organizerFee: { type: Number, default: 0 },
  isFeeMandatory: { type: Boolean, default: false },
  currentMonth: { type: Number, default: 1 },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  status: {
    type: String,
    enum: ["open", "full", "ongoing", "finished"],
    default: "open"
  },
  payments: [
    {
      month: Number,
      member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      status: {
        type: String,
        enum: ["unpaid", "pending", "verified", "rejected"],
        default: "unpaid"
      },
      submission: {
        screenshot: String,
        description: String,
        transactionId: String,
        submittedAt: Date,
      },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  payouts: [
    {
      month: Number,
      member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      amount: Number,
      transactionId: String,
      screenshot: String,
      paidAt: { type: Date, default: Date.now },
    },
  ],
  result: [
    {
      member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      position: Number,
    },
  ],
  pendingMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  announcementDate: {
    type: Date,
    required: false,
  },
});

export default mongoose.models.Committee ||
  mongoose.model("Committee", CommitteeSchema);
