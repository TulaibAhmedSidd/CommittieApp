"use client";

import React, { useEffect, useState } from "react";
import { FiCopy, FiUsers, FiShield, FiTrendingUp, FiGift } from "react-icons/fi";
import Card from "./Theme/Card";
import Button from "./Theme/Button";
import { toast } from "react-toastify";

export default function ReferralCenter({ adminId }) {
    const [referralData, setReferralData] = useState({
        referralCode: "",
        referralScore: 0,
        memberCount: 0,
        adminCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (adminId) fetchReferralData();
    }, [adminId]);

    const fetchReferralData = async () => {
        try {
            const res = await fetch(`/api/admin/referral?adminId=${adminId}`);
            if (res.ok) {
                const data = await res.json();
                setReferralData(data);
            }
        } catch (err) {
            console.error("Failed to fetch referral data", err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const link = `${window.location.origin}/register?ref=${referralData.referralCode}`;
        navigator.clipboard.writeText(link);
        toast.info("Referral link copied to clipboard!");
    };

    if (loading) return <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
                <Card className="flex-1 p-8 bg-gradient-to-br from-primary-600 to-indigo-700 border-none text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Your Ambassador Program</p>
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic">Referral Center</h3>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-between gap-4 border border-white/20">
                            <code className="font-mono font-black text-lg tracking-wider">{referralData.referralCode || "NOT_GENERATED"}</code>
                            <Button onClick={copyToClipboard} size="sm" className="bg-white text-primary-600 hover:bg-white/90 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                                <FiCopy className="mr-2" /> Copy Link
                            </Button>
                        </div>
                        <p className="text-[10px] text-white/60 font-medium italic">Share your link to onboard new members and organizers into your network.</p>
                    </div>
                    <FiGift size={180} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12" />
                </Card>

                <div className="md:w-72 grid grid-cols-1 gap-4">
                    <Card className="p-6 border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-4">
                            <FiTrendingUp size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Score</p>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{referralData.referralScore}</h4>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 border-none bg-slate-50 dark:bg-slate-900/50 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <FiUsers size={32} />
                    </div>
                    <div>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{referralData.memberCount}</h4>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Members Onboarded</p>
                        <div className="mt-2 w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full w-[40%]" />
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-none bg-slate-50 dark:bg-slate-900/50 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <FiShield size={32} />
                    </div>
                    <div>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{referralData.adminCount}</h4>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Organizers Onboarded</p>
                        <div className="mt-2 w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[25%]" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
