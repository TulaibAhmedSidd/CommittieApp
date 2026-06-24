"use client";

import React from "react";

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action = null,
    className = "",
}) {
    return (
        <div
            className={`rounded-[2rem] border border-dashed border-border-200 bg-surface-50/75 px-8 py-16 text-center shadow-sm backdrop-blur dark:border-border-200 dark:bg-surface-100/70 ${className}`}
        >
            {Icon ? (
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary-500/10 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
                    <Icon size={28} />
                </div>
            ) : null}
            <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-ink-900 dark:text-ink-700">{title}</h3>
                {description ? (
                    <p className="mx-auto max-w-xl text-sm font-medium leading-6 text-muted-500 dark:text-muted-600">
                        {description}
                    </p>
                ) : null}
            </div>
            {action ? <div className="mt-6">{action}</div> : null}
        </div>
    );
}
