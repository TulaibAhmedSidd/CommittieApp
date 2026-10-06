"use client";

import { useLang } from "./lang";

/**
 * Bilingual label. English + Urdu together; the language setting decides which comes first.
 * <Bi en="Create BC" ur="نئی کمیٹی" />            inline: "Create BC · نئی کمیٹی" (second one small)
 * <Bi en="Pay now" ur="قسط دیں" stack />           second line under the first
 * <Bi {...W.createBc} />                          from app/utils/words.js
 */
export default function Bi({ en, ur, stack = false, className = "", subClassName = "" }) {
  const { lang } = useLang();
  if (!ur) return <span className={className}>{en}</span>;
  const urFirst = lang === "ur";
  const main = urFirst ? ur : en;
  const sub = urFirst ? en : ur;
  const urduProps = { dir: "rtl", lang: "ur", className: "font-urdu" };

  const mainEl = <span {...(urFirst ? urduProps : {})}>{main}</span>;
  const subEl = (
    <span
      {...(!urFirst ? urduProps : {})}
      className={`${!urFirst ? "font-urdu" : ""} text-[0.8em] font-normal opacity-75 ${subClassName}`}
    >
      {sub}
    </span>
  );

  if (stack) {
    return (
      <span className={`bi inline-flex flex-col items-start leading-tight ${className}`}>
        {mainEl}
        {subEl}
      </span>
    );
  }
  return (
    <span className={`bi inline-flex flex-wrap items-baseline gap-x-1.5 ${className}`}>
      {mainEl}
      {subEl}
    </span>
  );
}
