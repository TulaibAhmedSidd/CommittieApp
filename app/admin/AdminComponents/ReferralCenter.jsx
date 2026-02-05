"use client";

import React, { useEffect, useState } from "react";
import { FiLink, FiCopy, FiTrendingUp, FiShare2, FiZap } from "react-icons/fi";
import Card from "@/app/Components/Theme/Card";
import Button from "@/app/Components/Theme/Button";
import { toast } from "react-toastify";

export default function ReferralCenter() {
    const [referralData, setReferralData] = useState({ referralCode: "", referralScore: 0 });
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchReferralInfo();
    }, []);

    const fetchReferralInfo = async () => {
        try {
            const adminDetail = localStorage.getItem("admin_detail");
            const admin = adminDetail ? JSON.parse(adminDetail) : null;
            if (!admin) return;

            const res = await fetch(`/api/admin/referral?adminId=${admin._id}`);
            const data = await res.json();
            setReferralData(data);
        } catch (err) {
            console.error("Failed to fetch referral info");
        } finally {
            setLoading(false);
        }
    };

    const generateCode = async () => {
        setGenerating(true);
        try {
            const adminDetail = localStorage.getItem("admin_detail");
            const admin = adminDetail ? JSON.parse(adminDetail) : null;

            const res = await fetch("/api/admin/referral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminId: admin?._id })
            });

            const data = await res.json();
            if (data.referralCode) {
                setReferralData(prev => ({ ...prev, referralCode: data.referralCode }));
                toast.success("Referral Code Generated!");
            }
        } catch (err) {
            toast.error("Failed to generate code");
        } finally {
            setGenerating(false);
        }
    };

    const copyLink = () => {
        const link = `${window.location.origin}/register?ref=${referralData.referralCode}`;
        navigator.clipboard.writeText(link);
        toast.info("Referral Link Copied!");
    };

    if (loading) return null;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Performance Stats */}
                <Card className="p-8 bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-none relative overflow-hidden h-full">
                    <div className="relative z-10 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Network Pulse</p>
                        <h3 className="text-5xl font-black tracking-tighter">{referralData.referralScore}</h3>
                        <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Total Influence Score</p>
                    </div>
                    <FiTrendingUp className="absolute bottom-[-20px] right-[-20px] text-white/10" size={180} />
                </Card>

                {/* Conversion Breakdown */}
                <Card className="p-8 space-y-6 flex flex-col justify-center border-slate-100 dark:border-slate-800">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{referralData.memberCount || 0}</h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Members Onboarded</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <FiUsers size={20} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{referralData.adminCount || 0}</h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Organizers Onboarded</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <FiZap size={20} />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Generator Card */}
                <Card className="p-8 space-y-6 flex flex-col justify-center border-slate-100 dark:border-slate-800">
                    <div className="space-y-2">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Referral Matrix</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                            Share your link to architect your organization.
                        </p>
                    </div>

                    {!referralData.referralCode ? (
                        <Button onClick={generateCode} loading={generating} className="w-full py-4 uppercase font-black tracking-widest text-xs">
                            Generate Referral Identity <FiZap className="ml-2" />
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <code className="flex-1 font-mono text-xs font-bold text-primary-600">{referralData.referralCode}</code>
                                <button onClick={copyLink} className="p-2 text-slate-500 hover:text-primary-600 transition-colors">
                                    <FiCopy size={18} />
                                </button>
                            </div>
                            <Button onClick={copyLink} className="w-full py-4 shadow-xl shadow-primary-500/20">
                                Copy Invite Link <FiShare2 className="ml-2" />
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex items-center gap-4">
                <FiZap className="text-amber-500" size={24} />
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-relaxed">
                    Referral Protocol: High-performing organizers with high referral scores are eligible for priority committee listing and platform rewards.
                </p>
            </div>
        </div>
    );
}
