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
    FiSearch,
    FiMapPin,
    FiHelpCircle,
    FiLayers
} from "react-icons/fi";

export default function UserLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("member");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch {
                setUser(null);
            }
        }

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "My Dashboard", icon: FiHome, path: "/userDash", urdu: "ڈیش بورڈ" },
        { name: "Explore Pools", icon: FiSearch, path: "/userDash/explore", urdu: "دریافت کریں" },
        { name: "Near Me", icon: FiMapPin, path: "/userDash/near-me", urdu: "میرے قریب" },
        { name: "My Committees", icon: FiLayers, path: "/userDash?view=my", urdu: "میری کمیٹیاں" },
        { name: "Identity & KYC", icon: FiShield, path: "/userDash/profile", urdu: "شناختی تصدیق" },
        { name: "Inbox & Alerts", icon: FiBell, path: "/userDash/inbox", urdu: "پیغامات" },
        { name: "User Guide", icon: FiHelpCircle, path: "/guide/member", urdu: "گائیڈ" },
    ];

    const bottomTabs = [
        { name: "Home", icon: FiHome, path: "/userDash" },
        { name: "Explore", icon: FiSearch, path: "/userDash/explore" },
        { name: "Near Me", icon: FiMapPin, path: "/userDash/near-me" },
        { name: "Inbox", icon: FiBell, path: "/userDash/inbox" },
        { name: "Menu", icon: FiGrid, isMenu: true },
    ];

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    const isActive = (path) => pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans selection:bg-primary-500/30 pb-20 md:pb-0">
            {/* Mobile Top Header */}
            <div className={`md:hidden flex items-center justify-between p-4 sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm" : "bg-transparent"}`}>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/userDash")}>
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                        <FiActivity size={18} />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Committie<span className="text-primary-600">App</span></h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/userDash/profile")}
                        className="w-9 h-9 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center font-black text-xs"
                    >
                        {user?._id ? user.name.substring(0, 2).toUpperCase() : <FiUser size={16} />}
                    </button>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
                    z-[60] transition-all duration-500 ease-in-out transform 
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    md:shadow-none shadow-2xl hidden md:block
                `}
            >
                <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
                    {/* Brand */}
                    <div className="p-8 hidden md:block">
                        <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => router.push("/userDash")}>
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
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">{user?.name || "Member"}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <FiShield size={10} className="text-green-500" />
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Verified Profile</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                        <div className="px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant Center</div>
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
                            key="menu-tab"
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
                                    {user?._id ? user.name.substring(0, 2).toUpperCase() : <FiUser />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase">{user?.name || "Member Portal"}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">All Features & Navigation</p>
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
                                        <div className="flex items-center justify-between">
                                            <Icon size={20} className={active ? "text-white" : "text-primary-600"} />
                                            <span className="text-[10px] font-black opacity-60 font-urdu">{item.urdu}</span>
                                        </div>
                                        <span className="text-xs font-black tracking-tight">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Additional Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                            <Link
                                href="/userDash/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full py-3 px-4 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-black text-center uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <FiShield /> Update Verification Documents
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 px-4 bg-red-500/10 text-red-500 rounded-xl text-xs font-black text-center uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <FiLogOut /> Exit Member Portal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
