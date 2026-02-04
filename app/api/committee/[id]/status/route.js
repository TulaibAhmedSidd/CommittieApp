import connectToDatabase from "../../../../utils/db";
import Committee from "../../../models/Committee";
import Notification from "../../../models/Notification";
import { createLog } from "../../../../utils/logger";

export async function PATCH(req, { params }) {
    await connectToDatabase();
    const { id } = await params;
    const { action, adminId } = await req.json();

    try {
        const committee = await Committee.findById(id).populate("members");
        if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

        if (action === "advance_month") {
            committee.currentMonth += 1;

            // Notify turn member
            const turnMember = committee.result.find(r => r.position === committee.currentMonth);
            if (turnMember) {
                const notification = new Notification({
                    userId: turnMember.member,
                    message: `Congratulations! It is your turn to receive the payout for ${committee.name} (Month ${committee.currentMonth}).`,
                    details: "Payout Alert",
                });
                await notification.save();
            }

            await committee.save();
            await createLog({
                action: "ADVANCE_MONTH",
                performedBy: adminId,
                onModel: "Admin",
                targetId: committee._id,
                details: { newMonth: committee.currentMonth }
            });
        } else if (action === "close_bc") {
            committee.status = "finished";
            await committee.save();
            await createLog({
                action: "CLOSE_COMMITTEE",
                performedBy: adminId,
                onModel: "Admin",
                targetId: committee._id,
                details: { status: "finished" }
            });
        }

        return new Response(JSON.stringify({ message: "Action successful" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
