"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMoreHorizontal, FiChevronRight } from "react-icons/fi";
import Sheet from "./Sheet";
import Bi from "./Bi";
import { W } from "../utils/words";

/**
 * "More" button with a list of less-common actions.
 * items: [{ label, urdu, icon, onClick | href, danger, hidden }]
 */
export default function MoreMenu({ items, label = W.more.en, urdu = W.more.ur, buttonClassName = "" }) {
  const [open, setOpen] = useState(false);
  const visible = items.filter((i) => !i.hidden);
  if (!visible.length) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-line bg-white px-4 text-[15px] font-semibold text-ink-800 hover:bg-surface-100 ${buttonClassName}`}
      >
        <FiMoreHorizontal className="h-5 w-5" aria-hidden />
        <Bi en={label} ur={urdu} />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={label} urdu={urdu} size="sm">
        <ul className="-mx-2">
          {visible.map((item) => {
            const Icon = item.icon;
            const inner = (
              <span className={`flex min-h-[52px] items-center gap-3 rounded-lg px-3 ${item.danger ? "text-danger-700" : "text-ink-900"} hover:bg-surface-100`}>
                {Icon && <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />}
                <span className="flex-1 text-[15px] font-medium">
                  <Bi en={item.label} ur={item.urdu} />
                </span>
                <FiChevronRight className="h-4 w-4 text-ink-400" aria-hidden />
              </span>
            );
            return (
              <li key={item.label}>
                {item.href ? (
                  <Link href={item.href} onClick={() => setOpen(false)} className="block">
                    {inner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </Sheet>
    </>
  );
}
