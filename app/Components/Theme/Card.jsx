"use client";

import React from "react";

export default function Card({ children, className = "", title = null, description = null, footer = null }) {
    return (
        <div className={`bg-background text-foreground border border-border-color rounded-xl overflow-hidden shadow-premium ${className}`}>
            {(title || description) && (
                <div className="px-6 py-4 border-b border-border-color bg-secondary-50/50 dark:bg-secondary-900/50">
                    {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
                    {description && <p className="text-sm text-secondary-500 mt-1">{description}</p>}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && (
                <div className="px-6 py-4 bg-secondary-50/30 dark:bg-secondary-900/10 border-t border-border-color">
                    {footer}
                </div>
            )}
        </div>
    );
}
