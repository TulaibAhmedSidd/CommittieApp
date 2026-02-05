import connectToDatabase from "@/app/utils/db";
import Notification from "@/app/api/models/Notification";

export async function PATCH(req) {
  await connectToDatabase();

  try {
    const { notificationIds } = await req.json();

    if (!notificationIds || notificationIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "Notification IDs are required." }),
        { status: 400 }
      );
    }

    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { isRead: true }
    );

    return new Response(
      JSON.stringify({ message: "Notifications marked as read." }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to mark notifications as read.",
        details: err,
      }),
      { status: 500 }
    );
  }
}
