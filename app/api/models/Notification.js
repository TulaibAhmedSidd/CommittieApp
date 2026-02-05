import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipientModel: { type: String, enum: ['Admin', 'Member'], required: true },
  sender: { type: mongoose.Schema.Types.ObjectId },
  senderModel: { type: String, enum: ['Admin', 'Member'] },
  type: { type: String, default: 'info' }, // 'join_request', 'info', 'alert'
  message: { type: String, required: true },
  details: { type: Object }, // Store IDs or extra data
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
