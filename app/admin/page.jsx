"use client";

import React, { useEffect, useState } from 'react';
import Committiee from './Committie';
import { FiActivity, FiLayers, FiUsers, FiClock } from 'react-icons/fi';
import Card from '../Components/Theme/Card';

import { useLanguage } from '../Components/LanguageContext';

export default function AmdinPanel() {
    const { t } = useLanguage();
    const [greeting, setGreeting] = useState("Greetings");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    const stats = [
        { label: t("activePools"), value: "12", icon: FiLayers, color: "text-blue-500", bg: "bg-blue-500/5" },
        { label: t("totalMembers"), value: "154", icon: FiUsers, color: "text-indigo-500", bg: "bg-indigo-500/5" },
        { label: t("pendingApprovals"), value: "8", icon: FiClock, color: "text-amber-500", bg: "bg-amber-500/5" },
        { label: t("systemHealth"), value: "99.9%", icon: FiActivity, color: "text-green-500", bg: "bg-green-500/5" },
    ];

    return (
        <div className="space-y-10 p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
                        <FiActivity className="animate-pulse" /> {t("infrastructureOverview")}
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {greeting}, <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">{t("commander")}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg italic">
                        Welcome to your dashboard. Manage your committees and members easily.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl shadow-premium border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Network Secure</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className={`p-6 border-none hover:-translate-y-1 transition-transform cursor-pointer group ${stat.bg}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("liveFeed")}</span>
                        </div>
                        <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                    </Card>
                ))}
            </div>

            {/* Main Interface */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <Committiee />
            </div>
        </div>
    )
}
