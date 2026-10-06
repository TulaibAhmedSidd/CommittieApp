"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Sheet, Field, TextArea, Button } from "../../../../ui";
import { adminApi } from "../../../../utils/api";

const toMonthValue = (d) => {
  if (!d) return "";
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
};

/** Edit BC details. Amount / members / start month only before the BC starts. */
export default function EditSheet({ open, onClose, c, onSaved }) {
  const upcoming = c.stage === "upcoming";
  const [f, setF] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setF({
      name: c.name,
      description: c.description || "",
      maxMembers: String(c.maxMembers),
      monthlyAmount: String(c.monthlyAmount),
      startDate: toMonthValue(c.startDate),
      accountTitle: c.bankDetails?.accountTitle || "",
      bankName: c.bankDetails?.bankName || "",
      iban: c.bankDetails?.iban || "",
    });
  }, [open, c]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        id: c._id,
        name: f.name,
        description: f.description,
        bankDetails: { accountTitle: f.accountTitle, bankName: f.bankName, iban: f.iban },
      };
      if (upcoming) Object.assign(body, { maxMembers: Number(f.maxMembers), monthlyAmount: Number(f.monthlyAmount), startDate: f.startDate });
      await adminApi.patch("/api/committee", body);
      toast.success("Saved.");
      onClose();
      onSaved();
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
      title="Edit details"
      urdu="تفصیل بدلیں"
      footer={
        <Button full size="lg" loading={saving} onClick={save}>
          Save
        </Button>
      }
    >
      <div className="space-y-4">
        <Field label="BC name" value={f.name || ""} onChange={set("name")} />
        {upcoming ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Members" type="number" inputMode="numeric" value={f.maxMembers || ""} onChange={set("maxMembers")} />
              <Field label="Monthly amount" type="number" inputMode="numeric" prefix="Rs" value={f.monthlyAmount || ""} onChange={set("monthlyAmount")} />
            </div>
            <Field label="Start month" type="month" value={f.startDate || ""} onChange={set("startDate")} />
          </>
        ) : (
          <p className="rounded-lg bg-surface-100 px-3 py-2 text-sm text-ink-600">Amount, members and start month can't change after the BC has started.</p>
        )}
        <TextArea label="Notes for members" value={f.description || ""} onChange={set("description")} />
        <p className="pt-2 text-sm font-semibold text-ink-700">Where members send money</p>
        <Field label="Account title" value={f.accountTitle || ""} onChange={set("accountTitle")} />
        <Field label="Bank / JazzCash / Easypaisa" value={f.bankName || ""} onChange={set("bankName")} />
        <Field label="Account number or IBAN" value={f.iban || ""} onChange={set("iban")} />
      </div>
    </Sheet>
  );
}
