"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUserCheck, FiUserX, FiTarget, FiBriefcase, FiUser, FiInfo } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import { toast } from "react-toastify";

export default function ApprovalsPage() {
    const [approvals, setApprovals] = useState({ admins: [], members: [] });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const adminDetail = localStorage.getItem("admin_detail");
        if (!adminDetail) {
            router.push("/admin/login");
            return;
        }
        const admin = JSON.parse(adminDetail);
        if (!admin.isSuperAdmin) {
            router.push("/admin");
            return;
        }
        fetchPending();
    }, [router]);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/approvals");
            const data = await res.json();
            setApprovals(data);
        } catch (err) {
            toast.error("Failed to fetch pending requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId, role, action) => {
        setActionLoading(userId);
        try {
            const res = await fetch("/api/admin/approvals", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role, action })
            });

            if (!res.ok) throw new Error("Action failed");

            toast.success(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
            fetchPending();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest animate-pulse">
            Establishing Secure Connection...
        </div>
    );

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Command <span className="text-primary-600">Approvals</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Authorize fresh entities into the ecosystem</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Organizers Queue */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-600/10 text-primary-600 rounded-2xl">
                            <FiBriefcase size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Organizers Queue</h2>
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black">{approvals.admins.length}</span>
                    </div>

                    <div className="space-y-4">
                        {approvals.admins.length === 0 ? (
                            <div className="p-12 bg-slate-100 dark:bg-slate-900/50 rounded-[2rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No pending organizers</p>
                            </div>
                        ) : (
                            approvals.admins.map(admin => (
                                <Card key={admin._id} className="p-8 border-none shadow-premium-hover bg-white dark:bg-slate-900 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <FiBriefcase size={120} />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{admin.name}</h3>
                                            <p className="text-sm text-primary-600 font-bold font-mono">{admin.email}</p>
                                        </div>
                                        <div className="flex gap-3 w-full md:w-auto">
                                            <Button
                                                onClick={() => handleAction(admin._id, "Admin", "approve")}
                                                loading={actionLoading === admin._id}
                                                className="flex-1 md:flex-none py-3 px-6 bg-green-600 hover:bg-green-700 shadow-green-500/20"
                                            >
                                                <FiUserCheck className="mr-2" /> Approve
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleAction(admin._id, "Admin", "reject")}
                                                className="flex-1 md:flex-none py-3 px-6 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
                                            >
                                                <FiUserX className="mr-2" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                {/* Members Queue */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl">
                            <FiUser size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Members Queue</h2>
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black">{approvals.members.length}</span>
                    </div>

                    <div className="space-y-4">
                        {approvals.members.length === 0 ? (
                            <div className="p-12 bg-slate-100 dark:bg-slate-900/50 rounded-[2rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No pending members</p>
                            </div>
                        ) : (
                            approvals.members.map(member => (
                                <Card key={member._id} className="p-8 border-none shadow-premium-hover bg-white dark:bg-slate-900 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <FiUser size={120} />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{member.name}</h3>
                                            <p className="text-sm text-blue-600 font-bold font-mono">{member.email}</p>
                                        </div>
                                        <div className="flex gap-3 w-full md:w-auto">
                                            <Button
                                                onClick={() => handleAction(member._id, "Member", "approve")}
                                                loading={actionLoading === member._id}
                                                className="flex-1 md:flex-none py-3 px-6 bg-primary-600 hover:bg-primary-700 shadow-primary-500/20"
                                            >
                                                <FiUserCheck className="mr-2" /> Approve
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleAction(member._id, "Member", "reject")}
                                                className="flex-1 md:flex-none py-3 px-6 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
                                            >
                                                <FiUserX className="mr-2" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex items-center gap-4">
                <FiInfo className="text-amber-500" size={24} />
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-relaxed">
                    Security Protocol: Actions on this page are permanent. Approving a user grants full access to their respective dashboard.
                </p>
            </div>
        </div>
    );
}
