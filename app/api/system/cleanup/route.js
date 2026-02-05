import connectToDatabase from "@/app/utils/db";
import Member from "@/app/api/models/Member";
import Admin from "@/app/api/models/Admin";

export async function POST(req) {
    await connectToDatabase();

    try {
        // Find a default admin to assign to legacy records
        const defaultAdmin = await Admin.findOne();
        if (!defaultAdmin) {
            return new Response(JSON.stringify({ error: "No administrator found in system to assign records to." }), { status: 404 });
        }

        // 1. Fix members missing createdBy or status
        const membersToFix = await Member.find({
            $or: [
                { createdBy: { $exists: false } },
                { createdByAdminName: { $exists: false } },
                { status: { $ne: "approved" } }
            ]
        });

        let updatedCount = 0;
        for (let member of membersToFix) {
            if (!member.createdBy) member.createdBy = defaultAdmin._id;
            if (!member.createdByAdminName) member.createdByAdminName = defaultAdmin.name || "System Base";
            member.status = "approved"; // Reset to approved for system usage
            await member.save();
            updatedCount++;
        }

        return new Response(JSON.stringify({
            message: "System data synchronization complete.",
            updatedRecords: updatedCount,
            assignedTo: defaultAdmin.name
        }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: "Cleanup failed", details: err.message }), { status: 500 });
    }
}
