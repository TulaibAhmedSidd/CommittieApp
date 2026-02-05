import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";

export async function GET(req) {
    try {
        await connectToDatabase();
        const url = new URL(req.url);
        const adminId = url.searchParams.get("adminId");

        if (!adminId) {
            return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
        }

        // Import models locally to avoid circular dependencies if any
        const Member = mongoose.models.Member;
        const AdminModel = mongoose.models.Admin;

        const [memberCount, adminCount] = await Promise.all([
            Member.countDocuments({ referredBy: adminId }),
            AdminModel.countDocuments({ createdBy: adminId })
        ]);

        return new Response(JSON.stringify({
            referralCode: admin.referralCode,
            referralScore: admin.referralScore,
            memberCount,
            adminCount
        }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { adminId } = await req.json();

        if (!adminId) {
            return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
        }

        if (!admin.referralCode) {
            // Simple referral code generation
            const code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            admin.referralCode = code;
            await admin.save();
        }

        return new Response(JSON.stringify({ referralCode: admin.referralCode }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
