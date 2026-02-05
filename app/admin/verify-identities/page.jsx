"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiShield, FiUser, FiCheck, FiX, FiExternalLink, FiImage, FiMapPin } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import { toast } from "react-toastify";

export default function IdentityVerificationPage() {
    const [requests, setRequests] = useState({ admins: [], members: [] });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
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
            const res = await fetch(`/api/admin/verify?adminId=${adminId}`);
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            toast.error("Failed to fetch verification requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId, role, status) => {
        setActionLoading(userId);
        try {
            const res = await fetch("/api/admin/verify", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role, status })
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...requests.admins.map(a => ({ ...a, role: 'Admin' })), ...requests.members.map(m => ({ ...m, role: 'Member' }))].map((user) => (
                            <Card key={user._id} className="p-6 border-none bg-white dark:bg-slate-900 shadow-premium flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 font-black">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                                {user.name}
                                                <span className={`text-[8px] px-2 py-0.5 rounded-full ${user.role === 'Admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {user.role}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-slate-500 font-mono italic">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIC Number</p>
                                        <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">{user.nicNumber}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <FiMapPin size={10} /> Location
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">{user.city}, {user.country}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <FiImage size={10} /> Document
                                        </p>
                                        <button
                                            onClick={() => setSelectedImage(user.nicImage)}
                                            className="text-[10px] font-black text-primary-600 uppercase hover:underline flex items-center gap-1"
                                        >
                                            View NIC <FiExternalLink size={10} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleAction(user._id, user.role, 'verified')}
                                        loading={actionLoading === user._id}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <FiCheck size={14} className="mr-2" /> Approve & Verify
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleAction(user._id, user.role, 'unverified')}
                                        className="flex-1 bg-red-500/10 text-red-500 border-red-500/20 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white"
                                    >
                                        <FiX size={14} className="mr-2" /> Reject
                                    </Button>
                                </div>
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

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full">
                        <img
                            src={selectedImage}
                            alt="NIC"
                            className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white/10"
                        />
                        <button className="absolute -top-12 right-0 text-white font-black uppercase tracking-widest flex items-center gap-2">
                            Close Preview <FiX size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
