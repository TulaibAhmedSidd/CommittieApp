import connectToDatabase from "@/app/utils/db";
import Asset from "@/app/api/models/Asset";

export async function GET(req, { params }) {
    await connectToDatabase();
    const { id } = await params;

    try {
        const asset = await Asset.findById(id);
        if (!asset) {
            return new Response(JSON.stringify({ error: "Asset not found" }), { status: 404 });
        }

        // Check if data is base64 and extract
        if (asset.data.startsWith("data:")) {
            const base64Data = asset.data.split(",")[1];
            const buffer = Buffer.from(base64Data, "base64");
            return new Response(buffer, {
                headers: { "Content-Type": asset.contentType || "image/png" }
            });
        }

        return new Response(JSON.stringify({ error: "Invalid asset data" }), { status: 500 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
