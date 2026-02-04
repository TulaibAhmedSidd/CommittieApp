import connectToDatabase from "./db";
import Log from "../api/models/Log";

export async function createLog({ action, performedBy, onModel, details, targetId }) {
    await connectToDatabase();
    try {
        const log = new Log({
            action,
            performedBy,
            onModel,
            details,
            targetId,
        });
        await log.save();
        return log;
    } catch (error) {
        console.error("Failed to create log:", error);
    }
}
