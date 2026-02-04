import connectToDatabase from "../../../../utils/db";
import Committee from "../../../models/Committee";
import Member from "../../../models/Member";

export async function POST(req, { params }) {
    await connectToDatabase();
    const { id } = params;

    try {
        const { memberId, action, adminId } = await req.json();

        if (!action || !memberId || !adminId) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const committee = await Committee.findById(id);
        if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

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

            // Check if full
            if (committee.members.length >= committee.maxMembers) {
                committee.status = "full";
            }
        } else if (action === "reject") {
            // Remove from pending
            committee.pendingMembers = committee.pendingMembers.filter(m => m.toString() !== memberId);
        }

        await committee.save();
        return new Response(JSON.stringify({ message: `Request ${action}ed successfully` }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
