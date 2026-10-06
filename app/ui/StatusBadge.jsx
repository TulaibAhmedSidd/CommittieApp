"use client";

import Bi from "./Bi";
import { STATUS } from "../utils/words";

const TONES = {
  green: "bg-success-50 text-success-700 ring-success-100",
  amber: "bg-warning-50 text-warning-700 ring-warning-100",
  red: "bg-danger-50 text-danger-700 ring-danger-100",
  gray: "bg-surface-200 text-ink-600 ring-line",
  blue: "bg-info-50 text-info-700 ring-info-100",
  primary: "bg-primary-50 text-primary-800 ring-primary-100",
};

/** Fixed status words + colors. <StatusBadge status="pending" /> */
export default function StatusBadge({ status, label, tone, className = "" }) {
  const s = STATUS[status] || { en: label || status, tone: tone || "gray" };
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-semibold ring-1 ring-inset ${
        TONES[tone || s.tone] || TONES.gray
      } ${className}`}
    >
      <Bi en={label || s.en} ur={label ? undefined : s.ur} />
    </span>
  );
}
