"use client";

import React from "react";

export default function Input({
    label,
    error = "",
    type = "text",
    className = "",
    containerClassName = "",
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-500 dark:text-muted-600">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`
          input-field text-ink-900 dark:text-ink-700
          ${error ? "border-danger-500 focus:ring-danger-500/30" : "border-border-100 dark:border-border-200"}
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
        </div>
    );
}
