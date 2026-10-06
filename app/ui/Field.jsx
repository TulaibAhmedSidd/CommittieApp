"use client";

import { forwardRef, useId } from "react";
import Bi from "./Bi";

const inputCls =
  "block w-full min-h-[48px] rounded-xl border bg-white px-3.5 text-[16px] text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-surface-100";

function Wrap({ id, label, urdu, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-ink-800">
          <Bi en={label} ur={urdu} />
        </label>
      )}
      {children}
      {error ? (
        <p className="text-sm font-medium text-danger-700" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-ink-500">{hint}</p>
      )}
    </div>
  );
}

/** Text input with label (EN + UR), hint and error. */
export const Field = forwardRef(function Field({ label, urdu, hint, error, className = "", prefix, ...props }, ref) {
  const autoId = useId();
  const id = props.id || autoId;
  return (
    <Wrap id={id} label={label} urdu={urdu} hint={hint} error={error}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-500">{prefix}</span>}
        <input
          ref={ref}
          id={id}
          className={`${inputCls} ${prefix ? "pl-11" : ""} ${error ? "border-danger-500" : "border-line"} ${className}`}
          aria-invalid={!!error}
          {...props}
        />
      </div>
    </Wrap>
  );
});

export function Select({ label, urdu, hint, error, children, className = "", ...props }) {
  const autoId = useId();
  const id = props.id || autoId;
  return (
    <Wrap id={id} label={label} urdu={urdu} hint={hint} error={error}>
      <select id={id} className={`${inputCls} ${error ? "border-danger-500" : "border-line"} ${className}`} {...props}>
        {children}
      </select>
    </Wrap>
  );
}

export function TextArea({ label, urdu, hint, error, className = "", ...props }) {
  const autoId = useId();
  const id = props.id || autoId;
  return (
    <Wrap id={id} label={label} urdu={urdu} hint={hint} error={error}>
      <textarea
        id={id}
        rows={3}
        className={`${inputCls} py-3 ${error ? "border-danger-500" : "border-line"} ${className}`}
        {...props}
      />
    </Wrap>
  );
}

export default Field;
