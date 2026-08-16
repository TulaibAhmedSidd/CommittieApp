"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiEdit3, FiTrash2, FiUsers } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import Table from "../../Components/Theme/Table";
import StatusPill from "../../Components/Theme/StatusPill";
import { toast } from "react-toastify";
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

    const columns = [
        {
            key: "name",
            header: "Pool Identity",
            render: (c) => (
                <div className="space-y-1">
                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{c.name}</p>
                    <p className="text-[10px] text-primary-600 font-bold tracking-[0.2em]">UID://{c._id.substring(c._id.length - 8)}</p>
                </div>
            )
        },
        {
            key: "status",
            header: "Cycle Status",
            render: (c) => (
                <StatusPill tone={c.status === 'open' ? 'success' : c.status === 'finished' ? 'neutral' : 'warning'}>
                    {c.status}
                </StatusPill>
            )
        },
        {
            key: "members",
            header: "Participation",
            render: (c) => (
                <div className="flex items-center gap-2">
                    <FiUsers className="text-slate-400" />
                    <span className="text-sm font-black text-slate-600 dark:text-slate-300">{c.members?.length || 0} / {c.maxMembers}</span>
                </div>
            )
        },
        {
            key: "monthlyAmount",
            header: "Monthly Pulse",
            render: (c) => (
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase">RS {formatMoney(c.monthlyAmount)}</p>
            )
        },
        {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (c) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => router.push(`/admin/manage?id=${c._id}`)}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none hover:bg-primary-600 hover:text-white transition-all"
                    >
                        Manage
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
            )
        }
    ];

    if (loading) return <div className="p-12 text-center font-bold text-slate-500 animate-pulse">Syncing Operational Pools...</div>;

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <span className="eyebrow">Pool Registry</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                        Manage <span className="text-primary-600">Committees</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Full control over your financial circuits</p>
                </div>
                <div className="w-full md:w-96">
                    <Input
                        icon={FiSearch}
                        placeholder="Filter by Pool Identity or UID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-800">
                <Table
                    columns={columns}
                    data={committees}
                    emptyText="No matching financial committees found."
                />
            </Card>

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
