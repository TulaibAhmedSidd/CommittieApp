import connectToDatabase from "@/app/utils/db";
import Notification from "@/app/api/models/Notification";
import { requireUser } from "@/app/utils/auth";
import { ok, readJson, serverError, isObjectId } from "@/app/utils/http";

export const dynamic = "force-dynamic";

// GET -> my latest notifications + unread count
export async function GET(req) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;
    await connectToDatabase();
    const mine = { recipient: auth.user._id, recipientModel: auth.model };
    const [items, unread] = await Promise.all([
      Notification.find(mine).sort({ createdAt: -1 }).limit(50).lean(),
      Notification.countDocuments({ ...mine, isRead: false }),
    ]);
    return ok({ items, unread });
  } catch (err) {
    return serverError(err, "notification GET");
  }
}

// PATCH { ids?: [] } -> mark mine as read (all when ids is missing)
export async function PATCH(req) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;
    const { ids } = await readJson(req);
    await connectToDatabase();
    const filter = { recipient: auth.user._id, recipientModel: auth.model, isRead: false };
    if (Array.isArray(ids)) filter._id = { $in: ids.filter(isObjectId) };
    await Notification.updateMany(filter, { isRead: true });
    return ok({ done: true });
  } catch (err) {
    return serverError(err, "notification PATCH");
  }
}
