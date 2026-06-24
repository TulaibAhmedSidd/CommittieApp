"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";

/**
 * Render an English + Urdu pair side-by-side on key surfaces (CTAs, status
 * chips, dashboard tiles). Honors the active language by emphasizing the
 * matching one; the other is shown dimmer (or hidden if `bilingual={false}`).
 *
 * Usage:
 *   <BilingualLabel en="Pay Now" ur="ابھی ادا کریں" />
 *   <BilingualLabel en="Verified" ur="تصدیق شدہ" layout="stack" />
 *
 * If you already have translation keys, prefer t(...) from useLanguage; this
 * primitive is for the explicit side-by-side rendering pattern.
 */
export default function BilingualLabel({
    en,
    ur,
    layout = "inline", // "inline" | "stack"
    bilingual = true,
    className = "",
}) {
    const { language } = useLanguage();
    const primary = language === "ur" ? ur : en;
    const secondary = language === "ur" ? en : ur;

    if (!bilingual) {
        return <span className={className}>{primary}</span>;
    }

    if (layout === "stack") {
        return (
            <span className={`inline-flex flex-col leading-tight ${className}`}>
                <span className="font-bold">{primary}</span>
                {secondary ? (
                    <span
                        className={`text-[0.72em] font-medium text-muted-500 ${language === "en" ? "font-urdu" : ""}`}
                        dir={language === "en" ? "rtl" : "ltr"}
                    >
                        {secondary}
                    </span>
                ) : null}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-baseline gap-2 ${className}`}>
            <span className="font-bold">{primary}</span>
            {secondary ? (
                <span
                    className={`text-[0.78em] font-medium text-muted-500 ${language === "en" ? "font-urdu" : ""}`}
                    dir={language === "en" ? "rtl" : "ltr"}
                >
                    / {secondary}
                </span>
            ) : null}
        </span>
    );
}
