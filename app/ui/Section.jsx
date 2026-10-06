"use client";

import Link from "next/link";
import Bi from "./Bi";
import { W } from "../utils/words";

/** Titled group. href shows a "See all" link. */
export default function Section({ title, urdu, href, action, count, children, className = "" }) {
  return (
    <section className={className}>
      {(title || action || href) && (
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink-600">
            <Bi en={title} ur={urdu} />
            {typeof count === "number" && <span className="ml-1.5 text-ink-400">({count})</span>}
          </h2>
          {href ? (
            <Link href={href} className="text-sm font-semibold text-primary-700 hover:underline">
              <Bi {...W.seeAll} />
            </Link>
          ) : (
            action
          )}
        </div>
      )}
      {children}
    </section>
  );
}
