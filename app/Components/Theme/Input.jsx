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
                <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
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
