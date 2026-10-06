import Committee from "../api/models/Committee";
import Member from "../api/models/Member";

/**
 * Put a member into a BC (used by approve and by organizer "add member").
 * Safe when two requests run at once: never goes over maxMembers, never after start.
 * Returns true if the member is in the BC afterwards.
 */
export async function addMemberToCommittee(committee, member, adminId) {
  const max = Number(committee.maxMembers) || 0;
  const res = await Committee.updateOne(
    {
      _id: committee._id,
      status: { $in: ["open", "full"] },
      "result.0": { $exists: false },
      $or: [{ members: member._id }, { [`members.${max - 1}`]: { $exists: false } }],
    },
    { $pull: { pendingMembers: member._id }, $addToSet: { members: member._id } }
  );
  if (!res.matchedCount) return false;

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
  return true;
}
