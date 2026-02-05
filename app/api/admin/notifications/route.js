import connectToDatabase from "@/app/utils/db";
import Notification from "@/app/api/models/Notification";

export async function GET(req) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const adminId = url.searchParams.get("adminId");

        if (!adminId) {
            return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });
        }

        const notifications = await Notification.find({
            recipient: adminId,
            recipientModel: 'Admin'
        }).sort({ createdAt: -1 });

        return new Response(JSON.stringify(notifications), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { notificationId } = await req.json();

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        return new Response(JSON.stringify(notification), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
