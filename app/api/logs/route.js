import connectToDatabase from "@/app/utils/db";
import Log from "@/app/api/models/Log";
import Admin from "@/app/api/models/Admin";

export async function GET(req) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
        return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });

        // Logic check for Super Admin (Tulaib)
        const isSuperAdmin = admin.email.toLowerCase() === "tulaib@gmail.com" ||
            admin.email.toLowerCase().includes("tulaib") ||
            admin.name.toLowerCase().includes("tulaib");

        if (!isSuperAdmin) {
            return new Response(JSON.stringify({ error: "Unauthorized access to logs" }), { status: 403 });
        }

        const logs = await Log.find().sort({ timestamp: -1 }).limit(100).populate("performedBy");
        return new Response(JSON.stringify(logs), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
