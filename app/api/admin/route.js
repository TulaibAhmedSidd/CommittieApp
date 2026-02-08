import connectToDatabase from '@/app/utils/db';
import bcrypt from 'bcryptjs';
import Admin from '@/app/api/models/Admin';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    console.log("Admin Registration: Connecting to database...");
    await connectToDatabase();

    const body = await req.json();
    console.log("Admin Registration: Received body:", { ...body, password: '[REDACTED]' });
    const { name, email, password, phone, createdBy, city, county, location } = body;

    if (!name || !email || !password || !phone) {
      return new Response(JSON.stringify({ message: 'Missing mandatory fields (name, email, password, phone)' }), { status: 400 });
    }

    const existingAdmin = await Admin.findOne({ email });
    console.log("Admin Registration: Existing admin check:", existingAdmin ? "Exists" : "New");

    if (existingAdmin) {
      return new Response(JSON.stringify({ message: 'Admin already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Admin Registration: Password hashed");

    const adminData = {
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      county,
      location: location || { type: "Point", coordinates: [0, 0] },
      isAdmin: true,
      status: createdBy ? 'approved' : 'pending'
    };

    if (createdBy) adminData.createdBy = createdBy;

    const newAdmin = new Admin(adminData);
    console.log("Admin Registration: Saving new admin...");
    await newAdmin.save();
    console.log("Admin Registration: Saved successfully");

    return new Response(JSON.stringify({ message: 'Admin created successfully' }), { status: 201 });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), { status: 500 });
  }
}
