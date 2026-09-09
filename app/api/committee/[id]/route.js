import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  await connectToDatabase();
  const { id } = await params; // Get member ID from URL

  try {
    const FoundComittie = await Committee.findById(id)
      .populate({
        path: "members", // Field name in your Committee schema
        model: "Member", // Model name that is referenced
      })
      .populate({
        path: "pendingMembers", // Field name in your Committee schema
        model: "Member", // Model name that is referenced
      })
      .populate({
        path: "result.member",
        // select: "name email",
      });
    return new Response(JSON.stringify(FoundComittie), { status: 200 });
  } catch (err) {
    return new Response("Can't found" + err, { status: 400 });
  }
}
