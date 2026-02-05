"use client";

import React, { useEffect, useState } from "react";
import ReferralCenter from "../../Components/ReferralCenter";
import { FiTrendingUp, FiZap } from "react-icons/fi";

export default function AdminReferralsPage() {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const detail = localStorage.getItem("admin_detail");
        if (detail) {
            setAdmin(JSON.parse(detail));
        }
    }, []);

    if (!admin) return null;

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
                    <FiZap className="animate-pulse" /> Growth Engine
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                    Ambassador <span className="text-primary-600">Program</span>
                </h1>
                <p className="text-slate-500 font-medium italic max-w-lg">
                    Monitor your network's growth and manage your referral impact.
                </p>
            </div>

            <ReferralCenter adminId={admin._id} />
        </div>
    );
}
