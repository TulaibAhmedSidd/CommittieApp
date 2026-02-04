"use client";

import React from "react";

export default function Table({ headers = [], children, className = "" }) {
    return (
        <div className={`overflow-x-auto rounded-xl border border-secondary-200 dark:border-secondary-800 ${className}`}>
            <table className="w-full text-left border-collapse">
                <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-sm font-semibold text-secondary-600 dark:text-secondary-400 capitalize whitespace-nowrap"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function TableRow({ children, className = "" }) {
    return (
        <tr className={`hover:bg-secondary-50/50 dark:hover:bg-secondary-900/20 transition-colors ${className}`}>
            {children}
        </tr>
    );
}

export function TableCell({ children, className = "", colSpan = 1 }) {
    return (
        <td colSpan={colSpan} className={`px-6 py-4 text-sm text-secondary-700 dark:text-secondary-300 ${className}`}>
            {children}
        </td>
    );
}
