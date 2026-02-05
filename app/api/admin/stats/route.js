import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import Admin from "@/app/api/models/Admin";

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const adminId = searchParams.get("adminId");

        if (!adminId) return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });

        const admin = await Admin.findById(adminId);
        if (!admin) return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });

        let committeeQuery = {};
        let memberQuery = {};

        if (!admin.isSuperAdmin) {
            committeeQuery = { createdBy: adminId };
            memberQuery = { organizers: adminId };
        }

        const activeCommittees = await Committee.countDocuments(committeeQuery);
        const totalMembers = await Member.countDocuments(memberQuery);

        // Count pending members across admin's committees
        const adminCommittees = await Committee.find(committeeQuery).select('pendingMembers');
        const pendingApprovals = adminCommittees.reduce((acc, c) => acc + (c.pendingMembers?.length || 0), 0);

        return new Response(JSON.stringify({
            activeCommittees,
            totalMembers,
            pendingApprovals,
            systemStatus: "Operational"
        }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
