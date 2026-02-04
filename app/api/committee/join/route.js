import connectToDatabase from "../../../utils/db";
import Committee from "../../models/Committee";
import Member from "../../models/Member";

export async function POST(req) {
    await connectToDatabase();
    try {
        const { committeeId, userId } = await req.json();

        if (!committeeId || !userId) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const committee = await Committee.findById(committeeId);
        if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

        // Check if already active
        if (committee.members.includes(userId)) {
            return new Response(JSON.stringify({ error: "You are already a member of this committee" }), { status: 400 });
        }

        // Check if already pending
        if (committee.pendingMembers.includes(userId)) {
            return new Response(JSON.stringify({ error: "Request already pending" }), { status: 400 });
        }

        // Add to pending
        committee.pendingMembers.push(userId);
        await committee.save();

        return new Response(JSON.stringify({ message: "Join request submitted" }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
