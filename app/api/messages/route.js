import connectToDatabase from "@/app/utils/db";
import Message from "@/app/api/models/Message";
import { requireUser } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { canChat } from "@/app/utils/inbox";

export const dynamic = "force-dynamic";

const MODELS = ["Admin", "Member"];

// POST { receiverId, receiverModel, committeeId?, content }
export async function POST(req) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;
    const { receiverId, receiverModel, committeeId, content } = await readJson(req);

    const text = typeof content === "string" ? content.trim().slice(0, 2000) : "";
    if (!text) return fail(400, "Type a message first.");
    if (!isObjectId(receiverId) || !MODELS.includes(receiverModel)) return fail(400, "Invalid receiver.");
    if (committeeId && !isObjectId(committeeId)) return fail(400, "Invalid BC.");

    await connectToDatabase();
    if (!(await canChat(auth.user, auth.model, receiverId, receiverModel))) {
      return fail(403, "You can't message this person.");
    }

    const message = await Message.create({
      sender: auth.user._id,
      senderModel: auth.model,
      receiver: receiverId,
      receiverModel,
      committeeId: committeeId || null,
      content: text,
    });
    return ok(message, 201);
  } catch (err) {
    return serverError(err, "messages POST");
  }
}

// GET ?otherId=&committeeId= -> conversation (oldest first). Marks received messages as read.
export async function GET(req) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;
    const { searchParams } = new URL(req.url);
    const otherId = searchParams.get("otherId");
    const committeeId = searchParams.get("committeeId");
    if (!isObjectId(otherId)) return fail(400, "Missing person.");

    await connectToDatabase();
    const me = auth.user._id;
    const query = { $or: [{ sender: me, receiver: otherId }, { sender: otherId, receiver: me }] };
    if (isObjectId(committeeId)) query.committeeId = committeeId;

    const messages = await Message.find(query).sort({ timestamp: 1 }).limit(500).lean();
    await Message.updateMany({ ...query, receiver: me, isRead: false }, { isRead: true });
    return ok(messages);
  } catch (err) {
    return serverError(err, "messages GET");
  }
}
