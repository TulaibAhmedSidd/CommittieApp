"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiShield, FiUser, FiCheck, FiX, FiExternalLink, FiImage, FiMapPin } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import { toast } from "react-toastify";
import MemberDocumentReview from "../../Components/Admin/MemberDocumentReview";

export default function IdentityVerificationPage() {
    const [requests, setRequests] = useState({ admins: [], members: [] });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const adminDetail = localStorage.getItem("admin_detail");
        if (!adminDetail) {
            router.push("/admin/login");
            return;
        }
        fetchRequests(JSON.parse(adminDetail)._id);
    }, [router]);

    const fetchRequests = async (adminId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch(`/api/admin/verify?adminId=${adminId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.admins && data.members) {
                setRequests(data);
            } else {
                setRequests({ admins: [], members: [] });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch verification requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId, status, role) => {
        setActionLoading(userId);
        try {
            const token = localStorage.getItem("admin_token");
            const res = await fetch("/api/admin/verify", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId, role: role || 'Member', status })
            });

            if (res.ok) {
                toast.success(`Identity ${status === 'verified' ? 'Verified' : 'Rejected'}`);
                const adminDetail = JSON.parse(localStorage.getItem("admin_detail"));
                fetchRequests(adminDetail._id);
            }
        } catch (err) {
            toast.error("Process failed");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse font-black uppercase tracking-widest text-slate-400">Syncing Identity Records...</div>;

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="space-y-2">
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                    Identity <span className="text-primary-600">Verification</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Verify NIC and authorize Blue Tick trust badges</p>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* Combined Queue */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-blue-500 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Pending Verifications</h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {[...requests.admins.map(a => ({ ...a, role: 'Admin' })), ...requests.members.map(m => ({ ...m, role: 'Member' }))].map((user) => (
                            <Card key={user._id} className="p-8 border-none bg-white dark:bg-slate-900 shadow-premium">
                                <MemberDocumentReview
                                    member={user}
                                    onAction={handleAction}
                                    actionLoading={actionLoading}
                                />
                            </Card>
                        ))}

                        {requests.admins.length === 0 && requests.members.length === 0 && (
                            <div className="col-span-full py-20 text-center space-y-4">
                                <div className="flex justify-center text-slate-200">
                                    <FiShield size={64} />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">All identities are synchronized. No pending verifications.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
