"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    FiHome,
    FiUsers,
    FiGrid,
    FiPlusSquare,
    FiBell,
    FiLogOut,
    FiMenu,
    FiChevronRight,
    FiUserPlus,
    FiShield,
    FiActivity,
    FiMessageSquare,
    FiZap,
    FiWind,
    FiLink,
    FiUser,
    FiX,
    FiLayers
} from "react-icons/fi";

import { useLanguage } from "../Components/LanguageContext";

export default function AdminLayout({ children }) {
    const { t, language, setLanguage, isRTL } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminDetails, setIsAdminDetails] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const adminData = localStorage.getItem("admin_detail");
        if (adminData) {
            try {
                const parsed = JSON.parse(adminData);
                setIsAdmin(parsed.isAdmin || parsed.isSuperAdmin || false);
                setIsSuperAdmin(parsed.isSuperAdmin || false);
                setIsAdminDetails(parsed);
            } catch {
                setIsAdminDetails(null);
            }
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: t("dashboard"), icon: FiHome, path: "/admin" },
        { name: "Manage Committees", icon: FiLayers, path: "/admin/manage-committie" },
        { name: "Create Committee", icon: FiPlusSquare, path: "/admin/create" },
        { name: "Identity Verification", icon: FiShield, path: "/admin/verify-identities" },
        { name: "Member Pool", icon: FiGrid, path: "/admin/all-members" },
        { name: "Add to Committee", icon: FiLink, path: "/admin/assign-member" },
        { name: "Broadcaster", icon: FiActivity, path: "/admin/announcement" },
        { name: "Notifications", icon: FiBell, path: "/admin/notifications" },
        { name: "Inbox Messages", icon: FiMessageSquare, path: "/admin/inbox" },
        { name: "My Profile", icon: FiUser, path: "/admin/profile" },
        { name: "Audit Logs", icon: FiActivity, path: "/admin/logs" },
        ...(isSuperAdmin ? [
            { name: "Create Organizer", icon: FiUserPlus, path: "/admin/add-admin" },
            { name: "Approvals", icon: FiShield, path: "/admin/approvals" },
            { name: "System Control", icon: FiWind, path: "/admin/theme" },
        ] : []),
    ];

    const bottomTabs = [
        { name: "Home", icon: FiHome, path: "/admin" },
        { name: "Pools", icon: FiLayers, path: "/admin/manage-committie" },
        { name: "Verify", icon: FiShield, path: "/admin/verify-identities" },
        { name: "Create", icon: FiPlusSquare, path: "/admin/create" },
        { name: "Menu", icon: FiGrid, isMenu: true },
    ];

    const handleLogout = () => {
        localStorage.clear();
        router.push("/admin/login");
        setTimeout(() => {
            window.location.reload();
        }, 800);
    };

    const isActive = (path) => pathname === path;

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans selection:bg-primary-500/30 pb-20 md:pb-0 ${isRTL ? "font-urdu" : ""}`}>
            {/* Mobile Top Header */}
            <div className={`md:hidden flex items-center justify-between p-4 sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm" : "bg-transparent"}`}>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/admin")}>
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                        <FiShield size={18} />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Committie<span className="text-primary-600">App</span></h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLanguage(language === "en" ? "ur" : "en")}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-tighter"
                    >
                        {language === "en" ? "اردو" : "EN"}
                    </button>
                    <button
                        onClick={() => router.push("/admin/profile")}
                        className="w-8 h-8 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center font-black text-xs"
                    >
                        {isAdminDetails?.name ? isAdminDetails.name.substring(0, 2).toUpperCase() : <FiUser size={16} />}
                    </button>
                </div>
            </div>

            {/* Desktop Sidebar */}
            {isAdminDetails && (
                <aside
                    className={`
                        fixed md:sticky top-0 ${isRTL ? "right-0" : "left-0"} h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
                        z-[60] transition-all duration-500 ease-in-out transform 
                        ${isSidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full md:translate-x-0" : "-translate-x-full md:translate-x-0"}
                        md:shadow-none shadow-2xl hidden md:block
                    `}
                >
                    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
                        {/* Brand */}
                        <div className="p-8 hidden md:block">
                            <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => router.push("/admin")}>
                                <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                                    <FiShield size={22} />
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    Committie<span className="text-primary-600">App</span>
                                </h1>
                            </div>
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">{t("commandCenter")}</p>
                                </div>
                                <button
                                    onClick={() => setLanguage(language === "en" ? "ur" : "en")}
                                    className="px-2 py-0.5 bg-primary-500/10 text-primary-600 rounded text-[9px] font-black uppercase hover:bg-primary-500/20 transition-colors"
                                >
                                    {language === "en" ? "اردو" : "English"}
                                </button>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`
                                            flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all duration-300 group
                                            ${active
                                                ? "bg-primary-600 text-white shadow-xl shadow-primary-500/20"
                                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl transition-colors ${active ? "bg-white/20" : "bg-transparent group-hover:bg-primary-500/10"}`}>
                                                <Icon size={18} className={active ? "text-white" : "group-hover:text-primary-600"} />
                                            </div>
                                            <span className={`text-sm tracking-tight ${isRTL ? 'text-lg' : ''}`}>{item.name}</span>
                                        </div>
                                        {active && <FiChevronRight className={`opacity-50 ${isRTL ? 'rotate-180' : ''}`} />}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer Actions */}
                        <div className="p-6 mt-auto">
                            <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-black text-xs">
                                        {isAdminDetails?.name ? isAdminDetails.name.substring(0, 2).toUpperCase() : <FiUsers size={18} />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">{isAdminDetails?.name || "Organizer"}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Session Active</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 w-full py-3 text-red-500 bg-red-500/5 hover:bg-red-500/10 dark:hover:bg-red-900/20 rounded-2xl font-black text-xs transition-all uppercase tracking-widest border border-red-500/10"
                                >
                                    <FiLogOut size={14} />
                                    {t("logout")}
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 min-h-screen relative overflow-x-hidden pt-2 md:pt-0">
                <div className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    {children}
                </div>
            </main>

            {/* Mobile Fixed Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] px-3 py-2 flex items-center justify-around">
                {bottomTabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = tab.isMenu ? isMobileMenuOpen : isActive(tab.path);
                    return tab.isMenu ? (
                        <button
                            key="admin-menu-tab"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[60px] transition-all ${isMobileMenuOpen ? "text-primary-600" : "text-slate-500 dark:text-slate-400"}`}
                        >
                            <div className={`p-1.5 rounded-xl ${isMobileMenuOpen ? "bg-primary-600/10" : ""}`}>
                                <Icon size={20} />
                            </div>
                            <span className="text-[10px] font-black tracking-tight mt-0.5">{tab.name}</span>
                        </button>
                    ) : (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[60px] transition-all ${active ? "text-primary-600" : "text-slate-500 dark:text-slate-400"}`}
                        >
                            <div className={`p-1.5 rounded-xl ${active ? "bg-primary-600/10" : ""}`}>
                                <Icon size={20} />
                            </div>
                            <span className="text-[10px] font-black tracking-tight mt-0.5">{tab.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Mobile Full All-Items Menu Sheet */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end animate-in fade-in duration-300">
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-6 animate-in slide-in-from-bottom duration-300">
                        {/* Drag Handle & Close */}
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black">
                                    {isAdminDetails?.name ? isAdminDetails.name.substring(0, 2).toUpperCase() : <FiShield />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase">{isAdminDetails?.name || "Organizer Portal"}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">All Command Tools</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* All Items Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                                            active
                                                ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20"
                                                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                        }`}
                                    >
                                        <Icon size={20} className={active ? "text-white" : "text-primary-600"} />
                                        <span className="text-xs font-black tracking-tight">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Additional Actions */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 px-4 bg-red-500/10 text-red-500 rounded-xl text-xs font-black text-center uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <FiLogOut /> Logout Organizer Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
