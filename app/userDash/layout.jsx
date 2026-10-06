"use client";

import { FiHome, FiSearch, FiMessageCircle, FiUser, FiBell, FiMapPin, FiHelpCircle } from "react-icons/fi";
import { AppShell } from "../ui";
import { W } from "../utils/words";

export default function MemberLayout({ children }) {
  const nav = [
    { href: "/userDash", icon: FiHome, ...W.home, exact: true },
    { href: "/userDash/explore", icon: FiSearch, ...W.explore, short: "Find" },
    { href: "/userDash/inbox", icon: FiMessageCircle, ...W.messages },
    { href: "/userDash/profile", icon: FiUser, ...W.profile },
  ];
  const more = [
    { href: "/userDash/notifications", icon: FiBell, ...W.alerts },
    { href: "/userDash/near-me", icon: FiMapPin, ...W.nearMe },
    { href: "/guide/member", icon: FiHelpCircle, ...W.guide },
  ];
  return (
    <AppShell scope="member" nav={nav} more={more} notificationsHref="/userDash/notifications">
      {children}
    </AppShell>
  );
}
