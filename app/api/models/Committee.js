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
  members: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    default: [],
  },
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
      method: { type: String, enum: ["online", "cash"], default: "online" },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      reviewedAt: Date,
      rejectReason: String,
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
      method: { type: String, enum: ["online", "cash"], default: "online" },
      recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    },
  ],
  result: [
    {
      member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      position: Number,
    },
  ],
  pendingMembers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    default: [],
  },
  requireDocuments: { type: Boolean, default: false },
  mandatoryDocuments: { type: [String], default: [] },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  announcementDate: {
    type: Date,
    required: false,
  },
  // 1 = old rules (any duration). 2 = new rules (months = members). Set to 2 on create.
  rulesVersion: { type: Number, default: 1 },
  payoutOrderMode: { type: String, enum: ["random", "manual"] },
  startedAt: Date,
  finishedAt: Date,
  endedEarly: { type: Boolean, default: false },
  statusMigratedFrom: String,
}, { timestamps: true });

export default mongoose.models.Committee ||
  mongoose.model("Committee", CommitteeSchema);
