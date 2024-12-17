import connectToDatabase from "../../utils/db";
import Committee from "../models/Committee";
import Member from "../models/Member";

// export async function PUT(req) {
//   try {
//     await connectToDatabase();

//     // Extract committee ID from the request body
//     const { committeeId } = await req.json();

//     if (!committeeId) {
//       return new Response(
//         JSON.stringify({ error: "Committee ID is required" }),
//         { status: 400 }
//       );
//     }

//     // Fetch the committee and populate members
//     const committee = await Committee.findById(committeeId).populate({
//       path: "members",
//       model: "Member",
//       match: { status: "approved" }, // Only approved members
//     });

//     if (!committee) {
//       return new Response(JSON.stringify({ error: "Committee not found" }), {
//         status: 404,
//       });
//     }

//     if (!committee.members || committee.members.length === 0) {
//       return new Response(
//         JSON.stringify({ error: "No approved members to rank" }),
//         { status: 400 }
//       );
//     }

//     // Randomize approved members and assign positions
//     const shuffledMembers = committee.members
//       .map((member) => ({ member, sort: Math.random() }))
//       .sort((a, b) => a.sort - b.sort)
//       .map((entry, index) => ({
//         member: entry.member._id,
//         position: index + 1,
//       }));

//     // Update committee results
//     committee.result = shuffledMembers;
//     await committee.save();

//     return new Response(
//       JSON.stringify({
//         message: "Results announced successfully",
//         result: shuffledMembers,
//       }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Error announcing results:", err);
//     return new Response(
//       JSON.stringify({
//         error: "Failed to announce results",
//         details: err.message,
//       }),
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Parse request
//     const { committeeId } = await req.json();

//     // Fetch the committee and populate member details
//     const committee = await Committee.findById(committeeId).populate({
//       path: "result.member",
//       select: "name email", // Include the desired fields (e.g., name and email)
//     });

//     if (!committee) {
//       return new Response(JSON.stringify({ error: "Committee not found" }), {
//         status: 404,
//       });
//     }

//     // Check if results already exist
//     if (!committee.result || committee.result.length === 0) {
//       return new Response(
//         JSON.stringify({ error: "No results announced yet" }),
//         { status: 400 }
//       );
//     }

//     // Prepare results with member details
//     const resultsWithNames = committee.result.map((entry) => ({
//       memberId: entry.member._id,
//       name: entry.member.name,
//       email: entry.member.email,
//       position: entry.position,
//     }));

//     // Return results
//     return new Response(
//       JSON.stringify({
//         message: "Results announced successfully",
//         result: resultsWithNames,
//       }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Error fetching announcement results:", err);
//     return new Response(
//       JSON.stringify({
//         error: "Failed to fetch results",
//         details: err.message,
//       }),
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse request
    const { committeeId } = await req.json();

    // Fetch the committee and populate members
    const committee = await Committee.findById(committeeId).populate("members");

    if (!committee) {
      return new Response(JSON.stringify({ error: "Committee not found" }), {
        status: 404,
      });
    }

    // Validate if members are full
    if (committee.members.length < committee.maxMembers) {
      return new Response(
        JSON.stringify({
          error: `Cannot announce results: ${committee.members.length}/${committee.maxMembers} members registered.`,
        }),
        { status: 400 }
      );
    }

    // Randomize and assign positions
    const approvedMembers = committee.members.filter(
      (member) => member.status === "approved"
    );

    if (approvedMembers.length < committee.maxMembers) {
      return new Response(
        JSON.stringify({
          error: "Cannot announce results: Not all members are approved.",
        }),
        { status: 400 }
      );
    }

    const randomizedResults = approvedMembers
      .map((member) => ({ member, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry, index) => ({
        member: entry.member._id,
        position: index + 1,
      }));

    // Save results to the committee
    committee.result = randomizedResults;
    await committee.save();

    // Populate results with member names
    await committee.populate({
      path: "result.member",
      select: "name email",
    });

    const resultsWithNames = committee.result.map((entry) => ({
      memberId: entry.member._id,
      name: entry.member.name,
      email: entry.member.email,
      position: entry.position,
    }));

    return new Response(
      JSON.stringify({
        message: "Results announced successfully",
        result: resultsWithNames,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error announcing results:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to announce results",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
