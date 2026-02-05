import connectToDatabase from "@/app/utils/db";
import Member from "@/app/api/models/Member";
import Committee from "@/app/api/models/Committee";
import { createLog } from "@/app/utils/logger";

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { memberIds, committeeId, adminId } = body;

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      // Fallback for single memberId if still used
      const { memberId } = body;
      if (memberId) return handleSingleAssignment(memberId, committeeId, adminId);
      return new Response(JSON.stringify({ error: "No members provided" }), { status: 400 });
    }

    const committee = await Committee.findById(committeeId);
    if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

    const results = {
      success: [],
      failed: []
    };

    for (const memberId of memberIds) {
      // Check capacity
      if (committee.members.length + committee.pendingMembers.length >= committee.maxMembers) {
        results.failed.push({ memberId, error: "Committee reached max capacity limit." });
        continue;
      }

      try {
        const member = await Member.findById(memberId);
        if (!member) {
          results.failed.push({ memberId, error: "Member not found" });
          continue;
        }

        const existingAssignment = member.committees?.find(c => c.committee.toString() === committeeId);
        if (existingAssignment) {
          results.failed.push({ memberId, name: member.name, error: "Member already assigned" });
          continue;
        }

        member.committees.push({ committee: committeeId, status: "pending" });
        await member.save();

        committee.pendingMembers.push(memberId);
        results.success.push({ memberId, name: member.name });

        await createLog({
          action: "ASSIGN_MEMBER",
          performedBy: adminId,
          onModel: "Admin",
          targetId: memberId,
          details: { committeeId, bulk: true }
        });
      } catch (mErr) {
        results.failed.push({ memberId, error: mErr.message });
      }
    }

    await committee.save();

    return new Response(JSON.stringify({
      message: `Assigned ${results.success.length} members. ${results.failed.length} failed.`,
      ...results
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to process bulk assignment", details: err.message }), { status: 400 });
  }
}

async function handleSingleAssignment(memberId, committeeId, adminId) {
  const member = await Member.findById(memberId);
  const committee = await Committee.findById(committeeId);

  if (!member || !committee) return new Response(JSON.stringify({ error: "Member or Committee not found" }), { status: 404 });

  if (committee.members.length + committee.pendingMembers.length >= committee.maxMembers) {
    return new Response(JSON.stringify({ error: "Committee reached max capacity limit." }), { status: 400 });
  }

  if (member.committees?.some(c => c.committee.toString() === committeeId)) {
    return new Response(JSON.stringify({ error: "Member already assigned" }), { status: 400 });
  }

  member.committees.push({ committee: committeeId, status: "pending" });
  await member.save();

  committee.pendingMembers.push(memberId);
  await committee.save();

  await createLog({
    action: "ASSIGN_MEMBER",
    performedBy: adminId,
    onModel: "Admin",
    targetId: memberId,
    details: { committeeId }
  });

  return new Response(JSON.stringify({ message: "Member assigned successfully" }), { status: 200 });
}
