import { NextResponse } from "next/server";
import Member from "../../models/Member";
import connectToDatabase from "../../../utils/db";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body to get userId
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Find all member records for the given userId and populate the committees
    const memberRecords = await Member.find({ _id: userId }).populate("committee");

    return NextResponse.json({ committees: memberRecords }, { status: 200 });
  } catch (err) {
    console.error("Error fetching committees:", err);
    return NextResponse.json(
      { message: "Failed to fetch committees" },
      { status: 500 }
    );
  }
}
