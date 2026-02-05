import bcrypt from 'bcryptjs';
import Member from '@/app/api/models/Member';
import connectToDatabase from '@/app/utils/db';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { token, password } = await req.json();

    // Find the member by the reset token
    const member = await Member.findOne({ resetToken: token });
    console.log("member found:", member)
    if (!member) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the member's password
    member.password = hashedPassword;
    member.resetToken = null; // Clear the reset token
    await member.save();

    return new Response(JSON.stringify({ message: 'Password successfully reset' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error resetting password' }), { status: 500 });
  }
}
