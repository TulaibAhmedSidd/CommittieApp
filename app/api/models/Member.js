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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // New field

});

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
export default Member;
