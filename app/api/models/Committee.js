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
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  status: { type: String, enum: ["open", "full"], default: "open" },
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
  }, // New field
  announcementDate: {
    type: Date,
    required: false,
  },
});

export default mongoose.models.Committee ||
  mongoose.model("Committee", CommitteeSchema);
