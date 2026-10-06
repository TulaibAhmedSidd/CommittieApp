import Committee from "../api/models/Committee";
import Member from "../api/models/Member";

/** Put a member into a BC (used by approve and by organizer "add member"). */
export async function addMemberToCommittee(committee, member, adminId) {
  await Committee.updateOne(
    { _id: committee._id },
    { $pull: { pendingMembers: member._id }, $addToSet: { members: member._id } }
  );
  const fresh = await Committee.findById(committee._id).select("members maxMembers status");
  if (fresh.status === "open" && fresh.members.length >= fresh.maxMembers) {
    await Committee.updateOne({ _id: committee._id, status: "open" }, { status: "full" });
  }
  const updated = await Member.updateOne(
    { _id: member._id, "committees.committee": committee._id },
    { $set: { "committees.$.status": "approved" }, $addToSet: { organizers: adminId } }
  );
  if (!updated.matchedCount) {
    await Member.updateOne(
      { _id: member._id },
      { $push: { committees: { committee: committee._id, status: "approved" } }, $addToSet: { organizers: adminId } }
    );
  }
}
