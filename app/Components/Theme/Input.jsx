"use client";

import React from "react";

export default function Input({
    label,
    error = '',
    type = "text",
    className = "",
    containerClassName = "",
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`
          input-field text-secondary-900 dark:text-white
          ${error ? "border-red-500 focus:ring-red-500" : "border-secondary-200 dark:border-secondary-700"}
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
