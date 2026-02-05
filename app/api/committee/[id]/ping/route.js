import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import Notification from "@/app/api/models/Notification";
import { createLog } from "@/app/utils/logger";

export async function POST(req, { params }) {
    await connectToDatabase();
    const { id } = await params;
    const { memberId, adminId, message } = await req.json();

    try {
        const committee = await Committee.findById(id);
        const member = await Member.findById(memberId);

        if (!committee || !member) {
            return new Response(JSON.stringify({ error: "Committee or Member not found" }), { status: 404 });
        }

        // Create notification using standalone model
        const notification = new Notification({
            userId: memberId,
            message: message || `Admin of ${committee.name} has requested your payment for this month.`,
            details: `Action: Payment Ping | Committee: ${committee.name} | Month: ${committee.currentMonth}`,
        });
        await notification.save();

        await createLog({
            action: "PING_MEMBER",
            performedBy: adminId,
            onModel: "Admin",
            targetId: memberId,
            details: { committeeId: id, message },
        });

        return new Response(JSON.stringify({ message: "Ping sent successfully" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
