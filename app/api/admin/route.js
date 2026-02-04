import bcrypt from 'bcryptjs';
import Admin from '../models/Admin'; // Path to your Admin model

export async function POST(req) {
  try {
    const { name, email, password, createdBy } = await req.json();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new Response(JSON.stringify({ message: 'Admin already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      status: createdBy ? 'approved' : 'pending',
      createdBy,
    });

    await newAdmin.save();
    return new Response(JSON.stringify({ message: 'Admin created successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
