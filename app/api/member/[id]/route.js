import Member from "../../models/Member"; // Ensure correct path to your Member model

// Handle Update (GET)
export async function GET(req, { params }) {
  const { id } = params; // Get member ID from URL

  try {
    const member = await Member.findById(id);
    if (!member) return new Response("Member not found", { status: 404 });
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    return new Response("Failed to update member" + err, { status: 500 });
  }
}
// Handle Update (PUT)
// export async function PUT(req, { params }) {
//   const { id } = params; // Get member ID from URL
//   const { name, email } = await req.json();

//   try {
//     const member = await Member.findByIdAndUpdate(
//       id,
//       { name, email },
//       { new: true }
//     );
//     if (!member) return new Response("Member not found", { status: 404 });
//     return new Response(JSON.stringify(member), { status: 200 });
//   } catch (err) {
//     return new Response("Failed to update member" + err, { status: 500 });
//   }
// }

export async function PUT(req, { params }) {
  const { id } = params; // Get member ID from URL
  const { name, email, userId } = await req.json(); // Include userId of the requester

  try {
    const member = await Member.findById(id);

    if (!member) {
      return new Response("Member not found", { status: 404 });
    }

    // Check if the user has permission to update the member
    if (member.createdBy.toString() !== userId) {
      return new Response("Unauthorized to update this member", {
        status: 403,
      });
    }

    // Update the member
    member.name = name || member.name;
    member.email = email || member.email;
    await member.save();

    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    return new Response("Failed to update member: " + err, { status: 500 });
  }
}

// Handle Delete (DELETE)
// export async function DELETE(req, { params }) {
//   const { id } = params; // Get member ID from URL

//   try {
//     const member = await Member.findByIdAndDelete(id);
//     if (!member) return new Response("Member not found", { status: 404 });
//     return new Response("Member deleted successfully", { status: 200 });
//   } catch (err) {
//     return new Response("Failed to delete member" + err, { status: 500 });
//   }
// }

export async function DELETE(req, { params }) {
  const { id } = params; // Get member ID from URL
  const { userId = ''  } = await req.json(); // Include userId of the requester

  try {
    const member = await Member.findById(id);

    if (!member) {
      return new Response("Member not found", { status: 404 });
    }

    // Check if the user has permission to delete the member
    if (member?.createdBy?.toString() !== userId) {
      return new Response("Unauthorized to delete this member", {
        status: 403,
      });
    }

    await Member.findByIdAndDelete(id);
    return new Response("Member deleted successfully", { status: 200 });
  } catch (err) {
    return new Response("Failed to delete member: " + err, { status: 500 });
  }
}
