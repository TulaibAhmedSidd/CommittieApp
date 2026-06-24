"use client";

import React from "react";

export default function SectionHeader({
    eyebrow,
    title,
    description,
    icon: Icon = null,
    align = "left",
    className = "",
    action = null,
}) {
    const centered = align === "center";

    return (
        <div
            className={`flex flex-col gap-4 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"} ${className}`}
        >
            <div className={`space-y-3 ${centered ? "max-w-2xl" : "max-w-3xl"}`}>
                {(eyebrow || Icon) && (
                    <div
                        className={`flex items-center gap-2 ${centered ? "justify-center" : ""} text-[10px] font-black uppercase tracking-[0.28em] text-primary-600 dark:text-primary-300`}
                    >
                        {Icon ? (
                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-600/10 text-primary-600 dark:text-primary-300">
                                <Icon size={16} />
                            </span>
                        ) : null}
                        {eyebrow ? <span>{eyebrow}</span> : null}
                    </div>
                )}
                <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tighter text-ink-900 dark:text-ink-700 md:text-5xl">
                        {title}
                    </h2>
                    {description ? (
                        <p className="text-sm font-medium leading-7 text-muted-500 dark:text-muted-600 md:text-base">
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>
            {action ? <div>{action}</div> : null}
        </div>
    );
}
