import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";
import Member from "@/app/api/models/Member";

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const adminId = searchParams.get("adminId");

        if (!adminId) return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });

        const admin = await Admin.findById(adminId);
        if (!admin) return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });

        let pendingAdmins = [];
        let pendingMembers = [];

        if (admin.isSuperAdmin) {
            // Super Admin can verify everyone
            pendingAdmins = await Admin.find({ verificationStatus: "pending" }).select("name email nicNumber nicImage city country verificationStatus");
            pendingMembers = await Member.find({ verificationStatus: "pending" }).select("name email nicNumber nicImage city country verificationStatus");
        } else {
            // Organizers can only verify members associated with them
            pendingMembers = await Member.find({
                verificationStatus: "pending",
                organizers: adminId
            }).select("name email nicNumber nicImage city country verificationStatus");
        }

        return new Response(JSON.stringify({ admins: pendingAdmins, members: pendingMembers }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { userId, role, status } = await req.json();

        if (role === "Admin") {
            await Admin.findByIdAndUpdate(userId, { verificationStatus: status });
        } else {
            await Member.findByIdAndUpdate(userId, { verificationStatus: status });
        }

        return new Response(JSON.stringify({ message: "Verification status updated" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
