"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import Bi from "./Bi";

/** Page title row + content. One main action on the right (desktop) / below (mobile). */
export default function Page({ title, urdu, subtitle, back, action, children }) {
  return (
    <div className="mx-auto w-full max-w-page px-4 pb-28 pt-4 sm:px-6 lg:pb-12 lg:pt-8">
      <div className="mb-5 flex items-start gap-3">
        {back && (
          <Link
            href={back}
            aria-label="Back"
            className="-ml-2 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-700 hover:bg-surface-200"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-bold leading-tight text-ink-900 sm:text-2xl">
            <Bi en={title} ur={urdu} stack />
          </h1>
          {subtitle && <p className="mt-1 text-sm text-ink-600">{subtitle}</p>}
        </div>
        {action && <div className="hidden shrink-0 sm:block">{action}</div>}
      </div>
      {action && <div className="mb-5 sm:hidden">{action}</div>}
      <div className="space-y-6">{children}</div>
    </div>
  );
}
