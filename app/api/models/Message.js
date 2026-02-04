import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, refPath: "senderModel", required: true },
    senderModel: { type: String, required: true, enum: ["Member", "Admin"] },
    receiver: { type: mongoose.Schema.Types.ObjectId, refPath: "receiverModel", required: true },
    receiverModel: { type: String, required: true, enum: ["Member", "Admin"] },
    committeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Committee", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
