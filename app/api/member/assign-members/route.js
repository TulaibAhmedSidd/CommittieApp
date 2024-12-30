import connectToDatabase from "../../../utils/db";
import CommonData from "../../../utils/data";
import Member from "../../models/Member";
import Committee from "../../models/Committee";
// export async function PATCH(req) {
//   try {
//     await connectToDatabase();
//     const { memberId, committeeId } = await req.json();

//     const member = await Member.findById(memberId);
//     const committee = await Committee.findById(committeeId);

//     if (!member || !committee) {
//       return new Response(
//         JSON.stringify({ error: "Member or Committee not found" }),
//         { status: 404 }
//       );
//     }

//     // Check if the member is already in a committee
//     if (member.committee) {
//       return new Response(
//         JSON.stringify({
//           error: "Member is already assigned to a committee",
//         }),
//         { status: 400 }
//       );
//     }

//     // Check if committee is full
//     if (committee.members.length >= committee.maxMembers) {
//       return new Response(
//         JSON.stringify({ error: "Committee is already full" }),
//         { status: 400 }
//       );
//     }

//     // Update member and committee
//     member.committee = committee._id;
//     await member.save();

//     committee.members.push(member._id);
//     await committee.save();

//     return new Response(
//       JSON.stringify({ message: "Member assigned successfully", member }),
//       { status: 200 }
//     );
//   } catch (err) {
//     return new Response(
//       JSON.stringify({
//         error: "Failed to assign member",
//         details: err.message+ err ,
//       }),
//       { status: 400 }
//     );
//   }
// }

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

    // Check if the member is already in the committee
    if (member.committee && member.committee.toString() === committeeId) {
      return new Response(
        JSON.stringify({
          error: "Member is already assigned to this committee",
        }),
        { status: 400 }
      );
    }

    // Check if committee is full
    if (committee.members.length >= committee.maxMembers) {
      return new Response(
        JSON.stringify({ error: "Committee is already full" }),
        { status: 400 }
      );
    }

    // Remove member from previous committee if they are assigned to another committee
    // if (member.committee) {
    //   const previousCommittee = await Committee.findById(member.committee);
    //   previousCommittee.members = previousCommittee.members.filter(
    //     (id) => id.toString() !== member._id.toString()
    //   );
    //   await previousCommittee.save();
    // }

    // Update member and committee
    member.committee = committee._id;
    member.status = CommonData.status.pending;
    await member.save();

    committee.members.push(member._id);
    await committee.save();

    return new Response(
      JSON.stringify({ message: "Member assigned successfully", member }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to assign member",
        details: err.message + err,
      }),
      { status: 400 }
    );
  }
}
