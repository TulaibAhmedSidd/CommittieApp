"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiChevronDown } from "react-icons/fi";
import { Page, Card, Field, TextArea, Button, Money, Bi } from "../../ui";
import { W } from "../../utils/words";
import { adminApi } from "../../utils/api";
import { plannedPot } from "../../utils/bcRules";

const DOCS = ["NIC Front", "NIC Back", "Electricity Bill", "Gas Bill", "Water Bill", "Work ID"];

function nextMonthValue() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthName(value, add = 0) {
  if (!value) return "";
  const [y, m] = value.split("-").map(Number);
  return new Date(y, m - 1 + add, 1).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function CreateBcPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", maxMembers: "10", monthlyAmount: "", startDate: nextMonthValue(), description: "", accountTitle: "", bankName: "", iban: "" });
  const [docs, setDocs] = useState([]);
  const [more, setMore] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const members = Math.round(Number(form.maxMembers)) || 0;
  const amount = Math.round(Number(form.monthlyAmount)) || 0;
  const pot = plannedPot(amount, members);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please give the BC a name.";
    if (!(members >= 2 && members <= 60)) e.maxMembers = "Between 2 and 60 members.";
    if (!(amount >= 100)) e.monthlyAmount = "At least Rs 100.";
    if (!form.startDate) e.startDate = "Choose the start month.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const { committee } = await adminApi.post("/api/committee", {
        name: form.name,
        maxMembers: members,
        monthlyAmount: amount,
        startDate: form.startDate,
        description: form.description,
        bankDetails: { accountTitle: form.accountTitle, bankName: form.bankName, iban: form.iban },
        requireDocuments: docs.length > 0,
        mandatoryDocuments: docs,
      });
      toast.success("BC created. Now add members.");
      router.replace(`/admin/bc/${committee._id}?new=1`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page title={W.createBc.en} urdu={W.createBc.ur} back="/admin">
      <form onSubmit={submit} className="space-y-5">
        <Card padding="p-5" className="space-y-4">
          <Field label={W.bcName.en} urdu={W.bcName.ur} placeholder="e.g. Family BC 2027" value={form.name} onChange={set("name")} error={errors.name} maxLength={60} />
          <div className="grid grid-cols-2 gap-3">
            <Field label={W.howManyMembers.en} urdu={W.howManyMembers.ur} type="number" inputMode="numeric" min={2} max={60} value={form.maxMembers} onChange={set("maxMembers")} error={errors.maxMembers} />
            <Field label={W.monthlyAmount.en} urdu={W.monthlyAmount.ur} type="number" inputMode="numeric" min={100} step={100} placeholder="10000" prefix="Rs" value={form.monthlyAmount} onChange={set("monthlyAmount")} error={errors.monthlyAmount} />
          </div>
          <Field label={W.startMonth.en} urdu={W.startMonth.ur} type="month" value={form.startDate} onChange={set("startDate")} error={errors.startDate} />
        </Card>

        {members >= 2 && amount >= 100 && (
          <Card padding="p-5" className="border-primary-100 bg-primary-50">
            <p className="text-sm font-semibold text-primary-800">
              <Bi en="Summary" ur="خلاصہ" />
            </p>
            <ul className="mt-2 space-y-1.5 text-[15px] text-ink-800">
              <li>
                <b>{members} members</b>, <b>{members} months</b> ({monthName(form.startDate)} – {monthName(form.startDate, members - 1)})
              </li>
              <li>
                Each person pays <Money value={amount} /> a month
              </li>
              <li>
                Each month one person gets <Money value={pot} className="text-primary-800" />
              </li>
              <li className="text-sm text-ink-600">The person whose turn it is does not pay that month.</li>
            </ul>
          </Card>
        )}

        <button type="button" onClick={() => setMore(!more)} className="flex min-h-[44px] items-center gap-2 font-semibold text-primary-700" aria-expanded={more}>
          <FiChevronDown className={`h-5 w-5 transition-transform ${more ? "rotate-180" : ""}`} aria-hidden />
          <Bi en="More options" ur="مزید" />
          <span className="text-sm font-normal text-ink-500">(bank account, notes, documents)</span>
        </button>

        {more && (
          <Card padding="p-5" className="space-y-4">
            <p className="text-sm font-semibold text-ink-700">Where members send money</p>
            <Field label="Account title" value={form.accountTitle} onChange={set("accountTitle")} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Bank / JazzCash / Easypaisa" value={form.bankName} onChange={set("bankName")} />
              <Field label="Account number or IBAN" value={form.iban} onChange={set("iban")} />
            </div>
            <TextArea label="Notes for members" placeholder="Pay before the 10th of every month." value={form.description} onChange={set("description")} maxLength={500} />
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-ink-800">Documents members must upload to join (optional)</legend>
              <div className="grid grid-cols-2 gap-2">
                {DOCS.map((d) => (
                  <label key={d} className="flex min-h-[44px] items-center gap-2 rounded-lg border border-line px-3 text-sm">
                    <input type="checkbox" className="h-5 w-5 accent-primary-600" checked={docs.includes(d)} onChange={(e) => setDocs(e.target.checked ? [...docs, d] : docs.filter((x) => x !== d))} />
                    {d}
                  </label>
                ))}
              </div>
            </fieldset>
          </Card>
        )}

        <Button type="submit" size="lg" full loading={saving}>
          <Bi {...W.createBc} />
        </Button>
      </form>
    </Page>
  );
}
