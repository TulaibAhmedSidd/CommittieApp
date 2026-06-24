"use client";

import React from "react";

/**
 * Dashboard stat tile. Replaces the dozens of ad-hoc metric tiles re-built
 * across admin/* and userDash/* pages. Pairs well with <Money /> for the
 * `value` slot when displaying currency.
 *
 * Props:
 *   label    — short uppercase eyebrow
 *   value    — main number/string OR ReactNode (e.g. <Money />)
 *   hint     — small descriptor under value
 *   delta    — optional change indicator { value: number, label?: string }
 *   icon     — optional react-icons component
 *   tone     — "default" | "primary" | "accent" | "success" | "warning" | "danger"
 *   urduLabel— optional Urdu translation of `label` shown beneath
 *   className— passthrough
 */
const tones = {
    default: { ring: "bg-primary-500/10 text-primary-600", border: "border-border-100" },
    primary: { ring: "bg-primary-500/10 text-primary-600", border: "border-primary-500/30" },
    accent: { ring: "bg-accent-500/15 text-accent-700", border: "border-accent-500/30" },
    success: { ring: "bg-success-500/10 text-success-700", border: "border-success-500/25" },
    warning: { ring: "bg-warning-500/10 text-warning-700", border: "border-warning-500/25" },
    danger: { ring: "bg-danger-500/10 text-danger-700", border: "border-danger-500/25" },
};

export default function Stat({
    label,
    value,
    hint = null,
    delta = null,
    icon: Icon = null,
    tone = "default",
    urduLabel = null,
    className = "",
}) {
    const t = tones[tone] || tones.default;
    const deltaPositive = delta?.value != null && delta.value >= 0;

    return (
        <div
            className={`metric-tile group relative flex flex-col gap-4 border ${t.border} transition-all hover:-translate-y-0.5 hover:shadow-card ${className}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-muted-500">
                        {label}
                    </p>
                    {urduLabel ? (
                        <p className="font-urdu text-[11px] text-muted-500" dir="rtl">
                            {urduLabel}
                        </p>
                    ) : null}
                </div>
                {Icon ? (
                    <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${t.ring}`}>
                        <Icon size={18} />
                    </span>
                ) : null}
            </div>

            <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight text-ink-900 dark:text-ink-700">
                    {value}
                </div>
                {hint ? (
                    <p className="text-xs font-medium text-muted-500">{hint}</p>
                ) : null}
            </div>

            {delta ? (
                <div
                    className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                        deltaPositive
                            ? "bg-success-500/10 text-success-700"
                            : "bg-danger-500/10 text-danger-700"
                    }`}
                >
                    <span>{deltaPositive ? "▲" : "▼"}</span>
                    <span>{Math.abs(delta.value)}%</span>
                    {delta.label ? <span className="opacity-70">{delta.label}</span> : null}
                </div>
            ) : null}

            <div className="gold-divider absolute inset-x-6 bottom-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
    );
}
