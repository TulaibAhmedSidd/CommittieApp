"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useLang } from "./lang";

/** Header + footer for public pages (landing, login, register, guides, legal). */
export default function PublicLayout({ children, narrow = false }) {
  const { lang, setLang } = useLang();
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              className="min-h-[40px] rounded-lg px-3 text-sm font-semibold text-ink-700 hover:bg-surface-100"
              aria-label="Change language"
            >
              {lang === "en" ? <span className="font-urdu">اردو</span> : "English"}
            </button>
            <Link href="/login" className="min-h-[40px] rounded-lg px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50">
              Log in
            </Link>
          </div>
        </div>
      </header>
      <main className={`mx-auto w-full flex-1 px-4 py-6 sm:py-10 ${narrow ? "max-w-md" : "max-w-5xl"}`}>{children}</main>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-ink-500">
          <span>© {new Date().getFullYear()} CommittieApp</span>
          <nav className="flex flex-wrap gap-4">
            <Link href="/guide/member" className="hover:text-ink-900">Help</Link>
            <Link href="/contact" className="hover:text-ink-900">Contact</Link>
            <Link href="/privacy" className="hover:text-ink-900">Privacy</Link>
            <Link href="/terms" className="hover:text-ink-900">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
