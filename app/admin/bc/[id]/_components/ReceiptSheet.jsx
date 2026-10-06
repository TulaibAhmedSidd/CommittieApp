"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Sheet, Button, SecureImage, Field, Money } from "../../../../ui";
import { W } from "../../../../utils/words";
import { adminApi } from "../../../../utils/api";
import { paymentFor, monthLabel } from "../../../../utils/bcRules";

/** Look at a member's receipt and approve it or send it back. */
export default function ReceiptSheet({ member, onClose, c, month, onDone }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState("");
  useEffect(() => {
    setRejecting(false);
    setReason("");
  }, [member]);

  if (!member) return null;
  const p = paymentFor(c, month, member._id);
  const s = p?.submission || {};

  const act = async (action) => {
    setBusy(action);
    try {
      await adminApi.patch(`/api/committee/${c._id}/payment`, { action, memberId: member._id, month, reason });
      toast.success(action === "approve" ? `${member.name}'s payment approved.` : "Receipt sent back. They will be told why.");
      onClose();
      onDone();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <Sheet
      open={!!member}
      onClose={onClose}
      title={`${member.name}'s receipt`}
      urdu={W.receipt.ur}
      footer={
        rejecting ? (
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setRejecting(false)}>
              Back
            </Button>
            <Button variant="dangerSolid" full disabled={!reason.trim()} loading={busy === "reject"} onClick={() => act("reject")}>
              Send back
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="danger" full onClick={() => setRejecting(true)}>
              Not correct
            </Button>
            <Button full loading={busy === "approve"} onClick={() => act("approve")}>
              {W.approve.en}
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-3">
        <p className="text-[15px] text-ink-700">
          {monthLabel(c, month)} · should be <Money value={c.monthlyAmount} />
        </p>
        {s.screenshot ? (
          <a href="#" onClick={(e) => e.preventDefault()} className="block overflow-hidden rounded-xl border border-line bg-surface-100">
            <SecureImage src={s.screenshot} scope="admin" alt="Payment receipt" className="max-h-[50vh] w-full" />
          </a>
        ) : (
          <p className="rounded-lg bg-surface-100 p-4 text-sm text-ink-500">No photo was attached.</p>
        )}
        {s.transactionId && (
          <p className="text-sm text-ink-700">
            Reference: <b className="font-mono">{s.transactionId}</b>
          </p>
        )}
        {s.description && <p className="text-sm text-ink-700">Note: {s.description}</p>}
        {rejecting && <Field label="What is wrong?" urdu="کیا مسئلہ ہے؟" placeholder="e.g. Amount is less, photo is not clear" value={reason} onChange={(e) => setReason(e.target.value)} autoFocus />}
      </div>
    </Sheet>
  );
}
