import connectToDatabase from "@/app/utils/db";
import Notification from "@/app/api/models/Notification";

export async function GET(req, { params }) {
  await connectToDatabase();

  try {
    const { id } = params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return new Response(JSON.stringify({ error: "Notification not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(notification), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch notification details.",
        details: err,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectToDatabase();

  try {
    const { id } = params;

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return new Response(
        JSON.stringify({ error: "Notification not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Notification deleted successfully." }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to delete notification.", details: err }),
      { status: 500 }
    );
  }
}
