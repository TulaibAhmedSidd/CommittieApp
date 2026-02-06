import Member from "@/app/api/models/Member";
import Admin from "@/app/api/models/Admin";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/app/utils/db";

// Handle Update (GET)
export async function GET(req, { params }) {
  const { id } = params;
  try {
    await connectToDatabase();
    const member = await Member.findById(id);
    if (!member) return new Response("Member not found", { status: 404 });
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch member: " + err, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { name, email, password, userId, phone } = await req.json();

  try {
    await connectToDatabase();
    const member = await Member.findById(id);
    if (!member) return new Response("Member not found", { status: 404 });

    const requester = await Admin.findById(userId);
    const isSuperAdmin = requester?.email?.toLowerCase() === "tulaib@gmail.com";

    // Authorization check
    if (!isSuperAdmin && member.createdBy.toString() !== userId) {
      return new Response("Unauthorized to update this member", { status: 403 });
    }

    // Update fields
    if (name) member.name = name;
    if (email) member.email = email;
    if (phone) member.phone = phone;

    // Password reset logic
    if (password && password.length >= 6) {
      member.password = await bcrypt.hash(password, 10);
    }

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
  const { userId = "" } = await req.json(); // Include userId of the requester

  try {
    await connectToDatabase();
    const member = await Member.findById(id);

    if (!member) {
      return new Response("Member not found", { status: 404 });
    }

    const requester = await Admin.findById(userId);
    const isSuperAdmin = requester?.email?.toLowerCase() === "tulaib@gmail.com";

    // Check if the user has permission to delete the member
    if (!isSuperAdmin && member?.createdBy?.toString() !== userId) {
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

export async function PATCH(req, { params }) {
  const { id } = params;
  const { payoutDetails, location, documents, city, country, nicNumber, nicImage } = await req.json();

  try {
    await connectToDatabase();
    const member = await Member.findById(id);
    if (!member) return new Response("Member not found", { status: 404 });

    if (payoutDetails) member.payoutDetails = payoutDetails;
    if (location) member.location = location;
    if (documents) member.documents = documents;
    if (city) member.city = city;
    if (country) member.country = country;
    if (nicNumber) member.nicNumber = nicNumber;
    if (nicImage) member.nicImage = nicImage;

    await member.save();
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    return new Response("Failed to update member: " + err, { status: 500 });
  }
}
