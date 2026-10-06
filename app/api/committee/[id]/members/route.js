import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import { requireCommitteeOwner, adminCanManageMember } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { createLog } from "@/app/utils/logger";
import { notify } from "@/app/utils/notify";
import { emails } from "@/app/utils/emailTemplates";
import { addMemberToCommittee } from "@/app/utils/committeeOps";
import { stage } from "@/app/utils/bcRules";

export const dynamic = "force-dynamic";

// POST { memberIds: [] } -> organizer adds their own members straight into the BC (before it starts).
export async function POST(req, { params }) {
  try {
    const auth = await requireCommitteeOwner(req, params.id);
    if (auth.error) return auth.error;
    const c = auth.committee;
    const body = await readJson(req);
    const ids = (Array.isArray(body.memberIds) ? body.memberIds : [body.memberId]).filter(isObjectId);
    if (!ids.length) return fail(400, "Choose at least one member.");
    if (stage(c) !== "upcoming") return fail(400, "Members can only be added before the BC starts.");

    const free = c.maxMembers - (c.members?.length || 0);
    const already = new Set((c.members || []).map(String));
    const toAdd = ids.filter((id) => !already.has(id));
    if (toAdd.length > free) return fail(400, `Only ${free} place(s) left in this BC.`);

    const members = await Member.find({ _id: { $in: toAdd } }).select("name email organizers createdBy referredBy status");
    const added = [];
    for (const m of members) {
      if (!adminCanManageMember(auth.user, m)) continue;
      await addMemberToCommittee(c, m, auth.user._id);
      added.push(m.name);
      if (m.status !== "invited") {
        await notify({
          recipient: m,
          model: "Member",
          sender: auth.user._id,
          senderModel: "Admin",
          type: "added_to_bc",
          message: `${auth.user.name} added you to ${c.name}.`,
          link: `/userDash/bc/${c._id}`,
          email: emails.joinApproved({ name: m.name, bcName: c.name, bcId: c._id }),
        });
      }
    }
    if (!added.length) return fail(400, "These people are not in your members list.");
    await createLog({ action: "ASSIGN_MEMBER", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { count: added.length } });
    return ok({ added: added.length });
  } catch (err) {
    return serverError(err, "committee members POST");
  }
}

// DELETE { memberId } -> remove a member (or a request) before the BC starts.
export async function DELETE(req, { params }) {
  try {
    const auth = await requireCommitteeOwner(req, params.id);
    if (auth.error) return auth.error;
    const c = auth.committee;
    const { memberId } = await readJson(req);
    if (!isObjectId(memberId)) return fail(400, "Invalid member.");
    if (stage(c) !== "upcoming") return fail(400, "Members can't be removed after the BC starts.");

    await Committee.updateOne({ _id: c._id }, { $pull: { members: memberId, pendingMembers: memberId } });
    await Committee.updateOne({ _id: c._id, status: "full" }, { status: "open" });
    await Member.updateOne({ _id: memberId, "committees.committee": c._id }, { $set: { "committees.$.status": "removed" } });
    await createLog({ action: "UNASSIGN_MEMBER", performedBy: auth.user._id, onModel: "Admin", targetId: c._id, details: { memberId } });
    return ok({ removed: true });
  } catch (err) {
    return serverError(err, "committee members DELETE");
  }
}
