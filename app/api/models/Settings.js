import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    activeTheme: { type: String, default: 'midnight' },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
export default Settings;
