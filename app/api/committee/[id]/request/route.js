import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import Admin from "@/app/api/models/Admin";
import Notification from "@/app/api/models/Notification";
import { createLog } from "@/app/utils/logger";
import { unauthorizedResponse, verifyAdmin, verifyAuthenticatedUser, verifyMember } from "@/app/utils/auth";

export async function POST(req, { params }) {
    try {
        const auth = verifyAuthenticatedUser(req);
        if (!auth.authorized) {
            return unauthorizedResponse(auth);
        }

        await connectToDatabase();
        const { id } = params;
        const { memberId, action } = await req.json();

        const committee = await Committee.findById(id);
        if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

        // CASE 1: Member Reuqest to Join
        if (!action) {
            if (auth.user?.isAdmin) {
                return new Response(JSON.stringify({ error: "Only members can request to join" }), { status: 403 });
            }
            if (!memberId) return new Response(JSON.stringify({ error: "Member ID required" }), { status: 400 });
            if (auth.user.userId !== memberId) {
                return new Response(JSON.stringify({ error: "Unauthorized join request" }), { status: 403 });
            }
            if (committee.members.length + committee.pendingMembers.length >= committee.maxMembers) {
                return new Response(JSON.stringify({ error: "Committee is full" }), { status: 400 });
            }

            // Check if already a member or pending
            if (committee.members.some(m => m.toString() === memberId) || committee.pendingMembers.some(m => m.toString() === memberId)) {
                return new Response(JSON.stringify({ error: "Already member or request pending" }), { status: 400 });
            }

            committee.pendingMembers.push(memberId);
            await committee.save();

            // Also update Member's pendingOrganizers if needed, but Member schema has committees array too
            const member = await Member.findById(memberId);
            if (member) {
                const existingCommittee = member.committees?.find(entry => entry.committee.toString() === id.toString());
                if (!existingCommittee) {
                    member.committees.push({ committee: id, status: "pending" });
                }
                await member.save();
            }
            await Notification.create({
                recipient: committee.createdBy,
                recipientModel: "Admin",
                sender: memberId,
                senderModel: "Member",
                type: "join_request",
                message: `A new member has requested to join ${committee.name}.`,
                details: { committeeId: id, memberId }
            });
            await createLog({
                action: "REQUEST_JOIN_COMMITTEE",
                performedBy: memberId,
                onModel: "Member",
                targetId: id,
                details: { committeeId: id }
            });

            return new Response(JSON.stringify({ message: "Request sent successfully" }), { status: 201 });
        }

        // CASE 2: Admin Approve/Reject
        const adminAuth = verifyAdmin(req);
        if (!adminAuth.authorized) {
            return unauthorizedResponse(adminAuth);
        }
        const adminId = adminAuth.user.userId;
        const requester = await Admin.findById(adminId);
        if (!requester) {
            return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
        }
        if (committee.createdBy.toString() !== adminId && !requester.isSuperAdmin) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }
        if (!memberId) {
            return new Response(JSON.stringify({ error: "Member ID required for this action" }), { status: 400 });
        }
        if (!["approve", "reject"].includes(action)) {
            return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
        }

        if (action === "approve") {
            // Remove from pending
            committee.pendingMembers = committee.pendingMembers.filter(m => m.toString() !== memberId);

            // Add to active (check duplicates)
            if (!committee.members.some(m => m.toString() === memberId)) {
                committee.members.push(memberId);
            }

            // Update Member status
            await Member.updateOne(
                { _id: memberId, "committees.committee": id },
                { $set: { "committees.$.status": "approved" } }
            );

            // Check if full
            if (committee.members.length >= committee.maxMembers) {
                committee.status = "full";
            }
        } else if (action === "reject") {
            // Remove from pending
            committee.pendingMembers = committee.pendingMembers.filter(m => m.toString() !== memberId);

            // Update Member status
            await Member.updateOne(
                { _id: memberId, "committees.committee": id },
                { $set: { "committees.$.status": "rejected" } }
            );
        }

        await committee.save();
        await Notification.create({
            recipient: memberId,
            recipientModel: "Member",
            sender: adminId,
            senderModel: "Admin",
            type: "info",
            message: `Your request to join ${committee.name} was ${action}ed.`,
            details: { committeeId: id, action }
        });
        await createLog({
            action: action === "approve" ? "APPROVE_COMMITTEE_REQUEST" : "REJECT_COMMITTEE_REQUEST",
            performedBy: adminId,
            onModel: "Admin",
            targetId: memberId,
            details: { committeeId: id }
        });
        return new Response(JSON.stringify({ message: `Request ${action}ed successfully` }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
