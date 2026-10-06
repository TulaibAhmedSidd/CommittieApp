"use client";

import Link from "next/link";

const VARIANTS = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm",
  secondary: "bg-white text-ink-900 border border-line hover:bg-surface-100 active:bg-surface-200",
  ghost: "bg-transparent text-primary-700 hover:bg-primary-50 active:bg-primary-100",
  danger: "bg-white text-danger-700 border border-danger-100 hover:bg-danger-50",
  dangerSolid: "bg-danger-600 text-white hover:bg-danger-700",
  whatsapp: "bg-[#1fa855] text-white hover:bg-[#178c46] shadow-sm",
};

const SIZES = {
  sm: "min-h-[36px] px-3 text-sm gap-1.5 rounded-lg",
  md: "min-h-[44px] px-4 text-[15px] gap-2 rounded-lg",
  lg: "min-h-[52px] px-5 text-base gap-2 rounded-xl",
};

/**
 * The only button in the app. See docs/DESIGN_SYSTEM.md.
 * <Button>Save</Button>  <Button variant="secondary" href="/x">Open</Button>
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  loading = false,
  disabled = false,
  href,
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) {
  const cls = [
    "inline-flex items-center justify-center text-center font-semibold transition-colors select-none [&_.bi]:justify-center [&_.bi]:items-center",
    "disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    full ? "w-full" : "",
    className,
  ].join(" ");

  const content = (
    <>
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      ) : (
        Icon && <Icon className="h-[1.15em] w-[1.15em] shrink-0" aria-hidden />
      )}
      {children}
    </>
  );

  if (href && !disabled) {
    const external = /^https?:/.test(href);
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props}>
        {content}
      </a>
    ) : (
      <Link href={href} className={cls} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
