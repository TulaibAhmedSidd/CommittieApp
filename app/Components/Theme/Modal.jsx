"use client";

import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-3xl",
        xl: "max-w-5xl",
        full: "max-w-[95vw]"
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`
                relative w-full ${sizes[size]} bg-white dark:bg-slate-900 
                rounded-[2.5rem] shadow-2xl shadow-primary-500/10 
                border border-slate-200 dark:border-slate-800 
                overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
