"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Sheet, Tabs, StatusBadge, Button } from "../../../../ui";
import { adminApi } from "../../../../utils/api";
import { whoMustPay, paymentFor, payoutFor, monthLabel, beneficiaryId } from "../../../../utils/bcRules";

/** Read past months; approve a late receipt or mark cash for an old month. */
export default function PastMonthsSheet({ open, onClose, c, onChanged }) {
  const past = Array.from({ length: Math.max(c.currentMonth - 1, 0) }, (_, i) => c.currentMonth - 1 - i);
  const [month, setMonth] = useState(past[0] || 1);
  const [busy, setBusy] = useState("");
  const receiver = c.members.find((m) => m._id === beneficiaryId(c, month));
  const payers = whoMustPay(c, month).map((id) => c.members.find((m) => m._id === id)).filter(Boolean);
  const payout = payoutFor(c, month);

  const act = async (memberId, action) => {
    setBusy(memberId + action);
    try {
      await adminApi.patch(`/api/committee/${c._id}/payment`, { action, memberId, month });
      toast.success("Saved.");
      onChanged();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Past months" urdu="پچھلے مہینے" size="lg">
      {past.length > 4 ? (
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="mb-4 min-h-[48px] w-full rounded-xl border border-line px-3" aria-label="Month">
          {past.map((m) => (
            <option key={m} value={m}>
              Month {m} · {monthLabel(c, m)}
            </option>
          ))}
        </select>
      ) : (
        <Tabs className="mb-4" value={month} onChange={setMonth} tabs={past.map((m) => ({ value: m, en: monthLabel(c, m) }))} />
      )}
      <p className="mb-3 text-sm text-ink-600">
        {receiver?.name || "—"} got the pot. {payout ? `Payout: Rs ${payout.amount.toLocaleString()} (${payout.method}).` : "No payout recorded."}
      </p>
      <ul className="divide-y divide-line">
        {payers.map((m) => {
          const p = paymentFor(c, month, m._id);
          const status = p?.status || "unpaid";
          return (
            <li key={m._id} className="flex min-h-[52px] flex-wrap items-center gap-2 py-2">
              <span className="min-w-0 flex-1 truncate font-medium text-ink-900">{m.name}</span>
              <StatusBadge status={status} />
              {status === "pending" && (
                <Button size="sm" onClick={() => act(m._id, "approve")} loading={busy === m._id + "approve"}>
                  Approve
                </Button>
              )}
              {(status === "unpaid" || status === "rejected") && (
                <Button size="sm" variant="secondary" onClick={() => act(m._id, "mark_cash")} loading={busy === m._id + "mark_cash"}>
                  Paid in cash
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}
