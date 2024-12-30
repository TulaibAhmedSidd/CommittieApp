import connectToDatabase from "../../../utils/db";
import Member from "../../models/Member";
import Committee from "../../models/Committee";

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { memberId, committeeId } = await req.json();

    const member = await Member.findById(memberId);
    const committee = await Committee.findById(committeeId);

    if (!member || !committee) {
      return new Response(
        JSON.stringify({ error: "Member or Committee not found" }),
        { status: 404 }
      );
    }

    // Check if the member is assigned to the committee
    const committeeEntryIndex = member?.committees?.findIndex(
      (c) => c.committee.toString() === committeeId
    );

    if (committeeEntryIndex === -1) {
      return new Response(
        JSON.stringify({
          error: "Member is not assigned to this committee",
        }),
        { status: 400 }
      );
    }

    // Remove the member from the committee's member or pendingMembers list
    if (committee.members.includes(memberId)) {
      committee.members = committee.members.filter(
        (id) => id.toString() !== memberId.toString()
      );
    } else if (committee.pendingMembers.includes(memberId)) {
      committee.pendingMembers = committee.pendingMembers.filter(
        (id) => id.toString() !== memberId.toString()
      );
    }

    await committee.save();

    // Remove the committee entry from the member's committees list
    member.committees.splice(committeeEntryIndex, 1);
    await member.save();

    return new Response(
      JSON.stringify({ message: "Member unassigned successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to unassign member",
        details: err.message + err,
      }),
      { status: 400 }
    );
  }
}
