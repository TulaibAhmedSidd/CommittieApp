"use client";

import Bi from "./Bi";

/** 2-4 tabs. tabs: [{ value, en, ur, count }] */
export default function Tabs({ tabs, value, onChange, className = "" }) {
  return (
    <div className={`flex gap-1 rounded-xl bg-surface-200 p-1 ${className}`} role="tablist">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={`flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-semibold transition-colors ${
              active ? "bg-white text-ink-900 shadow-sm" : "text-ink-600 hover:text-ink-900"
            }`}
          >
            <Bi en={t.en} ur={t.ur} />
            {typeof t.count === "number" && t.count > 0 && (
              <span className={`rounded-full px-1.5 text-xs ${active ? "bg-primary-100 text-primary-800" : "bg-white text-ink-600"}`}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
