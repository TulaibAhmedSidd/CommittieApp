"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import {
    FiActivity, FiClock, FiUser, FiInfo,
    FiShield, FiDatabase, FiSearch, FiRefreshCcw
} from "react-icons/fi";

import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Table, { TableRow, TableCell } from "../../Components/Theme/Table";
import { useLanguage } from "../../Components/LanguageContext";

export default function LogsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const detail = localStorage.getItem("admin_detail");
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");
            return;
        }
        const parsed = JSON.parse(detail);
        setAdmin(parsed);

        const isSuperAdmin = parsed.email.toLowerCase() === "tulaib@gmail.com" ||
            parsed.email.toLowerCase().includes("tulaib") ||
            parsed.name.toLowerCase().includes("tulaib");

        if (!isSuperAdmin) {
            toast.error("Unauthorized access to logs");
            router.push("/admin");
            return;
        }

        fetchLogs(parsed._id);
    }, [router]);

    const fetchLogs = async (adminId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/logs?adminId=${adminId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setLogs(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(l =>
        l.action.toLowerCase().includes(filter.toLowerCase()) ||
        l.performedBy?.name?.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-black tracking-widest uppercase text-[10px]">Accessing Secure Vault...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-slate-800 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
                        <FiShield className="animate-spin-slow" /> Security Architecture
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Audit Logs</h1>
                    <p className="text-slate-500 font-medium italic">Comprehensive ledger of all system operations and administrative actions.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter actions..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="h-14 pl-12 pr-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black uppercase tracking-tight w-64 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                        />
                    </div>
                    <Button onClick={() => fetchLogs(admin._id)} className="h-14 px-8 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white hover:bg-slate-200 transition-all">
                        <FiRefreshCcw />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-slate-900 text-white border-none p-8 flex flex-col justify-between relative overflow-hidden">
                    <FiActivity size={120} className="absolute -bottom-10 -right-10 text-white/5" />
                    <div className="relative z-10 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Entries</p>
                        <h4 className="text-5xl font-black tracking-tighter">{logs.length}</h4>
                        <p className="text-xs text-primary-500 font-black uppercase tracking-widest italic">Live Operations</p>
                    </div>
                </Card>
                <Card className="md:col-span-2 p-0 overflow-hidden border-none shadow-premium bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <Table headers={["Timestamp", "Action", "Performed By", "Details"]}>
                            {filteredLogs.map((log) => (
                                <TableRow key={log._id} className="hover:bg-primary-50/30 transition-colors">
                                    <TableCell className="font-mono text-[10px] text-slate-400">
                                        {moment(log.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                                            {log.action}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-primary-600 text-white flex items-center justify-center text-[9px] font-black">
                                                {log.performedBy?.name?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">{log.performedBy?.name || "System"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        <div className="flex items-center gap-2">
                                            <FiInfo className="text-slate-300" />
                                            <span className="text-[10px] font-medium text-slate-500 italic">
                                                {JSON.stringify(log.details)}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </div>
                    {filteredLogs.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <FiDatabase size={48} className="mx-auto text-slate-100" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">No activity matching your filter</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
