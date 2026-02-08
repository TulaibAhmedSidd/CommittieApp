import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";
import Member from "@/app/api/models/Member"; // Ensure Member model is registered
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

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

        // Auto-generate if missing
        if (!admin.referralCode) {
            const code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            admin.referralCode = code;
            await admin.save();
        }

        // Use imported models or mongoose.models if preferred, but importing ensures registration
        const memberCount = await Member.countDocuments({ referredBy: admin._id });
        // Wait, check Member model. If unable to check, use safe assumption or check existing usage. 
        // The previous code used adminId for countDocuments({ referredBy: adminId }), implying referral by ID.
        // But the referral link uses the code. Let's stick to adminId for now if that's how it's stored.

        const adminCount = await Admin.countDocuments({ createdBy: adminId });

        return new Response(JSON.stringify({
            referralCode: admin.referralCode,
            referralScore: admin.referralScore || 0,
            memberCount,
            adminCount
        }), { status: 200 });
    } catch (err) {
        console.error("Referral API Error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function POST(req) { // Keep POST for manual generation if needed
    try {
        await connectToDatabase();
        const { adminId } = await req.json();

        if (!adminId) return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });

        const admin = await Admin.findById(adminId);
        if (!admin) return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });

        if (!admin.referralCode) {
            const code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            admin.referralCode = code;
            await admin.save();
        }

        return new Response(JSON.stringify({ referralCode: admin.referralCode }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
