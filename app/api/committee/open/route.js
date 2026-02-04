import connectToDatabase from "../../../utils/db";
import Committee from "../../models/Committee";
import Admin from "../../models/Admin";

export async function GET() {
    await connectToDatabase();
    try {
        // Find committees that are open
        const committees = await Committee.find({ status: "open" })
            .populate("createdBy", "name email")
            .select("name description maxMembers members monthlyAmount monthDuration startDate endDate createdBy");

        // Filter ones that are not full
        const openCommittees = committees.filter(c => c.members.length < c.maxMembers);

        return new Response(JSON.stringify(openCommittees), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
