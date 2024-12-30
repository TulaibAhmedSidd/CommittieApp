import { NextResponse } from "next/server";
import Member from "../../models/Member";

// export async function POST(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Parse the request body to get userId
//     const { userId } = await req.json();

//     if (!userId) {
//       return NextResponse.json({ message: "User ID is required" }, { status: 400 });
//     }

//     // Find all member records for the given userId and populate the committees
//     const memberRecords = await Member.find({ _id: userId }).populate("committee");

//     return NextResponse.json({ committees: memberRecords }, { status: 200 });
//   } catch (err) {
//     console.error("Error fetching committees:", err);
//     return NextResponse.json(
//       { message: "Failed to fetch committees" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Parse the request body to get userId
//     const { userId } = await req.json();

//     if (!userId) {
//       return NextResponse.json(
//         { message: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Fetch user membership details and populate committee info
//     const memberRecords = await Member.find({ _id: userId }).populate(
//       "committee"
//     );

//     // Add result and position information for committees with results
//     const committeesWithResults = await Promise.all(
//       memberRecords.map(async (member) => {
//         const committee = member.committee;

//         // Check if the committee has results
//         if (committee.result && committee.result.length > 0) {
//           // Find user's position in the result array
//           const userPosition = committee.result.find(
//             (res) => res.member.toString() === userId
//           );

//           return {
//             _id: committee._id,
//             name: committee.name,
//             description: committee.description,
//             status: member.status,
//             result: userPosition
//               ? { position: userPosition.position, status: "accounted" }
//               : { status: "not accounted" },
//           };
//         }

//         // Committees without results
//         return {
//           _id: committee._id,
//           name: committee.name,
//           description: committee.description,
//           status: member.status,
//           result: { status: "results not announced" },
//         };
//       })
//     );

//     return NextResponse.json(
//       { committees: committeesWithResults },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Error fetching committees with results:", err);
//     return NextResponse.json(
//       { message: "Failed to fetch committees :" + err },
//       { status: 500 }
//     );
//   }
// }

//above is perfectly working fine

// import connectToDatabase from "../../../utils/db";
// import Committee from "../../models/Committee";

// export async function POST(req) {
//   try {
//     // Connect to database
//     await connectToDatabase();

//     // Parse incoming request data
//     const { userId } = await req.json();

//     // Validate request payload
//     if (!userId) {
//       return new Response(
//         JSON.stringify({ error: "User ID is required" }),
//         { status: 400 }
//       );
//     }

//     // Find all committees where the user is in members or pendingMembers
//     const committees = await Committee.find({
//       $or: [
//         { "members.memberId": userId },
//         { pendingMembers: userId }
//       ]
//     }).populate("members.memberId pendingMembers");

//     // Respond with the list of committees
//     return new Response(
//       JSON.stringify({ committees }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Error fetching committees:", err);
//     return new Response(
//       JSON.stringify({
//         error: "Failed to fetch committees",
//         details: err.message,
//       }),
//       { status: 500 }
//     );
//   }
// }

import connectToDatabase from "../../../utils/db";
import Committee from "../../models/Committee";

export async function POST(req) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse incoming request data
    const { userId } = await req.json();

    // Validate request payload
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    // Find all committees where the user is either in members or pendingMembers
    // const committees = await Committee.find({
    //   $or: [{ "members.memberId": userId }, { pendingMembers: userId }],
    // })
    //   .populate("members.memberId pendingMembers")
    //   .lean();
    const committees = await Committee.find()
      .populate("members.member pendingMembers")
      .lean();

    // Separate approved and pending committees
    console.log("committees", committees);
    const approvedCommittees = committees.filter((committee) => {
      console.log("committee.members", committee.members);
      return committee.members.some(
        (member) => member._id.toString() === userId
      );
    });

    const pendingCommittees = committees.filter((committee) => {
      console.log("committee.pendingMembers", committee.pendingMembers);
      return committee.pendingMembers.some(
        (member) => member?._id.toString() === userId
      );
    });

    // Respond with both approved and pending committees
    return new Response(
      JSON.stringify({ approvedCommittees, pendingCommittees }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching committees:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch committees",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
