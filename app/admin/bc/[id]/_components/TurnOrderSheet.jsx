"use client";

import { Sheet, Money, StatusBadge } from "../../../../ui";
import { W } from "../../../../utils/words";
import { payoutFor, monthLabel, beneficiaryFor } from "../../../../utils/bcRules";

export default function TurnOrderSheet({ open, onClose, c }) {
  const months = Array.from({ length: c.monthDuration }, (_, i) => i + 1);
  return (
    <Sheet open={open} onClose={onClose} title={W.turnOrder.en} urdu={W.turnOrder.ur}>
      <ol className="divide-y divide-line">
        {months.map((m) => {
          const b = beneficiaryFor(c, m);
          const name = b?.name || "—";
          const p = payoutFor(c, m);
          const current = c.stage === "running" && m === c.currentMonth;
          return (
            <li key={m} className={`flex min-h-[52px] items-center gap-3 py-2 ${current ? "font-bold" : ""}`}>
              <span className="w-20 shrink-0 text-sm text-ink-500">{monthLabel(c, m)}</span>
              <span className="min-w-0 flex-1 truncate text-ink-900">{name}</span>
              {p ? <Money value={p.amount} size="sm" className="text-success-700" /> : current ? <StatusBadge status="receiver" label="This month" /> : null}
            </li>
          );
        })}
      </ol>
    </Sheet>
  );
}
