import connectToDatabase from "../../utils/db";
import Asset from "../models/Asset";

export async function POST(req) {
    await connectToDatabase();
    try {
        const { name, data, contentType, uploadedBy, onModel } = await req.json();

        if (!data) {
            return new Response(JSON.stringify({ error: "No image data provided" }), { status: 400 });
        }

        const newAsset = new Asset({
            name: name || "screenshot",
            data,
            contentType,
            uploadedBy,
            onModel
        });

        await newAsset.save();

        return new Response(JSON.stringify({
            message: "Asset uploaded successfully",
            assetId: newAsset._id,
            url: `/api/assets/${newAsset._id}`
        }), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
