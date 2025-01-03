import Member from "../../models/Member"; // Ensure correct path to your Member model

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get("createdBy"); // Get the `createdBy` query parameter

    if (!createdBy) {
      return new Response("createdBy parameter is required", { status: 400 });
    }

    const members = await Member.find({ createdBy });

    if (!members.length) {
      return new Response("No members found for the given createdBy ID", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(members), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch members: " + err, { status: 500 });
  }
}
