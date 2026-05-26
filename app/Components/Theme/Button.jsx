"use client";

import React from "react";

const variants = {
    primary: "bg-slate-950 text-white shadow-[0_18px_40px_-18px_rgba(var(--primary-rgb),0.6)] hover:-translate-y-0.5 hover:bg-primary-700 dark:bg-white dark:text-slate-950",
    secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    outline: "border border-primary-500/30 bg-primary-500/5 text-primary-700 hover:-translate-y-0.5 hover:bg-primary-500/10 dark:text-primary-300",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    danger: "bg-rose-600 text-white shadow-[0_18px_40px_-18px_rgba(244,63,94,0.6)] hover:-translate-y-0.5 hover:bg-rose-700",
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
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950
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
