import connectToDatabase from "@/app/utils/db";
import Review from "@/app/api/models/Review";
import Committee from "@/app/api/models/Committee";
import { requireMember } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";

export const dynamic = "force-dynamic";

// POST { organizerId, rating 1-5, comment? } -> member reviews an organizer after a finished BC. One per organizer.
export async function POST(req) {
  try {
    const auth = await requireMember(req);
    if (auth.error) return auth.error;
    const { organizerId, rating, comment } = await readJson(req);
    const stars = Math.round(Number(rating));
    if (!isObjectId(organizerId)) return fail(400, "Invalid organizer.");
    if (!(stars >= 1 && stars <= 5)) return fail(400, "Choose 1 to 5 stars.");

    const finished = await Committee.exists({ createdBy: organizerId, members: auth.user._id, status: "finished" });
    if (!finished) return fail(403, "You can review after finishing a BC with this organizer.");

    await Review.findOneAndUpdate(
      { organizer: organizerId, member: auth.user._id },
      { rating: stars, comment: typeof comment === "string" ? comment.trim().slice(0, 500) : "", createdAt: new Date() },
      { upsert: true }
    );
    return ok({ saved: true }, 201);
  } catch (err) {
    return serverError(err, "review POST");
  }
}

// GET ?organizerId= -> public reviews (first name only)
export async function GET(req) {
  try {
    const organizerId = new URL(req.url).searchParams.get("organizerId");
    if (!isObjectId(organizerId)) return fail(400, "Invalid organizer.");
    await connectToDatabase();
    const reviews = await Review.find({ organizer: organizerId }).populate("member", "name").sort({ createdAt: -1 }).limit(50).lean();
    return ok({
      reviews: reviews.map((r) => ({
        _id: String(r._id),
        rating: r.rating,
        comment: r.comment || "",
        createdAt: r.createdAt,
        memberName: String(r.member?.name || "Member").split(" ")[0],
      })),
    });
  } catch (err) {
    return serverError(err, "review GET");
  }
}
