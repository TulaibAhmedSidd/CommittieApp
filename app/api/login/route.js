import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Member from "../models/Member";
import connectToDatabase from "../../utils/db"; // Create a utility to connect to your DB

connectToDatabase();

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { email, password } = req.body;

//     try {
//       const member = await Member.findOne({ email });

//       if (!member) {
//         return res.status(400).json({ message: "Invalid email or password" });
//       }

//       const isMatch = await bcrypt.compare(password, member.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "Invalid email or password" });
//       }

//       // Create JWT token
//       const token = jwt.sign(
//         { userId: member._id, email: member.email },
//         process.env.JWT_SECRET, // Define this in .env
//         { expiresIn: "1h" }
//       );

//       res.status(200).json({ token });
//     } catch (error) {
//       res.status(500).json({ message: "Server error" });
//     }
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }

// Connect to the database once when the function is invoked
connectToDatabase();

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Retrieve the data from the request body

    // Find the member by email
    const member = await Member.findOne({ email });

    if (!member) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 400 }
      );
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 400 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: member._id, email: member.email },
      process.env.JWT_SECRET, // Use JWT_SECRET from your .env file
      { expiresIn: "1h" }
    );

    // Return the token
    return new Response(JSON.stringify({ token: token, member: member }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error, " + error }), {
      status: 500,
    });
  }
}
