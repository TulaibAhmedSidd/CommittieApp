import Member from '../../models/Member'; // Ensure correct path to your Member model

// Handle Update (PUT)
export async function PUT(req, { params }) {
  const { id } = params; // Get member ID from URL
  const { name, email } = await req.json();

  try {
    const member = await Member.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );
    if (!member) return new Response('Member not found', { status: 404 });
    return new Response(JSON.stringify(member), { status: 200 });
  } catch (err) {
    return new Response('Failed to update member', { status: 500 });
  }
}

// Handle Delete (DELETE)
export async function DELETE(req, { params }) {
  const { id } = params; // Get member ID from URL

  try {
    const member = await Member.findByIdAndDelete(id);
    if (!member) return new Response('Member not found', { status: 404 });
    return new Response('Member deleted successfully', { status: 200 });
  } catch (err) {
    return new Response('Failed to delete member', { status: 500 });
  }
}
