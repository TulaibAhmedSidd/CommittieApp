import connectToDatabase from "@/app/utils/db";
import Member from "@/app/api/models/Member";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await connectToDatabase();

    try {
        const { adminId, adminName, count = 10 } = await req.json();

        if (!adminId || !adminName) {
            return new Response(JSON.stringify({ error: "Admin context required for simulation." }), { status: 400 });
        }

        const generatedMembers = [];
        const hashedPassword = await bcrypt.hash("member123", 10);

        for (let i = 0; i < count; i++) {
            const randomSuffix = Math.floor(Math.random() * 10000);
            const name = `Simulated User ${randomSuffix}`;
            const email = `sim.${randomSuffix}@nexus.app`;

            const member = new Member({
                name,
                email,
                password: hashedPassword,
                phone: 3000000000 + randomSuffix,
                status: "approved", // Auto-approved for simulation
                createdBy: adminId,
                createdByAdminName: adminName,
                committees: []
            });

            generatedMembers.push(member);
        }

        await Member.insertMany(generatedMembers);

        return new Response(JSON.stringify({
            message: `${count} Simulated Identities Manifested`,
            members: generatedMembers.length
        }), { status: 201 });

    } catch (err) {
        return new Response(JSON.stringify({ error: "Simulation failed", details: err.message }), { status: 500 });
    }
}
