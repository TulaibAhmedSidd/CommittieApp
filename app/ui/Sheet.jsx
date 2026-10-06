"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import Bi from "./Bi";

/** Bottom sheet on phones, centered dialog on desktop. */
export default function Sheet({ open, onClose, title, urdu, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  const width = size === "lg" ? "sm:max-w-2xl" : size === "sm" ? "sm:max-w-sm" : "sm:max-w-lg";

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <div className={`relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-sheet sm:rounded-2xl ${width}`}>
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-ink-900">
            <Bi en={title} ur={urdu} stack />
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-500 hover:bg-surface-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-line px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
