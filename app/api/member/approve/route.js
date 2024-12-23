import connectToDatabase from "../../../utils/db";
import Member from "../../models/Member";

export async function PATCH(req) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse incoming request data
    const { memberId, updates } = await req.json();

    // Validate request payload
    if (!memberId || !updates) {
      return new Response(
        JSON.stringify({ error: "Member ID and updates are required" }),
        { status: 400 }
      );
    }

    // Update the member's data in the database
    const member = await Member.findByIdAndUpdate(memberId, updates, {
      new: true,
    });

    if (!member) {
      return new Response(JSON.stringify({ error: "Member not found" }), {
        status: 404,
      });
    }

    // Return the updated member
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    console.error("Failed to update member:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to update member",
        details: err.message+ err ,
      }),
      { status: 500 }
    );
  }
}
