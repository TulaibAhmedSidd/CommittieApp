import connectToDatabase from "@/app/utils/db";
import Message from "../../models/Message";
import Member from "../../models/Member"; // Although we might not need to query Member, we need it for aggregation context likely
import Admin from "../../models/Admin";
import Committee from "../../models/Committee";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
        return new Response(JSON.stringify({ error: "Missing memberId" }), { status: 400 });
    }

    try {
        // Aggregation to find latest message per conversation for the Member
        // A conversation is unique by committeeId + otherId (Admin)
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(memberId), senderModel: "Member" },
                        { receiver: new mongoose.Types.ObjectId(memberId), receiverModel: "Member" }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        committeeId: { $ifNull: ["$committeeId", "direct"] },
                        otherId: {
                            $cond: [
                                { $eq: ["$sender", new mongoose.Types.ObjectId(memberId)] },
                                "$receiver",
                                "$sender"
                            ]
                        }
                    },
                    lastMessage: { $first: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$receiver", new mongoose.Types.ObjectId(memberId)] },
                                        { $eq: ["$isRead", false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const populatePromises = conversations.map(async (conv) => {
            // "otherId" for a member is usually an Admin (Organizer)
            const admin = await Admin.findById(conv._id.otherId).select("name email");

            // It's possible the other person is another Member (if we allow member-to-member chat later)
            // For now, let's assume it's an Admin or check Member if Admin not found? 
            // The requirement says "message other admin or User", so we might need to check both.
            let userDisplay = admin;
            let userModel = "Admin";

            if (!admin) {
                const member = await Member.findById(conv._id.otherId).select("name email");
                if (member) {
                    userDisplay = member;
                    userModel = "Member";
                }
            }

            let committee = null;
            if (conv._id.committeeId !== "direct") {
                committee = await Committee.findById(conv._id.committeeId).select("name");
            } else {
                committee = { name: "Direct Message" };
            }

            return {
                ...conv,
                otherUser: userDisplay,
                otherUserModel: userModel,
                committee,
                otherId: conv._id.otherId,
                committeeId: conv._id.committeeId === "direct" ? null : conv._id.committeeId
            };
        });

        const result = await Promise.all(populatePromises);

        // Filter out valid results
        const validResult = result.filter(r => r.otherUser);

        // Sort by last message time
        validResult.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));

        return new Response(JSON.stringify(validResult), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
