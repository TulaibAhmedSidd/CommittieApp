import connectToDatabase from "@/app/utils/db";
import Committee from "@/app/api/models/Committee";
import Notification from "@/app/api/models/Notification";
import Asset from "@/app/api/models/Asset";
import { createLog } from "@/app/utils/logger";
import { unauthorizedResponse, verifyAdmin, verifyMember } from "@/app/utils/auth";

export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
    try {
        const auth = verifyMember(req);
        if (!auth.authorized) {
            return unauthorizedResponse(auth);
        }

        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();

        if (auth.user.userId !== body.memberId) {
            return new Response(JSON.stringify({ error: "Unauthorized payment submission" }), { status: 403 });
        }

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

        const targetMonth = Number(body.month);

        // Deduplicate: check if payment for this month and member already exists
        let existingPayment = committee.payments.find(p => 
            p.month === targetMonth && 
            (p.member?.toString() === body.memberId.toString() || p.member?._id?.toString() === body.memberId.toString())
        );

        if (existingPayment) {
            existingPayment.status = "pending";
            existingPayment.submission = {
                screenshot: screenshotUrl,
                description: body.description || "",
                transactionId: body.transactionId,
                submittedAt: new Date()
            };
            existingPayment.updatedAt = new Date();
        } else {
            committee.payments.push({
                month: targetMonth,
                member: body.memberId,
                status: "pending",
                submission: {
                    screenshot: screenshotUrl,
                    description: body.description || "",
                    transactionId: body.transactionId,
                    submittedAt: new Date()
                },
                updatedAt: new Date()
            });
        }

        await committee.save();

        await createLog({
            action: "SUBMIT_PAYMENT",
            performedBy: body.memberId,
            onModel: "Member",
            targetId: committee._id,
            details: { month: targetMonth, assetId: screenshotUrl && screenshotUrl.includes('/api/assets/') ? screenshotUrl.split('/').pop() : null }
        });

        return new Response(JSON.stringify({ message: "Payment submitted", screenshot: screenshotUrl }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const auth = verifyAdmin(req);
        if (!auth.authorized) {
            return unauthorizedResponse(auth);
        }

        await connectToDatabase();
        const { id } = await params;
        const { paymentId, status, memberId, reason, month } = await req.json();
        const adminId = auth.user.userId;

        const committee = await Committee.findById(id);
        if (!committee) return new Response(JSON.stringify({ error: "Committee not found" }), { status: 404 });

        const normalizedMemberId = (memberId?._id || memberId)?.toString();

        let payment = null;
        if (paymentId && paymentId !== "FORCE_RECONCILE") {
            payment = committee.payments.id(paymentId) || committee.payments.find(p => p._id?.toString() === paymentId?.toString());
        }

        if (!payment) {
            const targetMonth = month ? Number(month) : committee.currentMonth;
            payment = committee.payments.find(p => 
                Number(p.month) === targetMonth && 
                ((p.member?._id || p.member)?.toString() === normalizedMemberId)
            );

            if (!payment && status === "verified" && normalizedMemberId) {
                const forcePayment = {
                    month: targetMonth,
                    member: normalizedMemberId,
                    status: "verified",
                    updatedAt: new Date(),
                    submission: {
                        description: "Force verified by Admin (Manual Reconciliation)",
                        submittedAt: new Date()
                    }
                };
                committee.payments.push(forcePayment);
                payment = committee.payments[committee.payments.length - 1];
            }
        }

        if (payment) {
            payment.status = status;
            payment.updatedAt = new Date();
            if (reason && payment.submission) {
                payment.submission.description = payment.submission.description 
                    ? `${payment.submission.description} [Admin Note: ${reason}]`
                    : `[Admin Note: ${reason}]`;
            }

            const memberStr = (payment.member?._id || payment.member)?.toString();
            committee.payments.forEach(p => {
                const pMemberStr = (p.member?._id || p.member)?.toString();
                if (
                    Number(p.month) === Number(payment.month) &&
                    pMemberStr && memberStr && pMemberStr === memberStr
                ) {
                    p.status = status;
                    p.updatedAt = new Date();
                }
            });
        }

        if (!payment) return new Response(JSON.stringify({ error: "Payment reconciliation failed" }), { status: 400 });

        await committee.save();

        const notificationMessage = status === 'rejected' && reason
            ? `Your payment for ${committee.name} (Month ${payment.month}) was flagged/rejected. Reason: ${reason}`
            : `Your payment status for ${committee.name} (Month ${payment.month}) has been set to ${status}.`;

        const recipientId = (payment.member?._id || payment.member);
        if (recipientId) {
            const notification = new Notification({
                userId: recipientId,
                recipient: recipientId,
                recipientModel: 'Member',
                message: notificationMessage,
                details: `Admin Action: ${status === 'verified' ? 'Approved / Verified' : status} ${reason ? '(' + reason + ')' : ''}`,
            });
            await notification.save();
        }

        await createLog({
            action: "VERIFY_PAYMENT",
            performedBy: adminId,
            onModel: "Admin",
            targetId: payment.member,
            details: { committeeId: id, status, month: payment.month, reason: reason || null, isForced: !paymentId || paymentId === "FORCE_RECONCILE" }
        });

        return new Response(JSON.stringify({ message: "Status updated" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
