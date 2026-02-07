import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Member from "@/app/api/models/Member";
import Admin from "@/app/api/models/Admin";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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
    return new Response(
      JSON.stringify({ error: "Failed to fetch members" + err }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, email, password, phone, referralCode, createdBy, createdByAdminName, city, county, location } = body;

    if (!name || !email || !password || !phone) {
      return new Response(JSON.stringify({ error: "Missing mandatory fields (name, email, password, phone)" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let referringAdminId = null;
    if (referralCode) {
      const parentAdmin = await Admin.findOne({ referralCode });
      if (parentAdmin) {
        referringAdminId = parentAdmin._id;
        // Increment admin's referral score
        parentAdmin.referralScore = (parentAdmin.referralScore || 0) + 1;
        await parentAdmin.save();
      }
    }

    const newMember = new Member({
      name,
      email,
      phone,
      password: hashedPassword,
      status: "approved",
      resetToken: "",
      referredBy: referringAdminId,
      organizers: referringAdminId ? [referringAdminId] : (createdBy ? [createdBy] : []),
      createdBy,
      createdByAdminName,
      city,
      county,
      location: location || { type: "Point", coordinates: [0, 0] }
    });
    await newMember.save();

    // Generate a reset token (you could use JWT or a random string)
    const resetToken = Math.random().toString(36).substring(2); // Simple example of generating a token

    // Create a reset URL (e.g., to a route in your app)
    const resetUrl = `https://committie-app.vercel.app/reset-password?token=${resetToken}`;

    // Store the reset token (in your database, for example)
    newMember.resetToken = resetToken;
    await newMember.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use another service like SendGrid
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${name},</p>
        <p>We have created your account. Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify(newMember), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to add member: " + err }),
      {
        status: 400,
      }
    );
  }
}

// export async function POST(req) {
//   try {
//     await connectToDatabase();
//     const { name, email, password } = await req.json();
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

//     const newMember = new Member({ name, email, password: hashedPassword });
//     await newMember.save();

//     return new Response(JSON.stringify(newMember), { status: 201 });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: "Failed to add member" + err }), {
//       status: 400,
//     });
//   }
// }

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
    return new Response(
      JSON.stringify({ error: "Failed to delete member" + err }),
      {
        status: 400,
      }
    );
  }
}
