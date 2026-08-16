"use client";

import React from "react";

export default function Input({
    label,
    icon: Icon = null,
    error = "",
    type = "text",
    className = "",
    containerClassName = "",
    ...props
}) {
    const renderIcon = () => {
        if (!Icon) return null;
        if (React.isValidElement(Icon)) return Icon;
        if (typeof Icon === "function" || typeof Icon === "object") {
            const Component = Icon;
            return <Component size={18} />;
        }
        return Icon;
    };

    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center justify-center">
                        {renderIcon()}
                    </div>
                )}
                <input
                    type={type}
                    className={`
            input-field text-slate-900 dark:text-white
            ${Icon ? "pl-11" : "px-4"}
            ${error ? "border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-slate-700"}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
