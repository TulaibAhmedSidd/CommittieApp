"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    FiHome,
    FiGrid,
    FiBell,
    FiLogOut,
    FiMenu,
    FiX,
    FiUser,
    FiActivity,
    FiShield,
    FiChevronRight,
    FiCreditCard,
    FiSearch
} from "react-icons/fi";

export default function UserLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("member");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "My Activity", icon: FiHome, path: "/userDash" },
        { name: "Near Me", icon: FiUser, path: "/userDash/near-me" },
        { name: "Explore", icon: FiSearch, path: "/userDash/explore" },
        { name: "Verified Member", icon: FiShield, path: "/userDash?view=verification" },
        { name: "Committee Participation", icon: FiGrid, path: "/userDash?view=my" },
        { name: "Inbox / Alerts", icon: FiBell, path: "/userDash#notifications" },
        { name: "My Profile", icon: FiUser, path: "/userDash/profile" },
    ];

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login"); // Member login
    };

    const isActive = (path) => pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans selection:bg-primary-500/30">
            {/* Mobile Header */}
            <div className={`md:hidden flex items-center justify-between p-4 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm" : "bg-transparent"}`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                        <FiActivity size={18} />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Committie<span className="text-primary-600">App</span></h1>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-transform active:scale-95"
                >
                    {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
                    z-[60] transition-all duration-500 ease-in-out transform 
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    md:shadow-none shadow-2xl
                `}
            >
                <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
                    {/* Brand */}
                    <div className="p-8 hidden md:block">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                                <FiActivity size={22} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Committie<span className="text-primary-600">App</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">Member Access</p>
                        </div>
                    </div>

                    {/* Member Profile Card */}
                    <Link href="/userDash/profile" className="px-6 mb-4 block">
                        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-premium flex items-center gap-4 group hover:border-primary-500/50 transition-colors">
                            <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                                {user?._id ? user.name.substring(0, 2).toUpperCase() : <FiUser />}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">{user?.name || "Guest Participant"}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <FiShield size={10} className="text-green-500" />
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Verified Profile</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <div className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant Center</div>
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
                                            ? "bg-primary-600 text-white shadow-xl shadow-primary-500/20 translate-x-1"
                                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-colors ${active ? "bg-white/20" : "bg-transparent group-hover:bg-primary-500/10"}`}>
                                            <Icon size={18} className={active ? "text-white" : "group-hover:text-primary-600"} />
                                        </div>
                                        <span className="text-sm tracking-tight">{item.name}</span>
                                    </div>
                                    {active && <FiChevronRight className="opacity-50" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-6 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full py-4 text-red-500 bg-red-500/5 hover:bg-red-500/10 dark:hover:bg-red-900/20 rounded-2xl font-black text-xs transition-all uppercase tracking-widest border border-red-500/10"
                        >
                            <FiLogOut size={14} />
                            Exit Portal
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen relative overflow-x-hidden pt-4 md:pt-0">
                <div className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
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
