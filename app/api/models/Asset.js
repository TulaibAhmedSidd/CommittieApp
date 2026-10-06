import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
    name: String,
    data: String, // base64 data URL
    contentType: String,
    size: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" },
    onModel: { type: String, enum: ["Member", "Admin"] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
