import connectToDatabase from "@/app/utils/db";
import Settings from "@/app/api/models/Settings";

export async function GET(req) {
    try {
        await connectToDatabase();
        let settings = await Settings.findOne({});
        if (!settings || settings.activeTheme !== "midnight") {
            settings = await Settings.findOneAndUpdate(
                {},
                { activeTheme: "midnight" },
                { new: true, upsert: true }
            );
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

        const safeTheme = activeTheme === "royal" ? "midnight" : activeTheme;
        const settings = await Settings.findOneAndUpdate(
            {},
            { activeTheme: safeTheme, lastUpdatedBy: adminId },
            { new: true, upsert: true }
        );

        return new Response(JSON.stringify(settings), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
