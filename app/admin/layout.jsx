"use client";

import { useEffect, useState } from "react";
import { FiHome, FiLayers, FiPlus, FiUsers, FiMessageCircle, FiBell, FiLink, FiSearch, FiShield, FiUser, FiUserCheck, FiList, FiHelpCircle } from "react-icons/fi";
import { AppShell } from "../ui";
import { W } from "../utils/words";
import { getSession } from "../utils/session";

export default function AdminLayout({ children }) {
  const [isSuper, setIsSuper] = useState(false);
  useEffect(() => setIsSuper(!!getSession("admin")?.account?.isSuperAdmin), []);

  const nav = [
    { href: "/admin", icon: FiHome, ...W.home, exact: true },
    { href: "/admin/bcs", icon: FiLayers, ...W.myBcs, short: "BCs" },
    { href: "/admin/create", icon: FiPlus, ...W.createBc, short: "New BC", primary: true },
    { href: "/admin/members", icon: FiUsers, ...W.members },
  ];
  const more = [
    { href: "/admin/inbox", icon: FiMessageCircle, ...W.messages },
    { href: "/admin/notifications", icon: FiBell, ...W.alerts },
    { href: "/admin/invite", icon: FiLink, ...W.inviteLink },
    { href: "/admin/all-members", icon: FiSearch, en: "Find members", ur: "ممبرز تلاش کریں" },
    { href: "/admin/verify-identities", icon: FiShield, ...W.verifyIdentity },
    { href: "/admin/profile", icon: FiUser, ...W.profile },
    { href: "/admin/approvals", icon: FiUserCheck, en: "Organizers", ur: "منتظمین", hidden: !isSuper },
    { href: "/admin/logs", icon: FiList, en: "Activity log", ur: "سرگرمی", hidden: !isSuper },
    { href: "/guide/organizer", icon: FiHelpCircle, ...W.guide },
  ];

  return (
    <AppShell scope="admin" nav={nav} more={more} notificationsHref="/admin/notifications">
      {children}
    </AppShell>
  );
}
