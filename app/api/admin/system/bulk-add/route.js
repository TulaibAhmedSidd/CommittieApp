import connectToDatabase from "@/app/utils/db";
import Member from "@/app/api/models/Member";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { adminId, adminName } = await req.json();

        if (!adminId) return new Response(JSON.stringify({ error: "Admin ID required" }), { status: 400 });

        const names = [
            "Zain Ahmed", "Ayesha Khan", "Bilal Siddiqui", "Dua Fatimah", "Ehsan Raza",
            "Fiza Batool", "Ghufran Ali", "Hira Mani", "Imran Abbas", "Javeria Saud",
            "Kashif Hussain", "Laiba Khan", "Muneeb Butt", "Nida Yasir", "Osama Bin Azam",
            "Parveen Shakir", "Qasim Ali Shah", "Rida Isfahani", "Sarmad Khoosat", "Tuba Anwar"
        ];

        const password = await bcrypt.hash("password123", 10);

        const bulkMembers = names.map(name => ({
            name,
            email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
            password,
            status: "approved",
            organizers: [adminId],
            createdBy: adminId,
            createdByAdminName: adminName || "Organizer"
        }));

        await Member.insertMany(bulkMembers);

        return new Response(JSON.stringify({ message: "Batch Onboarding Complete. 20 members initialized." }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
