import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";

export async function GET(req, { params }) {
    const { id } = params;
    try {
        await connectToDatabase();
        const admin = await Admin.findById(id).select("-password");
        if (!admin) return new Response(JSON.stringify({ error: "Organizer not found" }), { status: 404 });
        return new Response(JSON.stringify(admin), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Failed to fetch organizer" }), { status: 500 });
    }
}
