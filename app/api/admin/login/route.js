import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "@/app/api/models/Admin";
import connectToDatabase from "@/app/utils/db";


export async function POST(req) {
  const { email, password } = await req.json();
  await connectToDatabase();

  try {
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

    return new Response(JSON.stringify({ token: token, data: admin }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error" + error }), {
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
