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
        <div className={`rounded-[2rem] border border-dashed border-slate-200 bg-white/75 px-8 py-16 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 ${className}`}>
            {Icon ? (
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <Icon size={28} />
                </div>
            ) : null}
            <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h3>
                {description ? (
                    <p className="mx-auto max-w-xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                ) : null}
            </div>
            {action ? <div className="mt-6">{action}</div> : null}
        </div>
    );
}
