import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";
import Member from "@/app/api/models/Member";
import Committee from "@/app/api/models/Committee";
import Notification from "@/app/api/models/Notification";
import Log from "@/app/api/models/Log";
import Message from "@/app/api/models/Message";

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { adminId } = await req.json();

        // Security check: Only Super Admin can wipe data
        const admin = await Admin.findById(adminId);
        if (!admin || !admin.isSuperAdmin) {
            return new Response(JSON.stringify({ error: "Unauthorized. Super Admin clearance required." }), { status: 403 });
        }

        // Wipe collections except Admins (to keep the super admin alive)
        // Or keep only the current super admin? Let's keep all admins for now or wipe all except super.
        await Member.deleteMany({});
        await Committee.deleteMany({});
        await Notification.deleteMany({});
        await Log.deleteMany({});
        await Message.deleteMany({});

        // Optional: Wipe all admins EXCEPT the super admin who initiated
        await Admin.deleteMany({ _id: { $ne: adminId } });

        return new Response(JSON.stringify({ message: "System purged. All data collections wiped except primary command authority." }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
