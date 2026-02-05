import Admin from "@/app/api/models/Admin";
import connectToDatabase from "@/app/utils/db";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { email, newPassword } = await req.json();

        if (!email || !newPassword) {
            return new Response(JSON.stringify({ message: "Email and new password are required" }), { status: 400 });
        }

        const admin = await Admin.findOne({ email });

        // if (!admin) {
        //     return new Response(JSON.stringify({ message: "Administrator identity not found" }), { status: 404 });
        // }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        return new Response(JSON.stringify({ message: "Password updated successfully" }), { status: 200 });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return new Response(JSON.stringify({ message: "Infrastructural failure: " + error.message }), { status: 500 });
    }
}
