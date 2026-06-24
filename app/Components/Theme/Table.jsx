"use client";

import React from "react";

export default function Table({ headers = [], children, className = "" }) {
    return (
        <div className={`w-full overflow-x-auto rounded-xl border border-border-100 dark:border-border-200 ${className}`}>
            <table className="w-full text-left border-collapse">
                <thead className="w-full bg-surface-100 dark:bg-surface-200/50">
                    <tr className="w-full">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="w-full px-6 py-4 text-sm font-semibold text-muted-500 dark:text-muted-600 capitalize whitespace-nowrap"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="w-full divide-y divide-border-100 dark:divide-border-200">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function TableRow({ children, className = "" }) {
    return (
        <tr className={`w-full hover:bg-surface-100/50 dark:hover:bg-surface-200/20 transition-colors ${className}`}>
            {children}
        </tr>
    );
}

export function TableCell({ children, className = "", colSpan = 1 }) {
    return (
        <td colSpan={colSpan} className={`w-full px-6 py-4 text-sm text-ink-700 dark:text-ink-500 ${className}`}>
            {children}
        </td>
    );
}
