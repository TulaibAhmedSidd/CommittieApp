import connectToDatabase from "../../../../utils/db";
import Committee from "../../../models/Committee";
import Notification from "../../../models/Notification";
import Asset from "../../../models/Asset";
import { createLog } from "../../../../utils/logger";

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
                name: `payment_proof_m${body.month}_${body.memberId}`,
                data: body.screenshot,
                contentType: body.screenshot.match(/data:([^;]+);/)[1],
                uploadedBy: body.memberId,
                onModel: "Member"
            });
            await asset.save();
            screenshotUrl = `/api/assets/${asset._id}`;
        }

        const paymentData = {
            month: body.month,
            member: body.memberId,
            status: "pending",
            submission: {
                screenshot: screenshotUrl,
                description: body.description,
                transactionId: body.transactionId,
                submittedAt: new Date()
            }
        };

        committee.payments.push(paymentData);
        await committee.save();

        await createLog({
            action: "SUBMIT_PAYMENT",
            performedBy: body.memberId,
            onModel: "Member",
            targetId: committee._id,
            details: { month: body.month, assetId: screenshotUrl.includes('/api/assets/') ? screenshotUrl.split('/').pop() : null }
        });

        return new Response(JSON.stringify({ message: "Payment submitted", screenshot: screenshotUrl }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    await connectToDatabase();
    const { id } = await params;
    const { paymentId, status, adminId } = await req.json();

    try {
        const committee = await Committee.findById(id);
        const payment = committee.payments.id(paymentId);

        if (!payment) return new Response(JSON.stringify({ error: "Payment not found" }), { status: 404 });

        payment.status = status;
        payment.updatedAt = new Date();
        await committee.save();

        // Notify member
        const notification = new Notification({
            userId: payment.member,
            message: `Your payment for ${committee.name} (Month ${payment.month}) has been ${status}.`,
            details: `Status Update: ${status}`,
        });
        await notification.save();

        await createLog({
            action: "VERIFY_PAYMENT",
            performedBy: adminId,
            onModel: "Admin",
            targetId: payment.member,
            details: { committeeId: id, status, month: payment.month }
        });

        return new Response(JSON.stringify({ message: "Status updated" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
