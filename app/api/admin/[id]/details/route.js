import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";
import Review from "@/app/api/models/Review";
import Committee from "@/app/api/models/Committee";

export async function GET(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const admin = await Admin.findById(id).select("-password");
        if (!admin) return new Response(JSON.stringify({ error: "Organizer not found" }), { status: 404 });

        const reviews = await Review.find({ organizer: id }).populate("member", "name");
        const committees = await Committee.find({ organizer: id });

        // Calculate Average Rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
            : 0;

        return new Response(JSON.stringify({
            ...admin.toObject(),
            reviews,
            committeeCount: committees.length,
            averageRating: avgRating.toFixed(1)
        }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
