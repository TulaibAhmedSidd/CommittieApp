// import connectToDatabase from "../../../utils/db";
// import Member from "../../models/Member";

// export async function PATCH(req) {
//   try {
//     // Connect to database
//     await connectToDatabase();

//     // Parse incoming request data
//     const { memberId, updates } = await req.json();

//     // Validate request payload
//     if (!memberId || !updates) {
//       return new Response(
//         JSON.stringify({ error: "Member ID and updates are required" }),
//         { status: 400 }
//       );
//     }

//     // Update the member's data in the database
//     const member = await Member.findByIdAndUpdate(memberId, updates, {
//       new: true,
//     });

//     if (!member) {
//       return new Response(JSON.stringify({ error: "Member not found" }), {
//         status: 404,
//       });
//     }

//     // Return the updated member
//     return new Response(JSON.stringify(member), { status: 200 });
//   } catch (err) {
//     console.error("Failed to update member:", err);
//     return new Response(
//       JSON.stringify({
//         error: "Failed to update member",
//         details: err.message+ err ,
//       }),
//       { status: 500 }
//     );
//   }
// }



import connectToDatabase from "../../../utils/db";
import Member from "../../models/Member";
import Committee from "../../models/Committee";  // Assuming you have a Committee model

export async function PATCH(req) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse incoming request data
    const { memberId, updates, committeeId } = await req.json();

    // Validate request payload
    if (!memberId || !updates || !committeeId) {
      return new Response(
        JSON.stringify({ error: "Member ID, updates, and committee ID are required" }),
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
    const memberCommittee = member.committees.find((committeeObj) => committeeObj.committee.toString() === committeeId.toString());

    if (!memberCommittee) {
      return new Response(JSON.stringify({ error: "Member is not part of this committee" }), {
        status: 400,
      });
    }

    // If the member's status is not 'pending', return an error
    if (memberCommittee.status !== "pending") {
      return new Response(
        JSON.stringify({ error: "Member must be in pending status to approve" }),
        { status: 400 }
      );
    }

    // Update the status of the member to 'approved' in the member's committees array
    memberCommittee.status = "approved";

    // Move the member from pendingMembers to members in the committee
    committee.pendingMembers = committee.pendingMembers.filter(
      (id) => id.toString() !== memberId.toString()
    );
    committee.members.push(memberId);

    // Save both the updated member and the committee
    await member.save();
    await committee.save();

    // Return the updated member
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    console.error("Failed to update member:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to update member",
        details: err.message + err,
      }),
      { status: 500 }
    );
  }
}
