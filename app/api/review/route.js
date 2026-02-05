import connectToDatabase from "@/app/utils/db";
import Review from "@/app/api/models/Review";
import Admin from "@/app/api/models/Admin";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { organizerId, memberId, rating, comment } = await req.json();

        if (!organizerId || !memberId || !rating) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const review = new Review({
            organizer: organizerId,
            member: memberId,
            rating,
            comment
        });

        await review.save();

        // Update organizer's average rating (optional but good for performance)
        // For now we'll just fetch them on demand

        return new Response(JSON.stringify(review), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const organizerId = searchParams.get("organizerId");

        if (!organizerId) {
            return new Response(JSON.stringify({ error: "Organizer ID required" }), { status: 400 });
        }

        const reviews = await Review.find({ organizer: organizerId })
            .populate("member", "name")
            .sort({ createdAt: -1 });

        return new Response(JSON.stringify(reviews), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
