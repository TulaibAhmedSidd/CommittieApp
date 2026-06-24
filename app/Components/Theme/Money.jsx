"use client";

import React from "react";
import { formatPKR, amountInUrduWords } from "@/app/utils/format";

/**
 * Display Pakistani Rupee amounts consistently.
 *
 * Props:
 *   amount        — number
 *   size          — "sm" | "md" | "lg" | "xl"  (default md)
 *   grouping      — "western" | "lakh"          (default western; lakh = 15,00,000 style)
 *   showUrduWords — append Urdu word form (e.g. "پچاس ہزار روپے"). Useful on
 *                   committee totals / payouts to signal trust + locality.
 *   suffix        — string shown after the amount ("/ month", "per cycle", etc.)
 *   tone          — "default" | "primary" | "accent" | "success" | "danger"
 *   className     — passthrough
 *
 * Renders the ₨ glyph with a thin space before the digits.
 */
const sizes = {
    sm: "text-sm",
    md: "text-base md:text-lg",
    lg: "text-2xl md:text-3xl",
    xl: "text-4xl md:text-5xl",
};

const tones = {
    default: "text-ink-900 dark:text-ink-700",
    primary: "text-primary-700 dark:text-primary-300",
    accent: "text-accent-700 dark:text-accent-500",
    success: "text-success-700 dark:text-success-500",
    danger: "text-danger-700 dark:text-danger-500",
};

export default function Money({
    amount,
    size = "md",
    grouping = "western",
    showUrduWords = false,
    suffix = null,
    tone = "default",
    className = "",
}) {
    return (
        <span className={`inline-flex items-baseline gap-2 ${className}`}>
            <span
                className={`font-black tracking-tight tabular-nums ${sizes[size] || sizes.md} ${tones[tone] || tones.default}`}
            >
                <span className="mr-1 font-bold opacity-80">₨</span>
                {formatPKR(amount, grouping)}
            </span>
            {suffix ? (
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-500">
                    {suffix}
                </span>
            ) : null}
            {showUrduWords ? (
                <span className="font-urdu text-sm text-muted-500" dir="rtl">
                    {amountInUrduWords(amount)}
                </span>
            ) : null}
        </span>
    );
}
