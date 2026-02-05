import connectToDatabase from "@/app/utils/db";
import Member from "@/app/api/models/Member";
import Notification from "@/app/api/models/Notification";
import Admin from "@/app/api/models/Admin";

export async function GET(req) {
    try {
        await connectToDatabase();
        const members = await Member.find({}, 'name email phone status organizers').populate('organizers', 'name email');
        return new Response(JSON.stringify(members), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { memberId, adminId } = await req.json();

        if (!memberId || !adminId) {
            return new Response(JSON.stringify({ error: "Member ID and Admin ID required" }), { status: 400 });
        }

        const member = await Member.findById(memberId);
        if (!member) {
            return new Response(JSON.stringify({ error: "Member not found" }), { status: 404 });
        }

        // Check if already an organizer or already pending
        if (member.organizers.includes(adminId)) {
            return new Response(JSON.stringify({ error: "Already associated with this member" }), { status: 400 });
        }

        if (member.pendingOrganizers?.includes(adminId)) {
            return new Response(JSON.stringify({ error: "Association request already pending" }), { status: 400 });
        }

        // Add to pendingOrganizers instead of organizers
        if (!member.pendingOrganizers) member.pendingOrganizers = [];
        member.pendingOrganizers.push(adminId);
        await member.save();

        // Notify Member
        const admin = await Admin.findById(adminId);
        await Notification.create({
            recipient: memberId,
            recipientModel: 'Member',
            sender: adminId,
            senderModel: 'Admin',
            type: 'join_request',
            message: `Organizer ${admin.name} wants to associate with your profile.`,
            details: { adminId: adminId }
        });

        return new Response(JSON.stringify({ message: "Association request sent to member", member }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
