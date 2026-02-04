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
    FiActivity
} from "react-icons/fi";

import { useLanguage } from "../Components/LanguageContext";
import { checkerForAddAdmin } from "../utils/commonFunc";

export default function AdminLayout({ children }) {
    const { t, language, setLanguage, isRTL } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const adminData = localStorage.getItem("admin_detail");
        if (adminData) {
            setIsAdmin(checkerForAddAdmin(JSON.parse(adminData)));
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: t("dashboard"), icon: FiHome, path: "/admin" },
        ...(isAdmin ? [{ name: t("createOrganizer"), icon: FiUserPlus, path: "/admin/add-admin" }] : []),
        { name: t("createPool"), icon: FiPlusSquare, path: "/admin/create" },
        { name: t("memberRegistry"), icon: FiUsers, path: "/admin/members" },
        { name: t("committeeHub"), icon: FiGrid, path: "/admin/assign-member" },
        { name: t("broadcaster"), icon: FiBell, path: "/admin/announcement" },
        ...(isAdmin ? [{ name: "Audit Logs", icon: FiActivity, path: "/admin/logs" }] : []),
    ];

    const handleLogout = () => {
        localStorage.clear();
        router.push("/admin/login");
    };

    const isActive = (path) => pathname === path;

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans selection:bg-primary-500/30 ${isRTL ? "font-urdu" : ""}`}>
            {/* Mobile Header */}
            <div className={`md:hidden flex items-center justify-between p-4 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm" : "bg-transparent"}`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                        <FiShield size={18} />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Committie<span className="text-primary-600">App</span></h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLanguage(language === "en" ? "ur" : "en")}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-tighter"
                    >
                        {language === "en" ? "اردو" : "EN"}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-transform active:scale-95"
                    >
                        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 ${isRTL ? "right-0" : "left-0"} h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
                    z-[60] transition-all duration-500 ease-in-out transform 
                    ${isSidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full md:translate-x-0" : "-translate-x-full md:translate-x-0"}
                    md:shadow-none shadow-2xl
                `}
            >
                <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
                    {/* Brand */}
                    <div className="p-8 hidden md:block">
                        <div className="flex items-center gap-3 mb-2">
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
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group
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

                    {/* Actions */}
                    <div className="p-6 mt-auto">
                        <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                    <FiUsers size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t("commander")}</p>
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

            {/* Main Content */}
            <main className="flex-1 min-h-screen relative overflow-x-hidden pt-4 md:pt-0">
                <div className=" max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    {children}
                </div>
            </main>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[55] md:hidden transition-opacity animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
