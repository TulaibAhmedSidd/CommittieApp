import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "@/app/api/models/Admin";
import connectToDatabase from "@/app/utils/db";


export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return new Response(JSON.stringify({ message: "Invalid input format" }), { status: 400 });
    }
    await connectToDatabase();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 400 }
      );
    }

    if (admin.status === "pending") {
      return new Response(
        JSON.stringify({ message: "Registration pending Super Admin approval." }),
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 400 }
      );
    }

    // Create JWT token for admin
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, isAdmin: true, isSuperAdmin: admin.isSuperAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const adminObj = admin.toObject();
    delete adminObj.password;

    return new Response(JSON.stringify({ token: token, data: adminObj }), {
      status: 200,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return new Response(JSON.stringify({ message: "Server error. Please try again later." }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  return new Response(
    JSON.stringify({ message: "GET method not allowed" + req }),
    { status: 405 }
  );
}
