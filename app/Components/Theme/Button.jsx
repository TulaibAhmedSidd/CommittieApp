"use client";

import React from "react";

const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-sm",
    secondary: "bg-secondary-100 hover:bg-secondary-200 text-secondary-900 border border-secondary-200",
    outline: "bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
    ghost: "bg-transparent hover:bg-secondary-100 text-secondary-600",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
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
        inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]
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
