"use client";

import React from "react";

const tones = {
    success: "bg-success-500/10 text-success-700 border-success-500/20 dark:text-success-500",
    warning: "bg-warning-500/10 text-warning-700 border-warning-500/25 dark:text-warning-500",
    danger: "bg-danger-500/10 text-danger-700 border-danger-500/20 dark:text-danger-500",
    info: "bg-info-500/10 text-info-700 border-info-500/20 dark:text-info-500",
    accent: "bg-accent-500/10 text-accent-700 border-accent-500/25 dark:text-accent-500",
    neutral: "bg-ink-500/10 text-ink-700 border-ink-500/15 dark:text-ink-500",
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
