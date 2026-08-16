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

    // Query by recipient instead of non-existent userId field
    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1,
    });

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch notifications.", details: err.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectToDatabase();

  try {
    const { userId, recipient, recipientModel, message, details } = await req.json();
    const targetRecipient = recipient || userId;
    const targetModel = recipientModel || 'Member';

    if (!targetRecipient || !message) {
      return new Response(
        JSON.stringify({ error: "Recipient and message are required." }),
        { status: 400 }
      );
    }

    const newNotification = new Notification({
      recipient: targetRecipient,
      recipientModel: targetModel,
      message,
      details,
    });

    await newNotification.save();

    return new Response(JSON.stringify(newNotification), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to create notification.", details: err.message }),
      { status: 500 }
    );
  }
}
