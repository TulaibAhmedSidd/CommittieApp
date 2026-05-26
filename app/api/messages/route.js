import connectToDatabase from "@/app/utils/db";
import Message from "@/app/api/models/Message";
import Committee from "@/app/api/models/Committee";
import { unauthorizedResponse, verifyAuthenticatedUser } from "@/app/utils/auth";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const auth = verifyAuthenticatedUser(req);
        if (!auth.authorized) {
            return unauthorizedResponse(auth);
        }

        await connectToDatabase();
        const { senderId, senderModel, receiverId, receiverModel, committeeId, content } = await req.json();

        // Basic validation
        if (!content || !senderId || !receiverId) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        if (auth.user.userId !== senderId || (!!auth.user.isAdmin) !== (senderModel === "Admin")) {
            return new Response(JSON.stringify({ error: "Unauthorized sender identity" }), { status: 403 });
        }

        // Eligibility check
        // Check if member is actually in the committee if committeeId is provided
        if (committeeId && senderModel === "Member") {
            const committee = await Committee.findById(committeeId);
            if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

            // Allow members (active/finished positions)
            const isMember = committee.members.some(m => m.toString() === senderId);
            if (!isMember) return new Response(JSON.stringify({ error: "You must be a member of this committee to chat." }), { status: 403 });
        }

        const newMessage = new Message({
            sender: senderId,
            senderModel,
            receiver: receiverId,
            receiverModel,
            committeeId: committeeId || null,
            content
        });

        await newMessage.save();

        return new Response(JSON.stringify(newMessage), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        const auth = verifyAuthenticatedUser(req);
        if (!auth.authorized) {
            return unauthorizedResponse(auth);
        }

        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const committeeId = searchParams.get("committeeId");
        const userId = searchParams.get("userId"); // Could be Member or Admin ID
        const otherId = searchParams.get("otherId"); // The person chatting with

        if (!userId || !otherId) {
            return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
        }

        if (auth.user.userId !== userId) {
            return new Response(JSON.stringify({ error: "Unauthorized conversation access" }), { status: 403 });
        }

        const query = {
            $or: [
                { sender: userId, receiver: otherId },
                { sender: otherId, receiver: userId }
            ]
        };

        if (committeeId) {
            query.committeeId = committeeId;
        }

        const messages = await Message.find(query).sort({ timestamp: 1 });

        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
