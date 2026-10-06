import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import { requireMember, requireCommitteeOwner } from "@/app/utils/auth";
import { ok, fail, readJson, serverError, isObjectId } from "@/app/utils/http";
import { createLog } from "@/app/utils/logger";
import { notify } from "@/app/utils/notify";
import { emails } from "@/app/utils/emailTemplates";
import { stage } from "@/app/utils/bcRules";
import { missingDocs } from "@/app/utils/memberDocs";
import { addMemberToCommittee } from "@/app/utils/committeeOps";

export const dynamic = "force-dynamic";

const has = (list, id) => (list || []).some((x) => String(x) === String(id));

// POST {}                         -> member asks to join
// POST { action: "cancel" }       -> member cancels their request
// POST { action: "approve" | "reject", memberId } -> organizer decides
export async function POST(req, { params }) {
  try {
    const body = await readJson(req);
    const action = body.action;

    if (action === "approve" || action === "reject") {
      const auth = await requireCommitteeOwner(req, params.id);
      if (auth.error) return auth.error;
      const committee = auth.committee;
      if (!isObjectId(body.memberId)) return fail(400, "Invalid member.");
      if (!has(committee.pendingMembers, body.memberId)) return fail(400, "This request is no longer waiting.");

      const member = await Member.findById(body.memberId).select("name email");
      if (!member) return fail(404, "Member not found.");

      if (action === "approve") {
        if (stage(committee) !== "upcoming") return fail(400, "This BC has already started.");
        if ((committee.members?.length || 0) >= committee.maxMembers) return fail(400, "This BC is already full.");
        await addMemberToCommittee(committee, member, auth.user._id);
        await notify({
          recipient: member,
          model: "Member",
          sender: auth.user._id,
          senderModel: "Admin",
          type: "join_approved",
          message: `You are now a member of ${committee.name}.`,
          link: `/userDash/bc/${committee._id}`,
          email: emails.joinApproved({ name: member.name, bcName: committee.name, bcId: committee._id }),
        });
      } else {
        await Committee.updateOne({ _id: committee._id }, { $pull: { pendingMembers: member._id } });
        await Member.updateOne(
          { _id: member._id, "committees.committee": committee._id },
          { $set: { "committees.$.status": "rejected" } }
        );
        await notify({
          recipient: member,
          model: "Member",
          sender: auth.user._id,
          senderModel: "Admin",
          type: "join_rejected",
          message: `Your request to join ${committee.name} was not accepted.`,
          link: "/userDash",
        });
      }

      await createLog({
        action: action === "approve" ? "APPROVE_COMMITTEE_REQUEST" : "REJECT_COMMITTEE_REQUEST",
        performedBy: auth.user._id,
        onModel: "Admin",
        targetId: committee._id,
        details: { memberId: String(member._id) },
      });
      return ok({ done: true });
    }

    // Member side
    const auth = await requireMember(req);
    if (auth.error) return auth.error;
    if (!isObjectId(params.id)) return fail(400, "Invalid BC id.");
    await connectToDatabase();
    const committee = await Committee.findById(params.id);
    if (!committee) return fail(404, "BC not found.");
    const me = auth.user;

    if (action === "cancel") {
      if (!has(committee.pendingMembers, me._id)) return fail(400, "You have no request for this BC.");
      await Committee.updateOne({ _id: committee._id }, { $pull: { pendingMembers: me._id } });
      await Member.updateOne({ _id: me._id }, { $pull: { committees: { committee: committee._id, status: "pending" } } });
      return ok({ done: true });
    }

    if (has(committee.members, me._id)) return fail(400, "You are already in this BC.");
    if (has(committee.pendingMembers, me._id)) return fail(400, "You already asked to join. Please wait for the organizer.");
    if (stage(committee) !== "upcoming") return fail(400, "This BC has already started.");
    const taken = (committee.members?.length || 0) + (committee.pendingMembers?.length || 0);
    if (taken >= committee.maxMembers) return fail(400, "This BC is full.");

    if (committee.requireDocuments && committee.mandatoryDocuments?.length) {
      const missing = missingDocs(me, committee.mandatoryDocuments);
      if (missing.length) return fail(400, `Please upload these documents in your profile first: ${missing.join(", ")}.`);
    }

    await Committee.updateOne({ _id: committee._id }, { $addToSet: { pendingMembers: me._id } });
    const existing = await Member.updateOne(
      { _id: me._id, "committees.committee": committee._id },
      { $set: { "committees.$.status": "pending" } }
    );
    if (!existing.matchedCount) {
      await Member.updateOne({ _id: me._id }, { $push: { committees: { committee: committee._id, status: "pending" } } });
    }

    await notify({
      recipient: committee.createdBy,
      model: "Admin",
      sender: me._id,
      senderModel: "Member",
      type: "join_request",
      message: `${me.name} wants to join ${committee.name}.`,
      link: `/admin/bc/${committee._id}`,
    });
    await createLog({ action: "REQUEST_JOIN_COMMITTEE", performedBy: me._id, onModel: "Member", targetId: committee._id });
    return ok({ done: true }, 201);
  } catch (err) {
    return serverError(err, "committee request");
  }
}
