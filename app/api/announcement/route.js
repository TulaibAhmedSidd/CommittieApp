import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Notification from "@/app/api/models/Notification";
import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Parse request
//     const { committeeId } = await req.json();

//     // Fetch the committee and populate members
//     const committee = await Committee.findById(committeeId).populate("members");

//     if (!committee) {
//       return new Response(JSON.stringify({ error: "Committee not found" }), {
//         status: 404,
//       });
//     }

//     // Check if results are already announced
//     if (committee.result && committee.result.length > 0) {
//       return new Response(
//         JSON.stringify({
//           error: "Results have already been announced for this committee.",
//         }),
//         { status: 400 }
//       );
//     }

//     // Validate if members are full
//     if (committee.members.length < committee.maxMembers) {
//       return new Response(
//         JSON.stringify({
//           error: `Cannot announce results: ${committee.members.length}/${committee.maxMembers} members registered.`,
//         }),
//         { status: 400 }
//       );
//     }

//     // Randomize and assign positions
//     const approvedMembers = committee.members.filter(
//       (member) => member.status === "approved"
//     );

//     if (approvedMembers.length < committee.maxMembers) {
//       return new Response(
//         JSON.stringify({
//           error: "Cannot announce results: Not all members are approved.",
//         }),
//         { status: 400 }
//       );
//     }

//     const randomizedResults = approvedMembers
//       .map((member) => ({ member, sort: Math.random() }))
//       .sort((a, b) => a.sort - b.sort)
//       .map((entry, index) => ({
//         member: entry.member._id,
//         position: index + 1,
//       }));

//     // Save results to the committee
//     committee.result = randomizedResults;
//     await committee.save();

//     // Populate results with member names
//     await committee.populate({
//       path: "result.member",
//       select: "name email",
//     });

//     const resultsWithNames = committee.result.map((entry) => ({
//       memberId: entry.member._id,
//       name: entry.member.name,
//       email: entry.member.email,
//       position: entry.position,
//     }));

//     return new Response(
//       JSON.stringify({
//         message: "Results announced successfully",
//         result: resultsWithNames,
//       }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Error announcing results:", err);
//     return new Response(
//       JSON.stringify({
//         error: "Failed to announce results"+ err ,
//         details: err.message,
//       }),
//       { status: 500 }
//     );
//   }
// }
export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse request
    const { committeeId } = await req.json();

    // Fetch the committee and populate members
    const committee = await Committee.findById(committeeId).populate("members");

    if (!committee) {
      return new Response(JSON.stringify({ error: "Committee not found" }), {
        status: 404,
      });
    }

    // Check if results are already announced
    if (committee.result && committee.result.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Results have already been announced for this committee.",
        }),
        { status: 400 }
      );
    }

    // Validate if members are full
    if (committee.members.length < committee.maxMembers) {
      return new Response(
        JSON.stringify({
          error: `Cannot announce results: ${committee.members.length}/${committee.maxMembers} members registered.`,
        }),
        { status: 400 }
      );
    }

    // Randomize and assign positions
    const approvedMembers = committee.members;

    if (
      approvedMembers.length != committee.maxMembers ||
      approvedMembers.length < committee.maxMembers
    ) {
      return new Response(
        JSON.stringify({
          error: "Cannot announce results: Not all members are approved.",
        }),
        { status: 400 }
      );
    }
    const currentDate = new Date();
    const randomizedResults = approvedMembers
      .map((member) => ({ member, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry, index) => ({
        member: entry.member._id,
        position: index + 1,
        // announcementDate: currentDate.toISOString(),
      }));

    // console.log("randomizedResults", randomizedResults);
    // Save results to the committee
    committee.result = randomizedResults;
    committee.announcementDate = currentDate.toISOString();
    await committee.save();

    // Populate results with member names
    await committee.populate({
      path: "result.member",
      // select: "name email",
    });

    const resultsWithNames = committee.result.map((entry) => ({
      member: {
        memberId: entry.member._id,
        name: entry.member.name,
        email: entry.member.email,
        position: entry.position,
      },
      position: entry.position,
    }));

    // Email and Notification Logic
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    for (const entry of resultsWithNames) {
      const emailContent = `
        <p>Dear ${entry?.member?.name},</p>
        <p>Congratulations! You have been assigned position ${entry?.member?.position} in the committee <strong>${committee.name}</strong>.</p>
        <p>Thank you for your participation!</p>
      `;

      // Send email
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: entry?.member?.email,
        subject: `Committee Results for ${committee.name}`,
        html: emailContent,
      });

      // Save notification
      const notification = new Notification({
        userId: entry?.member?.memberId,
        message: `Congratulations! You have been assigned position ${entry?.member?.position} in the committee ${committee.name}.`,
        isRead: false,
      });

      await notification.save();
    }

    return new Response(
      JSON.stringify({
        message: "Results announced successfully",
        result: resultsWithNames,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error announcing results:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to announce results" + err,
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
