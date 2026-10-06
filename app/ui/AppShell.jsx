"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiBell, FiLogOut, FiChevronRight, FiGrid } from "react-icons/fi";
import Logo from "./Logo";
import Bi from "./Bi";
import Sheet from "./Sheet";
import Avatar from "./Avatar";
import { useLang } from "./lang";
import { W } from "../utils/words";
import { getSession, clearSession } from "../utils/session";
import { apiFor } from "../utils/api";

/**
 * Shared shell for organizer (/admin) and member (/userDash) areas.
 * nav: [{ href, icon, en, ur, exact?, primary? }]  (max 5; one may be primary = big center button on mobile)
 * more: [{ href, icon, en, ur, hidden? }]          (in the "More" sheet and the sidebar's lower group)
 */
export default function AppShell({ scope, nav, more = [], notificationsHref, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useLang();
  const [account, setAccount] = useState(null);
  const [unread, setUnread] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const s = getSession(scope);
    if (!s) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setAccount(s.account);
  }, [scope, pathname, router]);

  useEffect(() => {
    if (!account) return;
    let alive = true;
    const load = () =>
      apiFor(scope)
        .get("/api/notification")
        .then((d) => alive && setUnread(d.unread || 0))
        .catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [account, scope, pathname]);

  const isActive = (item) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/"));
  const visibleMore = more.filter((m) => !m.hidden);

  const logout = () => {
    clearSession(scope);
    router.replace("/login");
  };

  if (!account) return <div className="min-h-screen bg-surface" />;

  return (
    <div className="min-h-screen bg-surface lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="px-5 py-5">
          <Logo href={nav[0]?.href || "/"} />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Main">
          {nav.map((item) => (
            <SideLink key={item.href} item={item} active={isActive(item)} />
          ))}
          {visibleMore.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-ink-400">{W.more.en}</p>
              {visibleMore.map((item) => (
                <SideLink key={item.href} item={item} active={isActive(item)} />
              ))}
            </>
          )}
        </nav>
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={account.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{account.name}</p>
              <p className="truncate text-xs text-ink-500">{scope === "admin" ? (account.isSuperAdmin ? "Super admin" : "Organizer") : "Member"}</p>
            </div>
          </div>
          <button type="button" onClick={logout} className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-[15px] font-medium text-ink-700 hover:bg-surface-100">
            <FiLogOut className="h-5 w-5" aria-hidden />
            <Bi {...W.logout} />
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-line bg-white/95 px-4 backdrop-blur lg:justify-end lg:px-8">
          <div className="lg:hidden">
            <Logo href={nav[0]?.href || "/"} />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              className="min-h-[40px] rounded-lg px-3 text-sm font-semibold text-ink-700 hover:bg-surface-100"
              aria-label="Change language"
            >
              {lang === "en" ? <span className="font-urdu">اردو</span> : "English"}
            </button>
            {notificationsHref && (
              <Link href={notificationsHref} aria-label={`Alerts${unread ? `, ${unread} new` : ""}`} className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-surface-100">
                <FiBell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger-600 px-1 text-[11px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
            )}
          </div>
        </header>

        <main>{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Main">
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {nav.map((item) =>
            item.primary ? (
              <Link key={item.href} href={item.href} className="-mt-5 flex flex-col items-center px-2" aria-label={item.en}>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg ring-4 ring-white">
                  <item.icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="mt-0.5 text-[11px] font-semibold text-primary-700">{item.short || item.en}</span>
              </Link>
            ) : (
              <BottomLink key={item.href} item={item} active={isActive(item)} />
            )
          )}
          <button type="button" onClick={() => setMoreOpen(true)} className="flex min-h-[60px] flex-1 flex-col items-center justify-center gap-0.5 text-ink-500">
            <FiGrid className="h-[22px] w-[22px]" aria-hidden />
            <span className="text-[11px] font-semibold">{W.more.en}</span>
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title={W.more.en} urdu={W.more.ur} size="sm">
        <div className="-mx-2 mb-2 flex items-center gap-3 rounded-lg bg-surface-100 px-3 py-3">
          <Avatar name={account.name} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{account.name}</p>
            <p className="truncate text-sm text-ink-500">{account.phone || account.email}</p>
          </div>
        </div>
        <ul className="-mx-2">
          {visibleMore.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setMoreOpen(false)} className="flex min-h-[52px] items-center gap-3 rounded-lg px-3 text-ink-900 hover:bg-surface-100">
                <item.icon className="h-5 w-5 text-ink-600" aria-hidden />
                <span className="flex-1 text-[15px] font-medium">
                  <Bi en={item.en} ur={item.ur} />
                </span>
                <FiChevronRight className="h-4 w-4 text-ink-400" aria-hidden />
              </Link>
            </li>
          ))}
          <li>
            <button type="button" onClick={logout} className="flex min-h-[52px] w-full items-center gap-3 rounded-lg px-3 text-danger-700 hover:bg-danger-50">
              <FiLogOut className="h-5 w-5" aria-hidden />
              <span className="text-[15px] font-medium">
                <Bi {...W.logout} />
              </span>
            </button>
          </li>
        </ul>
      </Sheet>
    </div>
  );
}

function SideLink({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors ${
        active ? "bg-primary-50 text-primary-800" : "text-ink-700 hover:bg-surface-100"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      <Bi en={item.en} ur={item.ur} />
    </Link>
  );
}

function BottomLink({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex min-h-[60px] flex-1 flex-col items-center justify-center gap-0.5 ${active ? "text-primary-700" : "text-ink-500"}`}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-[22px] w-[22px]" aria-hidden />
      <span className="text-[11px] font-semibold">{item.short || item.en}</span>
    </Link>
  );
}
