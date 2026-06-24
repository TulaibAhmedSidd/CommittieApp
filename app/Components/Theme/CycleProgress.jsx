"use client";

import React from "react";

/**
 * Visual cycle bar for a committee. Replaces the per-page hand-rolled
 * "Month X of Y" markers in admin/manage, userDash/committee/[id], etc.
 *
 * Props:
 *   current   — number (1-indexed)
 *   total     — total months
 *   paidCount — optional, members who paid this month (drives accent stripe width)
 *   memberCount — optional, denominator for paidCount
 *   status    — "open" | "ongoing" | "finished" | "paused"
 *   className — passthrough
 */
const statusTone = {
    open: { fg: "text-primary-700", bg: "bg-primary-500/10", label: "Open" },
    ongoing: { fg: "text-success-700", bg: "bg-success-500/10", label: "Ongoing" },
    finished: { fg: "text-muted-500", bg: "bg-ink-500/10", label: "Closed" },
    paused: { fg: "text-warning-700", bg: "bg-warning-500/10", label: "Paused" },
};

export default function CycleProgress({
    current = 1,
    total = 1,
    paidCount = null,
    memberCount = null,
    status = "ongoing",
    className = "",
}) {
    const safeTotal = Math.max(total, 1);
    const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
    const pct = (safeCurrent / safeTotal) * 100;
    const paidPct =
        paidCount != null && memberCount && memberCount > 0
            ? Math.min(100, (paidCount / memberCount) * 100)
            : null;

    const tone = statusTone[status] || statusTone.ongoing;

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-muted-500">
                        Cycle <span className="font-urdu text-[11px] normal-case tracking-normal" dir="rtl">سائیکل</span>
                    </p>
                    <p className="text-lg font-black text-ink-900 dark:text-ink-700">
                        Month {safeCurrent}
                        <span className="text-muted-500 font-bold"> / {safeTotal}</span>
                    </p>
                </div>
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tone.bg} ${tone.fg}`}
                >
                    {tone.label}
                </span>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-surface-200">
                {/* total elapsed segment */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
                {/* current-month paid overlay (gold accent stripe) */}
                {paidPct != null ? (
                    <div
                        className="absolute inset-y-0 left-0 h-1.5 self-center top-1/2 -translate-y-1/2 rounded-full bg-accent-500/80 transition-all duration-700"
                        style={{ width: `calc(${(safeCurrent - 1) / safeTotal * 100}% + ${(paidPct / 100) * (100 / safeTotal)}%)` }}
                    />
                ) : null}
                {/* tick marks every month */}
                <div className="absolute inset-0 flex">
                    {Array.from({ length: safeTotal }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 border-r border-surface-50/40 last:border-r-0"
                        />
                    ))}
                </div>
            </div>

            {paidCount != null && memberCount != null ? (
                <p className="text-xs font-semibold text-muted-500">
                    <span className="text-accent-700 font-black">{paidCount}</span> of{" "}
                    <span className="text-ink-700">{memberCount}</span> members paid this month
                </p>
            ) : null}
        </div>
    );
}
