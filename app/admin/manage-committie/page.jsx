"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiEdit3, FiTrash2, FiUsers, FiDollarSign, FiCalendar, FiActivity, FiLayers, FiInfo, FiMoreVertical, FiCheckCircle, FiChevronRight } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import { toast } from "react-toastify";
import moment from "moment";
import { formatMoney } from "@/app/utils/commonFunc";
import { useLanguage } from "../../Components/LanguageContext";

export default function ManageCommittiePage() {
    const { t } = useLanguage();
    const [committees, setCommittees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });
    const router = useRouter();

    useEffect(() => {
        const adminDetail = localStorage.getItem("admin_detail");
        if (!adminDetail) {
            router.push("/admin/login");
            return;
        }
        setCurrentAdmin(JSON.parse(adminDetail));
    }, [router]);

    useEffect(() => {
        if (currentAdmin?._id) {
            fetchCommittees();
        }
    }, [currentAdmin, page]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (currentAdmin?._id) fetchCommittees();
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const fetchCommittees = async () => {
        try {
            const res = await fetch(`/api/committee?adminId=${currentAdmin._id}&page=${page}&limit=10&q=${search}`);
            const data = await res.json();
            setCommittees(data.committees || []);
            setPagination(data.pagination || { total: 0, pages: 1, page: 1 });
        } catch (err) {
            toast.error("Failed to load committees");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to decommission this pool?")) return;
        try {
            const res = await fetch(`/api/committee?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setCommittees(committees.filter(c => c._id !== id));
                toast.success("Committee decommissioned successfully");
            }
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    const filteredCommittees = committees.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c._id.includes(search)
    );

    if (loading) return <div className="p-12 text-center animate-pulse">Syncing Operational Pools...</div>;

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Manage <span className="text-primary-600">Committees</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Full control over your financial circuits</p>
                </div>
                <div className="w-full md:w-96">
                    <Input
                        icon={<FiSearch />}
                        placeholder="Filter by Pool Identity or UID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] shadow-premium border border-slate-100 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pool Identity</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cycle Status</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Participation</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Monthly Pulse</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {committees.length > 0 ? committees.map((c) => (
                            <tr key={c._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-6">
                                    <div className="space-y-1">
                                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{c.name}</p>
                                        <p className="text-[10px] text-primary-600 font-bold tracking-[0.2em]">UID://{c._id.substring(c._id.length - 8)}</p>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-primary-500'}`} />
                                        {c.status}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <FiUsers className="text-slate-400" />
                                        <span className="text-sm font-black text-slate-600 dark:text-slate-300">{c.members?.length || 0} / {c.maxMembers}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">RS {formatMoney(c.monthlyAmount)}</p>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => router.push(`/admin/manage?id=${c._id}`)}
                                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none hover:bg-primary-600 hover:text-white transition-all"
                                        >
                                            Detailed Manage
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => router.push(`/admin/edit?id=${c._id}`)}
                                            className="p-3 text-slate-400 hover:text-primary-600 border-none"
                                        >
                                            <FiEdit3 />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleDelete(c._id)}
                                            className="p-3 text-slate-400 hover:text-red-500 border-none"
                                        >
                                            <FiTrash2 />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center">
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">No matching financial circuits found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-6 pt-4">
                    <Button
                        variant="secondary"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-8 py-3 text-[10px] font-black uppercase tracking-widest"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Page</span>
                        <span className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-primary-500/20">{page}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase">of {pagination.pages}</span>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                        className="px-8 py-3 text-[10px] font-black uppercase tracking-widest"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
