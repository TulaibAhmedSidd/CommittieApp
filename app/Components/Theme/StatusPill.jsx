"use client";

import React from "react";

const tones = {
    success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
    warning: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300",
    danger: "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-300",
    info: "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-300",
    neutral: "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-300",
};

export default function StatusPill({ children, tone = "neutral", className = "" }) {
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${tones[tone] || tones.neutral} ${className}`}
        >
            {children}
        </span>
    );
}
