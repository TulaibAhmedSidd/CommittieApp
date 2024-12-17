import mongoose from 'mongoose';

const CommitteeSchema = new mongoose.Schema({
    name: String,
    description: String,
    maxMembers: Number,
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
        }
    ],
    status: { type: String, enum: ['open', 'full'], default: 'open' },
    result: [
        {
            member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
            position: Number,
        }
    ]
});

export default mongoose.models.Committee || mongoose.model('Committee', CommitteeSchema);
