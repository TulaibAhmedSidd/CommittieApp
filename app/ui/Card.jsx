import Link from "next/link";

/** White box. With href the whole card is tappable. */
export default function Card({ children, href, onClick, className = "", padding = "p-4" }) {
  const cls = `block rounded-xl border border-line bg-white shadow-card ${padding} ${
    href || onClick ? "transition-colors hover:border-primary-200 active:bg-surface-100 cursor-pointer" : ""
  } ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${cls} w-full text-left`}>
        {children}
      </button>
    );
  }
  return <div className={cls}>{children}</div>;
}
