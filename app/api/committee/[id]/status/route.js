import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Notification from "@/app/api/models/Notification";
import { createLog } from "@/app/utils/logger";

export async function PATCH(req, { params }) {
    await connectToDatabase();
    const { id } = await params;
    const { action, adminId } = await req.json();

    try {
        const committee = await Committee.findById(id).populate("members");
        if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

        if (action === "advance_month") {
            // Logic: All members must have 'verified' status for the currentMonth
            // EXCEPT for the member whose turn it is in the currentMonth.

            const currentTurn = committee.result.find(r => r.position === committee.currentMonth);
            const beneficiaryId = currentTurn?.member?.toString();

            const pendingPayments = committee.members.filter(member => {
                // Skip the beneficiary
                if (member._id.toString() === beneficiaryId) return false;

                // Find payment for this member for current month
                const payment = committee.payments.find(p =>
                    p.month === committee.currentMonth &&
                    (p.member.toString() === member._id.toString())
                );

                return payment?.status !== "verified";
            });

            if (pendingPayments.length > 0) {
                const names = pendingPayments.map(m => m.name).join(", ");
                return new Response(JSON.stringify({
                    error: `Advance blocked. Missing verified payments from: ${names}`
                }), { status: 400 });
            }

            committee.currentMonth += 1;

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
