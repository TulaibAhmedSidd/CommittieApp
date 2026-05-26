import connectToDatabase from "@/app/utils/db";
import Member from "@/app/api/models/Member";
import Notification from "@/app/api/models/Notification";
import { unauthorizedResponse, verifyMember } from "@/app/utils/auth";

export async function POST(req) {
    try {
        const auth = verifyMember(req);
        if (!auth.authorized) {
            return unauthorizedResponse(auth);
        }

        await connectToDatabase();
        const { memberId, adminId, action } = await req.json(); // action: 'approve' or 'reject'

        if (!memberId || !adminId || !action) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }
        if (auth.user.userId !== memberId) {
            return new Response(JSON.stringify({ error: "Unauthorized request response" }), { status: 403 });
        }
        if (!["approve", "reject"].includes(action)) {
            return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
        }

        const member = await Member.findById(memberId);
        if (!member) return new Response(JSON.stringify({ error: "Member not found" }), { status: 404 });
        if (!member.pendingOrganizers?.some(id => id.toString() === adminId)) {
            return new Response(JSON.stringify({ error: "No pending request found for this organizer" }), { status: 400 });
        }

        if (action === 'approve') {
            // Remove from pending, add to organizers
            member.pendingOrganizers = member.pendingOrganizers.filter(id => id.toString() !== adminId);
            if (!member.organizers.includes(adminId)) {
                member.organizers.push(adminId);
            }
            await member.save();

            // Notify Admin
            await Notification.create({
                recipient: adminId,
                recipientModel: 'Admin',
                sender: memberId,
                senderModel: 'Member',
                type: 'info',
                message: `Member ${member.name} has approved your association request.`
            });

            return new Response(JSON.stringify({ message: "Request approved" }), { status: 200 });
        } else {
            // Remove from pending
            member.pendingOrganizers = member.pendingOrganizers.filter(id => id.toString() !== adminId);
            await member.save();

            return new Response(JSON.stringify({ message: "Request rejected" }), { status: 200 });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
