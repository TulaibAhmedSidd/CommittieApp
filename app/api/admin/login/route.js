import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin';
import connectToDatabase from '../../../utils/db';

connectToDatabase();

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 400 });
    }

    // Create JWT token for admin
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

export async function GET(req) {
  return new Response(JSON.stringify({ message: "GET method not allowed" }), { status: 405 });
}
