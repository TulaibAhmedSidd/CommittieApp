import connectToDatabase from "@/app/utils/db";
import Member from "@/app/api/models/Member";
import Committee from "@/app/api/models/Committee";

export async function PATCH(req) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse incoming request data
    const { memberId, committeeId } = await req.json();

    // Validate request payload
    if (!memberId || !committeeId) {
      return new Response(
        JSON.stringify({ error: "Member ID and committee ID are required" }),
        { status: 400 }
      );
    }

    // Find the member by ID
    const member = await Member.findById(memberId);
    if (!member) {
      return new Response(JSON.stringify({ error: "Member not found" }), {
        status: 404,
      });
    }

    // Find the committee by ID
    const committee = await Committee.findById(committeeId);
    if (!committee) {
      return new Response(JSON.stringify({ error: "Committee not found" }), {
        status: 404,
      });
    }

    // Find the specific committee in the member's committees array
    const memberCommittee = member.committees.find(
      (committeeObj) =>
        committeeObj.committee.toString() === committeeId.toString()
    );

    if (!memberCommittee) {
      return new Response(
        JSON.stringify({ error: "Member is not part of this committee" }),
        { status: 400 }
      );
    }

    // Check if the member's current status is 'approved'
    if (memberCommittee.status !== "approved") {
      return new Response(
        JSON.stringify({ error: "Only approved members can be disapproved" }),
        { status: 400 }
      );
    }

    // Move the member from members to pendingMembers in the committee
    committee.members = committee.members.filter(
      (id) => id.toString() !== memberId.toString()
    );
    committee.pendingMembers.push(memberId);

    // Update the status of the member to 'pending' in the member's committees array
    memberCommittee.status = "pending";

    // Save both the updated member and the committee
    await member.save();
    await committee.save();

    // Return the updated member
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    console.error("Failed to disapprove member:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to disapprove member",
        details: err.message + err,
      }),
      { status: 500 }
    );
  }
}
