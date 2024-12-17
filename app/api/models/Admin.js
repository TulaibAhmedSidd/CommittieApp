import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },  // Field that distinguishes admin users
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export default Admin;
