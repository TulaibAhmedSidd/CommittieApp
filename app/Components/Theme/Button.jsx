"use client";

import React from "react";

const variants = {
    primary:
        "bg-primary-600 text-white shadow-glow hover:-translate-y-0.5 hover:bg-primary-700 dark:bg-primary-500 dark:text-white",
    accent:
        "bg-accent-500 text-ink-900 shadow-gold hover:-translate-y-0.5 hover:bg-accent-600",
    secondary:
        "bg-slate-900 text-white shadow-md hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
    outline:
        "border-2 border-slate-900 bg-transparent text-slate-900 hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white dark:border-slate-400 dark:text-slate-100 dark:hover:bg-slate-800",
    ghost:
        "bg-transparent text-slate-900 hover:bg-slate-200/80 hover:text-black dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white",
    danger:
        "bg-danger-600 text-white shadow-[0_18px_40px_-18px_rgb(var(--danger-500)/0.6)] hover:-translate-y-0.5 hover:bg-danger-700",
};

const sizes = {
    sm: "min-h-10 px-4 text-sm",
    md: "min-h-11 px-5 text-sm",
    lg: "min-h-14 px-7 text-base",
};

export default function Button({
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    loading = false,
    children,
    ...props
}) {
    const variantClass = variants[variant] || variants.primary;
    const sizeClass = sizes[size] || sizes.md;

    return (
        <button
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-50 dark:focus:ring-offset-surface-100
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.985]
        ${variantClass} ${sizeClass} ${className}
      `}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
}
