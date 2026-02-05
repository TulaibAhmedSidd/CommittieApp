import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Notification from "@/app/api/models/Notification";
import Asset from "@/app/api/models/Asset";
import { createLog } from "@/app/utils/logger";

export async function POST(req, { params }) {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    try {
        const committee = await Committee.findById(id);
        if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

        let screenshotUrl = body.screenshot;

        // If screenshot is base64, save to Assets collection
        if (body.screenshot && body.screenshot.startsWith("data:image")) {
            const asset = new Asset({
                name: `payout_proof_m${body.month}_${body.memberId}`,
                data: body.screenshot,
                contentType: body.screenshot.match(/data:([^;]+);/)[1],
                uploadedBy: body.adminId,
                onModel: "Admin"
            });
            await asset.save();
            screenshotUrl = `/api/assets/${asset._id}`;
        }

        const payoutData = {
            month: body.month,
            member: body.memberId,
            amount: body.amount,
            transactionId: body.transactionId,
            screenshot: screenshotUrl,
            paidAt: new Date()
        };

        committee.payouts.push(payoutData);
        await committee.save();

        // Notify member
        const notification = new Notification({
            userId: body.memberId,
            message: `PAYOUT RECEIVED: ${committee.name} (Month ${body.month}). Info: ${body.transactionId}`,
            details: `Admin has recorded a payout of ${body.amount}. Check your dashboard for proof.`,
        });
        await notification.save();

        await createLog({
            action: "RECORD_PAYOUT",
            performedBy: body.adminId,
            onModel: "Admin",
            targetId: body.memberId,
            details: { committeeId: id, month: body.month, amount: body.amount }
        });

        return new Response(JSON.stringify({ message: "Payout recorded", screenshot: screenshotUrl }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
