"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiCopy } from "react-icons/fi";
import { Sheet, Button, Field, PhotoPicker, Money, Bi } from "../../../../ui";
import { W } from "../../../../utils/words";
import { memberApi } from "../../../../utils/api";
import { monthLabel } from "../../../../utils/bcRules";

/** Two steps: 1) where to send the money, 2) receipt photo. */
export default function PaySheet({ open, month, onClose, c, onPaid }) {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState("");
  const [ref, setRef] = useState("");
  const [saving, setSaving] = useState(false);
  const bank = c.bankDetails || {};
  const hasBank = bank.iban || bank.bankName;

  useEffect(() => {
    if (open) {
      setStep(hasBank ? 1 : 2);
      setPhoto("");
      setRef("");
    }
  }, [open, hasBank]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      window.prompt("Copy:", text);
    }
  };

  const send = async () => {
    if (!photo) {
      toast.error("Please add a photo of your receipt.");
      return;
    }
    setSaving(true);
    try {
      await memberApi.post(`/api/committee/${c._id}/payment`, { month, screenshot: photo, transactionId: ref });
      toast.success("Receipt sent. The organizer will check it.");
      onClose();
      onPaid();
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
      title={`Pay for ${month ? monthLabel(c, month) : ""}`}
      urdu={W.pay.ur}
      footer={
        step === 1 ? (
          <Button full size="lg" onClick={() => setStep(2)}>
            I have sent the money
          </Button>
        ) : (
          <Button full size="lg" loading={saving} onClick={send}>
            Send receipt
          </Button>
        )
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-primary-50 px-4 py-3 text-center">
          <p className="text-sm text-primary-800">Amount</p>
          <Money value={c.monthlyAmount} size="xl" className="text-ink-900" />
        </div>

        {step === 1 ? (
          <>
            <p className="text-[15px] font-semibold text-ink-800">
              <Bi en="Send to this account" ur="اس اکاؤنٹ میں بھیجیں" />
            </p>
            <div className="divide-y divide-line rounded-xl border border-line">
              {[
                ["Name", bank.accountTitle],
                ["Bank / wallet", bank.bankName],
                ["Account / IBAN", bank.iban],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-ink-500">{k}</p>
                      <p className="break-all font-semibold text-ink-900">{v}</p>
                    </div>
                    <button type="button" onClick={() => copy(v)} aria-label={`Copy ${k}`} className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 hover:bg-surface-100">
                      <FiCopy className="h-5 w-5" />
                    </button>
                  </div>
                ))}
            </div>
            <p className="text-sm text-ink-500">Paying in cash? Give it to the organizer. They will mark it as paid.</p>
          </>
        ) : (
          <>
            <PhotoPicker label="Photo of your receipt" urdu="رسید کی تصویر" value={photo} onChange={setPhoto} scope="member" />
            <Field label="Transaction ID (optional)" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="From the SMS or app" />
            {hasBank && (
              <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-primary-700">
                See account details again
              </button>
            )}
          </>
        )}
      </div>
    </Sheet>
  );
}
