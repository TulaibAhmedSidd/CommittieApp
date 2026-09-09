"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    totalItems = null,
    pageSize = null,
    className = "",
}) {
    if (totalPages <= 1 && !totalItems) return null;

    const startItem = totalItems !== null && pageSize ? (currentPage - 1) * pageSize + 1 : null;
    const endItem = totalItems !== null && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

    // Helper to generate visible page numbers
    const getPageNumbers = () => {
        const delta = 1;
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < totalPages - 1) {
            range.push("...");
        }

        range.unshift(1);
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200/80 dark:border-slate-800 ${className}`}>
            {totalItems !== null ? (
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-900 dark:text-white">{startItem}</span> to{" "}
                    <span className="font-bold text-slate-900 dark:text-white">{endItem}</span> of{" "}
                    <span className="font-bold text-primary-600 dark:text-primary-400">{totalItems}</span> entries
                </div>
            ) : (
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of{" "}
                    <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
                </div>
            )}

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="h-10 px-3.5 rounded-xl bg-slate-900 text-white hover:bg-primary-600 disabled:opacity-30 disabled:hover:bg-slate-900 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-xs font-black uppercase tracking-wider shadow-sm"
                    title="Previous page"
                >
                    <FiChevronLeft size={16} />
                    <span className="hidden sm:inline">Prev</span>
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((p, idx) => {
                        if (p === "...") {
                            return (
                                <span key={`ellipsis-${idx}`} className="w-8 text-center text-slate-400 font-bold text-xs select-none">
                                    ...
                                </span>
                            );
                        }

                        const isActive = p === currentPage;
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => onPageChange(p)}
                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                                    isActive
                                        ? "bg-primary-600 text-white shadow-md shadow-primary-500/30 scale-105"
                                        : "bg-slate-900/90 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="h-10 px-3.5 rounded-xl bg-slate-900 text-white hover:bg-primary-600 disabled:opacity-30 disabled:hover:bg-slate-900 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-xs font-black uppercase tracking-wider shadow-sm"
                    title="Next page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <FiChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
