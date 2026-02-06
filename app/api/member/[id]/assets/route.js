import Member from "@/app/api/models/Member";
import connectToDatabase from "@/app/utils/db";

export async function GET(req, { params }) {
    const { id } = params;
    try {
        await connectToDatabase();
        const member = await Member.findById(id).select("documents nicImage");
        if (!member) return new Response(JSON.stringify({ error: "Member not found" }), { status: 404 });

        const assets = [];
        if (member.nicImage) assets.push({ name: "NIC Image", url: member.nicImage });
        if (member.documents && member.documents.length > 0) {
            member.documents.forEach(doc => {
                assets.push({ name: doc.name, url: doc.url });
            });
        }

        // Filter unique by URL
        const uniqueAssets = Array.from(new Map(assets.map(item => [item.url, item])).values());

        return new Response(JSON.stringify(uniqueAssets), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Failed to fetch assets: " + err.message }), { status: 500 });
    }
}
