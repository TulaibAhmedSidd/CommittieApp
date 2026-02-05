import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";

export async function GET(req) {
    try {
        await connectToDatabase();
        // In a real app, you'd verify JWT and check if isSuperAdmin
        // For now, we trust the frontend check but fetch all admins
        const admins = await Admin.find({}).sort({ createdAt: -1 });
        return new Response(JSON.stringify(admins), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { adminId, updateData } = await req.json();

        if (!adminId) {
            return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
        return new Response(JSON.stringify(updatedAdmin), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { adminId } = await req.json();

        if (!adminId) {
            return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });
        }

        await Admin.findByIdAndDelete(adminId);
        return new Response(JSON.stringify({ message: "Admin deleted successfully" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
