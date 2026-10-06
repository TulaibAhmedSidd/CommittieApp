import { requireUser } from "@/app/utils/auth";
import { ok, fail, serverError, isObjectId } from "@/app/utils/http";
import { loadCommitteeFull, ownerView, memberView, publicView } from "@/app/utils/committeeView";
import { idOf, stage } from "@/app/utils/bcRules";

export const dynamic = "force-dynamic";

// GET -> the BC, shaped for who is asking (owner / member of the BC / anyone logged in for upcoming BCs).
export async function GET(req, { params }) {
  try {
    const auth = await requireUser(req);
    if (auth.error) return auth.error;
    if (!isObjectId(params.id)) return fail(400, "Invalid BC id.");

    const c = await loadCommitteeFull(params.id);
    if (!c) return fail(404, "BC not found.");

    const me = String(auth.user._id);
    if (auth.isAdmin && (idOf(c.createdBy) === me || auth.user.isSuperAdmin)) {
      return ok({ committee: ownerView(c) });
    }
    if (!auth.isAdmin && (c.members || []).some((m) => idOf(m) === me)) {
      return ok({ committee: memberView(c, me) });
    }
    if (stage(c) === "upcoming" || (!auth.isAdmin && (c.pendingMembers || []).some((m) => idOf(m) === me))) {
      return ok({ committee: publicView(c, me) });
    }
    return fail(403, "You are not part of this BC.");
  } catch (err) {
    return serverError(err, "committee/[id] GET");
  }
}
