import connectToDatabase from "../../utils/db";
import Committee from "../models/Committee";

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
    
    // Check if results are already announced
    if (committee.result && committee.result.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Results have already been announced for this committee.",
        }),
        { status: 400 }
      );
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
        error: "Failed to announce results"+ err ,
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
