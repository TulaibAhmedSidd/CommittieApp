"use client";

import Bi from "./Bi";

export default function EmptyState({ icon: Icon, title, urdu, text, action, className = "" }) {
  return (
    <div className={`rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center ${className}`}>
      {Icon && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-200 text-ink-500">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
      )}
      <p className="font-semibold text-ink-800">
        <Bi en={title} ur={urdu} stack />
      </p>
      {text && <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">{text}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
