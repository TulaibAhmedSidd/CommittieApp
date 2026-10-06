import mongoose from "mongoose";
import Message from "../api/models/Message";
import Member from "../api/models/Member";
import Admin from "../api/models/Admin";
import Committee from "../api/models/Committee";

/** Latest message per conversation (other person + BC) for this user. */
export async function buildInbox(userId, model) {
  const me = new mongoose.Types.ObjectId(String(userId));
  const conversations = await Message.aggregate([
    { $match: { $or: [{ sender: me, senderModel: model }, { receiver: me, receiverModel: model }] } },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: {
          committeeId: { $ifNull: ["$committeeId", "direct"] },
          otherId: { $cond: [{ $eq: ["$sender", me] }, "$receiver", "$sender"] },
          otherModel: { $cond: [{ $eq: ["$sender", me] }, "$receiverModel", "$senderModel"] },
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: { $cond: [{ $and: [{ $eq: ["$receiver", me] }, { $eq: ["$isRead", false] }] }, 1, 0] },
        },
      },
    },
    { $sort: { "lastMessage.timestamp": -1 } },
    { $limit: 100 },
  ]);

  const rows = await Promise.all(
    conversations.map(async (c) => {
      const OtherModel = c._id.otherModel === "Admin" ? Admin : Member;
      const other = await OtherModel.findById(c._id.otherId).select("name");
      if (!other) return null;
      const committee = c._id.committeeId !== "direct" ? await Committee.findById(c._id.committeeId).select("name") : null;
      return {
        otherId: String(c._id.otherId),
        otherModel: c._id.otherModel,
        otherName: other.name,
        committeeId: committee ? String(committee._id) : null,
        committeeName: committee?.name || null,
        lastMessage: { content: c.lastMessage.content, timestamp: c.lastMessage.timestamp, fromMe: String(c.lastMessage.sender) === String(me) },
        unreadCount: c.unreadCount,
      };
    })
  );
  return rows.filter(Boolean);
}

/** May these two people message each other? */
export async function canChat(sender, senderModel, receiverId, receiverModel) {
  const sid = String(sender._id);
  const rid = String(receiverId);
  if (sid === rid) return false;

  if (senderModel === "Admin" && sender.isSuperAdmin) return true;

  if (senderModel === "Member" && receiverModel === "Admin") {
    // Members may contact any approved organizer (e.g. to ask about a BC).
    return !!(await Admin.exists({ _id: rid, status: "approved" }));
  }

  if (senderModel === "Admin" && receiverModel === "Member") {
    const member = await Member.findById(rid).select("organizers createdBy referredBy");
    if (!member) return false;
    if ((member.organizers || []).some((o) => String(o) === sid)) return true;
    return !!(await Committee.exists({ createdBy: sid, $or: [{ members: rid }, { pendingMembers: rid }] }));
  }

  if (senderModel === "Member" && receiverModel === "Member") {
    return !!(await Committee.exists({ members: { $all: [sid, rid] } }));
  }

  if (senderModel === "Admin" && receiverModel === "Admin") {
    return !!(await Admin.exists({ _id: rid, isSuperAdmin: true }));
  }
  return false;
}
