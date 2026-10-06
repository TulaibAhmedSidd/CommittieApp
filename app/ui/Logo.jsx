import Link from "next/link";

export default function Logo({ href = "/", className = "" }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`} aria-label="CommittieApp home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-base font-black text-white">BC</span>
      <span className="text-[17px] font-bold tracking-tight text-ink-900">
        Committie<span className="text-primary-600">App</span>
      </span>
    </Link>
  );
}
