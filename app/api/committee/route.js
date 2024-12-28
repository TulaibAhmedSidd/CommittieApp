import connectToDatabase from '../../utils/db';
import Committee from '../models/Committee';
import Member from '../models/Member';

// Handle GET requests (fetch all committees)
export async function GET() {
    await connectToDatabase();

    try {
        const committees = await Committee.find().populate({
            path: 'members', // Field name in your Committee schema
            model: 'Member', // Model name that is referenced
        })
        .populate({
            path: 'result.member', // Populating the `member` inside the `result` array
            model: 'Member',
        });
        return new Response(JSON.stringify(committees), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch committees =>' ,err}), { status: 500 });
    }
}

// Handle POST requests (create a new committee)
export async function POST(req) {
    await connectToDatabase();

    try {
        const body = await req.json();
        const { name, description, maxMembers } = body;

        const newCommittee = new Committee({ name, description, maxMembers });
        await newCommittee.save();

        return new Response(JSON.stringify(newCommittee), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to create committee'+ err  }), { status: 400 });
    }
}

// Handle PATCH requests (update a committee)
export async function PATCH(req) {
    await connectToDatabase();

    try {
        const body = await req.json();
        const { id, name, description, maxMembers, status } = body;

        const updatedCommittee = await Committee.findByIdAndUpdate(
            id,
            { name, description, maxMembers, status },
            { new: true }
        );

        if (!updatedCommittee) {
            return new Response(JSON.stringify({ error: 'Committee not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedCommittee), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to update committee'+ err  }), { status: 400 });
    }
}

// Handle DELETE requests (delete a committee)
export async function DELETE(req) {
    await connectToDatabase();

    try {
        const body = await req.json();
        const { id } = body;

        const deletedCommittee = await Committee.findByIdAndDelete(id);

        if (!deletedCommittee) {
            return new Response(JSON.stringify({ error: 'Committee not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Committee deleted successfully' }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to delete committee' + err }), { status: 400 });
    }
}
