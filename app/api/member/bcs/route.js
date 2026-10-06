import Committee from "@/app/api/models/Committee";
import { requireMember } from "@/app/utils/auth";
import { ok, serverError } from "@/app/utils/http";
import { cardSummary } from "@/app/utils/committeeView";

export const dynamic = "force-dynamic";

// GET -> { mine, requests, comingUp } for the member home screen.
export async function GET(req) {
  try {
    const auth = await requireMember(req);
    if (auth.error) return auth.error;
    const me = auth.user._id;
    const organizers = auth.user.organizers || [];

    const common = (q) =>
      Committee.find(q)
        .select("-payments.submission.screenshot -payouts.screenshot -bankDetails")
        .populate({ path: "result.member", select: "name", model: "Member" })
        .populate({ path: "createdBy", select: "name", model: "Admin" })
        .sort({ startDate: -1 })
        .limit(100)
        .lean();

    const [mine, requests, comingUp] = await Promise.all([
      common({ members: me }),
      common({ pendingMembers: me }),
      organizers.length ? common({ createdBy: { $in: organizers }, status: { $in: ["open", "full"] }, members: { $ne: me }, pendingMembers: { $ne: me }, "result.0": { $exists: false } }) : [],
    ]);

    return ok({
      mine: mine.map((c) => cardSummary(c, me)),
      requests: requests.map((c) => cardSummary(c)),
      comingUp: comingUp.map((c) => cardSummary(c)),
    });
  } catch (err) {
    return serverError(err, "member/bcs");
  }
}
