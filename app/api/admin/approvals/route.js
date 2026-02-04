import connectToDatabase from "../../../../utils/db";
import Admin from "../../models/Admin";
import Member from "../../models/Member";

export async function GET(req) {
    try {
        await connectToDatabase();
        const pendingAdmins = await Admin.find({ status: "pending" });
        const pendingMembers = await Member.find({ status: "pending" });

        return new Response(JSON.stringify({
            admins: pendingAdmins,
            members: pendingMembers
        }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { userId, role, action } = await req.json();

        if (action === "approve") {
            if (role === "Admin") {
                await Admin.findByIdAndUpdate(userId, { status: "approved" });
            } else {
                await Member.findByIdAndUpdate(userId, { status: "approved" });
            }
        } else if (action === "reject") {
            if (role === "Admin") {
                await Admin.findByIdAndDelete(userId);
            } else {
                await Member.findByIdAndDelete(userId);
            }
        }

        return new Response(JSON.stringify({ message: "Action successful" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
