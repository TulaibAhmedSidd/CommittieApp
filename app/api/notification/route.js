import connectToDatabase from "@/app/utils/db";
import Notification from "@/app/api/models/Notification";

export async function GET(req) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required." }), {
        status: 400,
      });
    }

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch notifications.", details: err }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectToDatabase();

  try {
    const { userId, message, details } = await req.json();

    if (!userId || !message) {
      return new Response(
        JSON.stringify({ error: "User ID and message are required." }),
        { status: 400 }
      );
    }

    const newNotification = new Notification({
      userId,
      message,
      details,
    });

    await newNotification.save();

    return new Response(JSON.stringify(newNotification), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to create notification.", details: err }),
      { status: 500 }
    );
  }
}
