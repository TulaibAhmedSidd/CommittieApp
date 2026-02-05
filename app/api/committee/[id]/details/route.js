import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Admin from "@/app/api/models/Admin";
import Review from "@/app/api/models/Review";

export async function GET(req, { params }) {
    await connectToDatabase();
    const { id } = await params;

    try {
        const committee = await Committee.findById(id)
            .populate({
                path: "members",
                select: "name email verificationStatus location city phone"
            })
            .populate({
                path: "result.member",
                select: "name email"
            });

        if (!committee) {
            return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });
        }

        // Fetch Organizer details
        const organizer = await Admin.findById(committee.createdBy)
            .select("name email verificationStatus city country location");

        // Fetch Organizer reviews
        const reviews = await Review.find({ organizer: committee.createdBy })
            .populate("member", "name email")
            .sort({ createdAt: -1 });

        const averageRating = reviews.length > 0
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
            : 0;

        return new Response(JSON.stringify({
            committee,
            organizer: {
                ...organizer.toObject(),
                reviews,
                averageRating,
                totalReviews: reviews.length
            }
        }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
