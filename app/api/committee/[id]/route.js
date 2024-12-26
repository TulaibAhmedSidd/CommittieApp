import connectToDatabase from "../../../utils/db";
import Committee from "../../models/Committee";

export async function GET(req, { params }) {
  await connectToDatabase();
  const { id } = params; // Get member ID from URL

  try {
    const FoundComittie = await Committee.findById(id).populate({
        path: 'members', // Field name in your Committee schema
        model: 'Member', // Model name that is referenced
    });
    return new Response(JSON.stringify(FoundComittie), { status: 200 });
  } catch (err) {
    return new Response("Can't found" + err, { status: 400 });
  }
}
