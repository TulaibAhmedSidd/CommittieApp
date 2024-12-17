import connectToDatabase from "../../utils/db";
import Committee from "../models/Committee";
import Member from "../models/Member";

export async function PUT(req) {
  try {
    await connectToDatabase();

    // Extract committee ID from the request body
    const { committeeId } = await req.json();

    if (!committeeId) {
      return new Response(
        JSON.stringify({ error: "Committee ID is required" }),
        { status: 400 }
      );
    }

    // Fetch the committee and populate members
    const committee = await Committee.findById(committeeId).populate({
      path: "members",
      model: "Member",
      match: { status: "approved" }, // Only approved members
    });

    if (!committee) {
      return new Response(JSON.stringify({ error: "Committee not found" }), {
        status: 404,
      });
    }

    if (!committee.members || committee.members.length === 0) {
      return new Response(
        JSON.stringify({ error: "No approved members to rank" }),
        { status: 400 }
      );
    }

    // Randomize approved members and assign positions
    const shuffledMembers = committee.members
      .map((member) => ({ member, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry, index) => ({
        member: entry.member._id,
        position: index + 1,
      }));

    // Update committee results
    committee.result = shuffledMembers;
    await committee.save();

    return new Response(
      JSON.stringify({
        message: "Results announced successfully",
        result: shuffledMembers,
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
