"use client";

import React, { useEffect, useState } from 'react';
import Committiee from './Committie';
import { FiActivity, FiLayers, FiUsers, FiClock } from 'react-icons/fi';
import Card from '../Components/Theme/Card';
import SectionHeader from '../Components/Theme/SectionHeader';
import StatusPill from '../Components/Theme/StatusPill';

import { useLanguage } from '../Components/LanguageContext';

export default function AmdinPanel() {
    const { t } = useLanguage();
    const [greeting, setGreeting] = useState("Greetings");
    const [statsData, setStatsData] = useState({
        activeCommittees: "0",
        totalMembers: "0",
        pendingApprovals: "0",
        systemStatus: "Operational"
    });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting(t("goodMorning"));
        else if (hour < 18) setGreeting(t("goodAfternoon"));
        else setGreeting(t("goodEvening"));

        const adminDetail = localStorage.getItem("admin_detail");
        if (adminDetail) {
            const admin = JSON.parse(adminDetail);
            fetchStats(admin._id);
        }
    }, []);

    const fetchStats = async (adminId) => {
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/admin/stats?adminId=${adminId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStatsData({
                    activeCommittees: data.activeCommittees.toString(),
                    totalMembers: data.totalMembers.toString(),
                    pendingApprovals: data.pendingApprovals.toString(),
                    systemStatus: data.systemStatus
                });
            }
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

    const stats = [
        { label: t("activePools"), value: statsData.activeCommittees, icon: FiLayers, color: "text-blue-500", bg: "bg-blue-500/5" },
        { label: t("totalMembers"), value: statsData.totalMembers, icon: FiUsers, color: "text-indigo-500", bg: "bg-indigo-500/5" },
        { label: t("pendingApprovals"), value: statsData.pendingApprovals, icon: FiClock, color: "text-amber-500", bg: "bg-amber-500/5" },
        { label: t("systemStatus"), value: statsData.systemStatus, icon: FiActivity, color: "text-green-500", bg: "bg-green-500/5" },
    ];

    return (
        <div className="space-y-10 p-8">
            {/* Header Section */}
            <div className="dashboard-shell overflow-hidden p-8 md:p-10">
                <div className="absolute inset-y-0 right-0 w-72 bg-gradient-to-l from-primary-500/10 via-sky-500/5 to-transparent" />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
                    <SectionHeader
                        eyebrow={t("infrastructureOverview")}
                        icon={FiActivity}
                        title={<>{greeting}, <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">{t("commander")}</span></>}
                        description={t("welcomeToYourDashboard")}
                    />
                    <Card className="border-none bg-slate-950 text-white shadow-[0_28px_70px_-34px_rgba(15,23,42,0.75)] dark:bg-slate-900">
                        <div className="space-y-5 p-1">
                            <StatusPill tone="success" className="w-fit border-white/10 bg-white/10 text-white">
                                Network secure
                            </StatusPill>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live committees</p>
                                    <p className="mt-2 text-2xl font-black">{statsData.activeCommittees}</p>
                                </div>
                                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pending action</p>
                                    <p className="mt-2 text-2xl font-black">{statsData.pendingApprovals}</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium leading-6 text-slate-300">
                                Keep committee creation, approvals, and payout operations visible from one organizer command surface.
                            </p>
                        </div>
                    </Card>
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
                            <StatusPill tone="info">{t("liveFeed")}</StatusPill>
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
