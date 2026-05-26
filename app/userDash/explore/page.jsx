"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiLayers, FiDollarSign, FiCalendar, FiUsers, FiPlusCircle, FiShield, FiTrendingUp } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import EmptyState from "../../Components/Theme/EmptyState";
import SectionHeader from "../../Components/Theme/SectionHeader";
import StatusPill from "../../Components/Theme/StatusPill";
import { formatMoney } from "../../utils/commonFunc";
import { toast } from "react-toastify";
import { useLanguage } from "../../Components/LanguageContext";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
    const { t } = useLanguage();
    const [committees, setCommittees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("member");
        if (userData) {
            setUserId(JSON.parse(userData)._id);
        }
        fetchOpenCommittees();
    }, []);

    const fetchOpenCommittees = async () => {
        try {
            const res = await fetch("/api/committee/open");
            if (res.ok) {
                const data = await res.json();
                setCommittees(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRequest = async (committeeId) => {
        setJoining(committeeId);
        try {
            // Check auth again
            const userData = localStorage.getItem("member");
            if (!userData) {
                toast.error("Please login first");
                return;
            }
            const uid = JSON.parse(userData)._id;
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/committee/${committeeId}/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ memberId: uid })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Request submitted successfully!");
            } else {
                toast.info(data.error);
            }
        } catch (err) {
            toast.error("Failed to request join");
        } finally {
            setJoining(null);
        }
    };

    if (loading) return <div className="p-10 text-center uppercase font-black tracking-widest animate-pulse">Scanning Network...</div>;
    const router = useRouter();
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="dashboard-shell overflow-hidden p-8 md:p-10">
                <div className="absolute inset-y-0 right-0 w-72 bg-gradient-to-l from-primary-500/10 via-sky-500/5 to-transparent" />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.5fr_0.85fr]">
                    <SectionHeader
                        eyebrow="Market Discovery"
                        icon={FiSearch}
                        title="Find the next trustworthy saving circle before the best seats close."
                        description="Browse open committees with clearer financial context, stronger trust cues, and faster access to the flows that matter."
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="metric-tile">
                            <p className="eyebrow">Open committees</p>
                            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{committees.length}</p>
                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">See live opportunities with active organizer oversight.</p>
                        </div>
                        <div className="metric-tile">
                            <p className="eyebrow">Risk posture</p>
                            <p className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Proof-first</p>
                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">Every strong circle shows clearer payment discipline and trust controls.</p>
                        </div>
                    </div>
                </div>
            </div>

            {committees.length === 0 ? (
                <EmptyState
                    icon={FiLayers}
                    title="No Open Pools"
                    description="There are no live openings right now. New committees will appear here as organizers publish fresh monthly cycles."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {committees.map((c) => (
                        <Card key={c._id} className="group p-0 overflow-hidden border-none shadow-premium hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900">
                            <div className="p-8 space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Open for Enrollment</span>
                                    </div>
                                    <h3 className=" cursor-pointer text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-primary-600 transition-colors"
                                        onClick={() => { router.push('/userDash/committee/' + c._id) }}
                                    >{c.name}</h3>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 h-10 italic">{c.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    <StatusPill tone="info"><FiTrendingUp size={12} /> Structured cycle</StatusPill>
                                    <StatusPill tone={c.requireDocuments ? "warning" : "success"}>
                                        <FiShield size={12} /> {c.requireDocuments ? "Screened entry" : "Fast onboarding"}
                                    </StatusPill>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Monthly</p>
                                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black">
                                            <FiDollarSign size={12} className="text-primary-500" /> {formatMoney(c.monthlyAmount)}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Duration</p>
                                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black">
                                            <FiCalendar size={12} className="text-primary-500" /> {c.monthDuration} Mo
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><FiUsers /> {c.members.length} / {c.maxMembers} Filled</span>
                                    <StatusPill tone={c.maxMembers - c.members.length > 3 ? "success" : "warning"}>
                                        {c.maxMembers - c.members.length} seats left
                                    </StatusPill>
                                </div>

                                <Button
                                    onClick={() => handleJoinRequest(c._id)}
                                    loading={joining === c._id}
                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white font-black uppercase text-[10px] tracking-widest shadow-xl"
                                >
                                    {joining === c._id ? "Sending Request..." : "Request to Join"} <FiPlusCircle className="ml-2" />
                                </Button>
                            </div>
                            <FiLayers size={180} className="absolute -bottom-10 -right-10 text-black/5 dark:text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
