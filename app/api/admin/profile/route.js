import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { adminId, name, email, phone, country, city, nicNumber, nicImage, password, requestVerification, location } = await req.json();

        if (!adminId) {
            return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
        }

        if (name) admin.name = name;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;
        if (country) admin.country = country;
        if (city) admin.city = city;
        if (nicNumber) admin.nicNumber = nicNumber;
        if (nicImage) admin.nicImage = nicImage;
        if (location) admin.location = location;

        if (requestVerification && admin.verificationStatus === "unverified") {
            admin.verificationStatus = "pending";
        }

        if (password) {
            admin.password = await bcrypt.hash(password, 10);
        }

        await admin.save();

        const responseData = admin.toObject();
        delete responseData.password;

        return new Response(JSON.stringify(responseData), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
