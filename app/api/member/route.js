import connectToDatabase from "../../utils/db";
import Committee from "../models/Committee";
import Member from "../models/Member";

// export async function GET() {
//   await connectToDatabase();
//   try {
//     const members = await Member.find();
//     return new Response(JSON.stringify(members), { status: 200 });
//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: "Failed to fetch members" }),
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     await connectToDatabase();
//     const { id } = req.query;
//     const { name, email } = req.body;
//     const committee = await Committee.findById(id);

//     if (!committee || committee.status === "full") {
//       return res.status(400).json({ error: "Committee not available or full" });
//     }

//     const newMember = new Member({ name, email, committee: committee._id });
//     await newMember.save();

//     committee.members.push(newMember);
//     if (committee.members.length >= committee.maxMembers) {
//       committee.status = "full";
//     }
//     await committee.save();
//     return new Response(JSON.stringify(newMember), { status: 201 });

//     // res.status(201).json(newMember);
//   } catch (err) {
//     return new Response(JSON.stringify({ error: "Failed to create member"+err }), {
//       status: 400,
//     });
//     // res.status(400).json({ error: 'Failed to register member' });
//   }
// }

// export async function approveMember(req, res) {
//   try {
//     await connectToDatabase();
//     const { committeeId, memberId } = req.query;

//     const member = await Member.findById(memberId);
//     if (!member || member.status === "approved") {
//       return new Response(
//         JSON.stringify({ error: "Failed to create memeber" }),
//         { status: 400 }
//       );
//       // return res
//       // .status(400)
//       // .json({ error: "Member not found or already approved" });
//     }

//     member.status = "approved";
//     await member.save();
//     return new Response(JSON.stringify(member), { status: 201 });
//     // res.status(200).json({ message: "Member approved", member });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: "Failed to appov mmebr" }), {
//       status: 400,
//     });
//     // res.status(400).json({ error: "Failed to approve member" });
//   }
// }

// GET all members or by committee
// export async function GET(req) {
//     try {
//         const url = new URL(req.url);
//         const committeeId = url.searchParams.get('committeeId');

//         await connectToDatabase();
//         const query = committeeId ? { committee: committeeId } : {};
//         const members = await Member.find(query).populate('committee');
//         return new Response(JSON.stringify(members), { status: 200 });
//     } catch (err) {
//         return new Response(JSON.stringify({ error: 'Failed to fetch members' }), { status: 500 });
//     }
// }

// // POST: Create a new member
// export async function POST(req) {
//     try {
//         await connectToDatabase();
//         const { name, email, committeeId } = await req.json();
//         const committee = await Committee.findById(committeeId);

//         if (!committee) {
//             return new Response(JSON.stringify({ error: 'Committee not found' }), { status: 404 });
//         }
//         if (committee.status === 'full') {
//             return new Response(JSON.stringify({ error: 'Committee is full' }), { status: 400 });
//         }

//         const newMember = new Member({ name, email, committee: committeeId });
//         await newMember.save();

//         committee.members.push(newMember);
//         if (committee.members.length >= committee.maxMembers) {
//             committee.status = 'full';
//         }
//         await committee.save();

//         return new Response(JSON.stringify(newMember), { status: 201 });
//     } catch (err) {
//         return new Response(JSON.stringify({ error: 'Failed to create member' }), { status: 400 });
//     }
// }

// // PATCH: Approve a member
// export async function PATCH(req) {
//     try {
//         await connectToDatabase();
//         const { id, updates } = await req.json();

//         const member = await Member.findByIdAndUpdate(id, updates, { new: true });
//         if (!member) {
//             return new Response(JSON.stringify({ error: 'Member not found' }), { status: 404 });
//         }

//         return new Response(JSON.stringify(member), { status: 200 });
//     } catch (err) {
//         return new Response(JSON.stringify({ error: 'Failed to update member' }), { status: 400 });
//     }
// }

export async function GET() {
  try {
    await connectToDatabase();
    const members = await Member.find();
    return new Response(JSON.stringify(members), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch members" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, email } = await req.json();

    const newMember = new Member({ name, email });
    await newMember.save();

    return new Response(JSON.stringify(newMember), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to add member" }), {
      status: 400,
    });
  }
}

// DELETE: Remove a member
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    await connectToDatabase();
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return new Response(JSON.stringify({ error: "Member not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Member removed successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to delete member" }), {
      status: 400,
    });
  }
}
