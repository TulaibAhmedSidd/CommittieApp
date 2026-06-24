"use client";

import React from "react";

export default function Card({ children, className = "", title = null, description = null, footer = null }) {
    return (
        <div
            className={`overflow-hidden rounded-[2rem] border border-border-100 bg-surface-50/88 shadow-card backdrop-blur dark:border-border-200 dark:bg-surface-100/88 ${className}`}
        >
            {(title || description) && (
                <div className="border-b border-border-100 bg-surface-100/70 px-6 py-5 dark:border-border-200 dark:bg-surface-200/40">
                    {title && (
                        <h3 className="text-lg font-black tracking-tight text-ink-900 dark:text-ink-700">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="mt-1 text-sm font-medium text-muted-500 dark:text-muted-600">
                            {description}
                        </p>
                    )}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && (
                <div className="border-t border-border-100 bg-surface-100/60 px-6 py-4 dark:border-border-200 dark:bg-surface-200/30">
                    {footer}
                </div>
            )}
        </div>
    );
}
