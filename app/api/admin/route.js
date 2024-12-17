import bcrypt from 'bcryptjs';
import Admin from '../models/Admin'; // Path to your Admin model

export async function POST(req) {
  const { name, email, password } = await req.json();

  try {
    // Check if an admin with this email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new Response(JSON.stringify({ message: 'Admin already exists' }), { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();

    return new Response(JSON.stringify({ message: 'Admin created successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
