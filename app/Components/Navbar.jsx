"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiShield, FiUser, FiHome, FiBell, FiLogOut } from "react-icons/fi";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
    const { t, language, setLanguage, isRTL } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ur" : "en");
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        router.push("/login");
    };

    // Don't show this navbar on admin pages as they have their own layout
    if (pathname.startsWith("/admin")) return null;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
            ? "py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-premium border-b border-slate-200 dark:border-slate-800"
            : "py-6 bg-transparent"
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                        <FiShield size={22} />
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Committie<span className="text-primary-600">App</span>
                    </span>
                </Link>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-8">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === "en"
                                ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage("ur")}
                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${language === "ur"
                                ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            اردو
                        </button>
                    </div>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <Link href="/userDash" className={`text-xs font-black uppercase tracking-widest transition-colors ${pathname === "/userDash" ? "text-primary-600" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}>
                                {t("dashboard")}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-red-500/10"
                            >
                                <FiLogOut /> {t("logout")}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:text-primary-600 font-black uppercase text-[10px] tracking-widest transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-8 py-3 bg-primary-600 text-white hover:scale-105 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20"
                            >
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="lg:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-tighter"
                    >
                        {language === "en" ? "اردو" : "EN"}
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`
                lg:hidden absolute top-full left-4 right-4 mt-2 p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800
                transition-all duration-500 ease-in-out origin-top
                ${isMenuOpen ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"}
            `}>
                <div className="flex flex-col gap-4">
                    {isLoggedIn && (
                        <Link
                            href="/userDash"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-600 dark:text-white"
                        >
                            <FiHome size={18} /> {t("dashboard")}
                        </Link>
                    )}

                    {isLoggedIn ? (
                        <button
                            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                            className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl font-black uppercase text-xs tracking-widest text-red-600"
                        >
                            <FiLogOut size={18} /> {t("logout")}
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-600 dark:text-white justify-center"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 p-4 bg-primary-600 rounded-2xl font-black uppercase text-xs tracking-widest text-white justify-center shadow-lg shadow-primary-500/20"
                            >
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
