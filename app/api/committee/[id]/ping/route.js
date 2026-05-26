import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import Notification from "@/app/api/models/Notification";
import Admin from "@/app/api/models/Admin";
import { createLog } from "@/app/utils/logger";
import { unauthorizedResponse, verifyAdmin } from "@/app/utils/auth";

export async function POST(req, { params }) {
    try {
        const auth = verifyAdmin(req);
        if (!auth.authorized) {
            return unauthorizedResponse(auth);
        }

        await connectToDatabase();
        const { id } = await params;
        const { memberId, message } = await req.json();
        const adminId = auth.user.userId;

        const committee = await Committee.findById(id);
        const member = await Member.findById(memberId);
        const requester = await Admin.findById(adminId);

        if (!committee || !member || !requester) {
            return new Response(JSON.stringify({ error: "Committee or Member not found" }), { status: 404 });
        }
        if (committee.createdBy?.toString() !== adminId && !requester.isSuperAdmin) {
            return new Response(JSON.stringify({ error: "Unauthorized ping action" }), { status: 403 });
        }

        // Create notification using standalone model
        const notification = new Notification({
            recipient: memberId,
            recipientModel: "Member",
            sender: adminId,
            committeeId: id,
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
