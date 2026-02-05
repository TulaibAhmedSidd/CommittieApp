import connectToDatabase from "@/app/utils/db";
import Settings from "@/app/api/models/Settings";

export async function GET(req) {
    try {
        await connectToDatabase();
        let settings = await Settings.findOne({});
        if (!settings) {
            settings = await Settings.create({ activeTheme: 'midnight' });
        }
        return new Response(JSON.stringify(settings), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const { activeTheme, adminId } = await req.json();

        const settings = await Settings.findOneAndUpdate(
            {},
            { activeTheme, lastUpdatedBy: adminId },
            { new: true, upsert: true }
        );

        return new Response(JSON.stringify(settings), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
