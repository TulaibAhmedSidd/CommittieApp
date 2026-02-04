import connectToDatabase from "../../../utils/db";
import Message from "../../models/Message";
import Member from "../../models/Member";
import Committee from "../../models/Committee";
import mongoose from "mongoose";

export async function GET(req) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
        return new Response(JSON.stringify({ error: "Missing adminId" }), { status: 400 });
    }

    try {
        // Aggregation to find latest message per conversation
        // A conversation is unique by committeeId + memberId (assuming Admin is constant)
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(adminId), senderModel: "Admin" },
                        { receiver: new mongoose.Types.ObjectId(adminId), receiverModel: "Admin" }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        committeeId: "$committeeId",
                        otherId: {
                            $cond: [
                                { $eq: ["$sender", new mongoose.Types.ObjectId(adminId)] },
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
                                        { $eq: ["$receiver", new mongoose.Types.ObjectId(adminId)] },
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

        // Populate details manually since $lookup in aggregation can be complex with dynamic refs
        const populatePromises = conversations.map(async (conv) => {
            const member = await Member.findById(conv._id.otherId).select("name email");
            const committee = await Committee.findById(conv._id.committeeId).select("name");

            return {
                ...conv,
                member,
                committee,
                otherId: conv._id.otherId,
                committeeId: conv._id.committeeId
            };
        });

        const result = await Promise.all(populatePromises);

        // Filter out any where member/committee not found (deleted)
        const validResult = result.filter(r => r.member && r.committee);

        // Sort by last message time
        validResult.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));

        return new Response(JSON.stringify(validResult), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
