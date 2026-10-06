import connectToDatabase from "@/app/utils/db";
import Admin from "@/app/api/models/Admin";
import Committee from "@/app/api/models/Committee";
import Review from "@/app/api/models/Review";
import { ok, fail, serverError, isObjectId } from "@/app/utils/http";
import { ADMIN_PUBLIC } from "@/app/utils/fields";
import { stage } from "@/app/utils/bcRules";
import { requireUser } from "@/app/utils/auth";

export const dynamic = "force-dynamic";

// GET -> public organizer profile: name, city, blue tick, rating, BC counts, upcoming BCs.
export async function GET(req, { params }) {
  try {
    if (!isObjectId(params.id)) return fail(400, "Invalid organizer.");
    await connectToDatabase();
    const admin = await Admin.findOne({ _id: params.id, status: "approved" }).select(ADMIN_PUBLIC).lean();
    if (!admin) return fail(404, "Organizer not found.");

    const [bcs, reviews] = await Promise.all([
      Committee.find({ createdBy: admin._id }).select("name status monthlyAmount maxMembers members pendingMembers startDate result payments").lean(),
      Review.find({ organizer: admin._id }).select("rating").lean(),
    ]);
    // Optional viewer (logged-in member) for join / follow flags.
    let viewer = null;
    if (req.headers.get("authorization")) {
      const auth = await requireUser(req);
      if (!auth.error && !auth.isAdmin) viewer = auth.user;
    }
    const vid = viewer ? String(viewer._id) : null;
    const has = (list) => !!vid && (list || []).some((x) => String(x) === vid);

    const byStage = { upcoming: [], running: 0, finished: 0 };
    for (const c of bcs) {
      const s = stage(c);
      if (s === "upcoming") {
        byStage.upcoming.push({
          _id: String(c._id),
          name: c.name,
          monthlyAmount: c.monthlyAmount,
          maxMembers: c.maxMembers,
          membersCount: c.members?.length || 0,
          spotsLeft: Math.max(c.maxMembers - (c.members?.length || 0) - (c.pendingMembers?.length || 0), 0),
          startDate: c.startDate,
          isMember: has(c.members),
          isPending: has(c.pendingMembers),
        });
      } else byStage[s] += 1;
    }
    const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
    return ok({
      organizer: {
        _id: String(admin._id),
        name: admin.name,
        city: admin.city || "",
        verificationStatus: admin.verificationStatus,
        averageRating: Math.round(avg * 10) / 10,
        reviewCount: reviews.length,
        runningCount: byStage.running,
        finishedCount: byStage.finished,
        upcoming: byStage.upcoming,
        following: viewer ? has(viewer.organizers) : false,
      },
    });
  } catch (err) {
    return serverError(err, "admin/[id]/details");
  }
}
