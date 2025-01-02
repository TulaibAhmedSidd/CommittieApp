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
});

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
export default Member;
