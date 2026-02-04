import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "onModel",
        required: true,
    },
    onModel: {
        type: String,
        required: true,
        enum: ["Member", "Admin"],
    },
    details: { type: mongoose.Schema.Types.Mixed },
    targetId: { type: mongoose.Schema.Types.ObjectId }, // e.g., Committee ID or Member ID being acted upon
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
