"use client";

import { FiCheckCircle } from "react-icons/fi";
import { Card, Section, Money, StatusBadge, Bi } from "../../../../ui";
import { payoutFor, beneficiaryFor, monthLabel } from "../../../../utils/bcRules";

export default function FinishedView({ c }) {
  const total = c.payouts.reduce((a, p) => a + (p.amount || 0), 0);
  const months = Array.from({ length: c.monthDuration }, (_, i) => i + 1);
  return (
    <>
      <Card padding="p-5" className="flex items-center gap-4">
        <FiCheckCircle className="h-10 w-10 shrink-0 text-primary-600" aria-hidden />
        <div>
          <p className="text-lg font-bold text-ink-900">{c.endedEarly ? "This BC was ended early" : "This BC is complete"}</p>
          <p className="text-sm text-ink-600">
            {c.payouts.length} payouts given · total <Money value={total} size="sm" />
          </p>
        </div>
      </Card>
      <Section title="Payouts" urdu="ادائیگیاں">
        <Card padding="p-0" className="divide-y divide-line overflow-hidden">
          {months.map((m) => {
            const b = beneficiaryFor(c, m);
            const p = payoutFor(c, m);
            const name = b?.name || "—";
            return (
              <div key={m} className="flex min-h-[56px] items-center gap-3 px-4 py-2">
                <span className="w-20 shrink-0 text-sm text-ink-500">{monthLabel(c, m)}</span>
                <span className="min-w-0 flex-1 truncate font-semibold text-ink-900">{name}</span>
                {p ? <Money value={p.amount} size="sm" /> : <StatusBadge status="unpaid" label="Not given" />}
              </div>
            );
          })}
        </Card>
      </Section>
      <p className="text-center text-sm text-ink-500">
        <Bi en="Members can now rate you." ur="ممبرز اب آپ کو ریٹ کر سکتے ہیں۔" />
      </p>
    </>
  );
}
