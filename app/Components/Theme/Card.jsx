"use client";

import React from "react";

export default function Card({ children, className = "", title = null, description = null, footer = null }) {
    return (
        <div className={`overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/88 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/88 ${className}`}>
            {(title || description) && (
                <div className="border-b border-slate-200/80 bg-slate-50/70 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/40">
                    {title && <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">{title}</h3>}
                    {description && <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{description}</p>}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && (
                <div className="border-t border-slate-200/80 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/30">
                    {footer}
                </div>
            )}
        </div>
    );
}
