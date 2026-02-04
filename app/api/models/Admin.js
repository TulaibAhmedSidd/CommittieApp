import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },  // Field that distinguishes admin users
    isSuperAdmin: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export default Admin;
