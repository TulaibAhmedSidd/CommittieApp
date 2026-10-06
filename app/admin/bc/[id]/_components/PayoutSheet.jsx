"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Sheet, Button, Field, Tabs, PhotoPicker, Money } from "../../../../ui";
import { W } from "../../../../utils/words";
import { adminApi } from "../../../../utils/api";

/** Record that this month's pot was given (cash or transfer). */
export default function PayoutSheet({ open, onClose, c, receiver, pot, onDone }) {
  const [method, setMethod] = useState("cash");
  const [amount, setAmount] = useState(String(pot));
  const [ref, setRef] = useState("");
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMethod("cash");
      setAmount(String(pot));
      setRef("");
      setPhoto("");
    }
  }, [open, pot]);

  if (!receiver) return null;
  const pd = receiver.payoutDetails || {};

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.post(`/api/committee/${c._id}/payout`, { method, amount: Number(amount), transactionId: ref, screenshot: photo || undefined });
      toast.success(`Payout to ${receiver.name} recorded.`);
      onClose();
      onDone();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Give payout to ${receiver.name}`}
      urdu={W.givePayout.ur}
      footer={
        <Button full size="lg" loading={saving} onClick={save}>
          I have given <Money value={amount} />
        </Button>
      }
    >
      <div className="space-y-4">
        <Tabs
          value={method}
          onChange={setMethod}
          tabs={[
            { value: "cash", en: "Cash", ur: "نقد" },
            { value: "online", en: "Bank / mobile", ur: "بینک / موبائل" },
          ]}
        />
        {method === "online" && (
          <div className="rounded-xl bg-surface-100 p-3 text-sm">
            <p className="font-semibold text-ink-800">{receiver.name}'s account</p>
            {pd.iban || pd.bankName ? (
              <p className="mt-1 text-ink-700">
                {pd.accountTitle} · {pd.bankName}
                <br />
                <span className="font-mono">{pd.iban}</span>
              </p>
            ) : (
              <p className="mt-1 text-ink-500">They have not added an account. Ask them for it.</p>
            )}
          </div>
        )}
        <Field label="Amount given" type="number" inputMode="numeric" prefix="Rs" value={amount} onChange={(e) => setAmount(e.target.value)} />
        {method === "online" && (
          <>
            <Field label="Transaction ID (optional)" value={ref} onChange={(e) => setRef(e.target.value)} />
            <PhotoPicker label="Receipt photo (optional)" value={photo} onChange={setPhoto} scope="admin" />
          </>
        )}
      </div>
    </Sheet>
  );
}
