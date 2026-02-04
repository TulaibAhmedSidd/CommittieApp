import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
    name: String,
    data: String, // String for Base64 or URL if we migrate later
    contentType: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" },
    onModel: { type: String, enum: ["Member", "Admin"] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
