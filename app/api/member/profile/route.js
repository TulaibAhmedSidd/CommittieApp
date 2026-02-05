import connectToDatabase from "@/app/utils/db";
import Member from "@/app/api/models/Member";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { memberId, name, email, phone, country, city, nicNumber, nicImage, payoutDetails, password, requestVerification, location } = await req.json();

        if (!memberId) {
            return new Response(JSON.stringify({ error: "Member ID required" }), { status: 400 });
        }

        const member = await Member.findById(memberId);
        if (!member) {
            return new Response(JSON.stringify({ error: "Member not found" }), { status: 404 });
        }

        if (name) member.name = name;
        if (email) member.email = email;
        if (phone) member.phone = phone;
        if (country) member.country = country;
        if (city) member.city = city;
        if (nicNumber) member.nicNumber = nicNumber;
        if (nicImage) member.nicImage = nicImage;
        if (location) member.location = location;
        if (payoutDetails) member.payoutDetails = payoutDetails;

        if (requestVerification && member.verificationStatus === "unverified") {
            member.verificationStatus = "pending";
        }

        if (password) {
            member.password = await bcrypt.hash(password, 10);
        }

        await member.save();

        const responseData = member.toObject();
        delete responseData.password;

        return new Response(JSON.stringify(responseData), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
