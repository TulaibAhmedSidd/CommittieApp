import { NextResponse } from "next/server";
import Member from "../../models/Member";
import connectToDatabase from "../../../utils/db";

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

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body to get userId
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user membership details and populate committee info
    const memberRecords = await Member.find({ _id: userId }).populate(
      "committee"
    );

    // Add result and position information for committees with results
    const committeesWithResults = await Promise.all(
      memberRecords.map(async (member) => {
        const committee = member.committee;

        // Check if the committee has results
        if (committee.result && committee.result.length > 0) {
          // Find user's position in the result array
          const userPosition = committee.result.find(
            (res) => res.member.toString() === userId
          );

          return {
            _id: committee._id,
            name: committee.name,
            description: committee.description,
            status: member.status,
            result: userPosition
              ? { position: userPosition.position, status: "accounted" }
              : { status: "not accounted" },
          };
        }

        // Committees without results
        return {
          _id: committee._id,
          name: committee.name,
          description: committee.description,
          status: member.status,
          result: { status: "results not announced" },
        };
      })
    );

    return NextResponse.json(
      { committees: committeesWithResults },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching committees with results:", err);
    return NextResponse.json(
      { message: "Failed to fetch committees :" + err },
      { status: 500 }
    );
  }
}
