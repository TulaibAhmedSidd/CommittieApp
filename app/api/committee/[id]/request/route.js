import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";

export async function POST(req, { params }) {
    await connectToDatabase();
    const { id } = params;

    try {
        const { memberId, action, adminId } = await req.json();

        const committee = await Committee.findById(id);
        if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

        // CASE 1: Member Reuqest to Join
        if (!action) {
            if (!memberId) return new Response(JSON.stringify({ error: "Member ID required" }), { status: 400 });

            // Check if already a member or pending
            if (committee.members.includes(memberId) || committee.pendingMembers.includes(memberId)) {
                return new Response(JSON.stringify({ error: "Already member or request pending" }), { status: 400 });
            }

            committee.pendingMembers.push(memberId);
            await committee.save();

            // Also update Member's pendingOrganizers if needed, but Member schema has committees array too
            const member = await Member.findById(memberId);
            if (member) {
                member.committees.push({ committee: id, status: "pending" });
                await member.save();
            }

            return new Response(JSON.stringify({ message: "Request sent successfully" }), { status: 201 });
        }

        // CASE 2: Admin Approve/Reject
        if (!adminId) {
            return new Response(JSON.stringify({ error: "Admin ID required for this action" }), { status: 400 });
        }

        if (committee.createdBy.toString() !== adminId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
        }

        if (action === "approve") {
            // Remove from pending
            committee.pendingMembers = committee.pendingMembers.filter(m => m.toString() !== memberId);

            // Add to active (check duplicates)
            if (!committee.members.includes(memberId)) {
                committee.members.push(memberId);
            }

            // Update Member status
            await Member.updateOne(
                { _id: memberId, "committees.committee": id },
                { $set: { "committees.$.status": "active" } }
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
        return new Response(JSON.stringify({ message: `Request ${action}ed successfully` }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
