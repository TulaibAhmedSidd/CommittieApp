"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiBell, FiChevronRight, FiList, FiCheckCircle, FiInfo, FiLayers } from "react-icons/fi";
import { toast } from "react-toastify";
import moment from "moment";

import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Table, { TableRow, TableCell } from "../../Components/Theme/Table";
import { useLanguage } from "../../Components/LanguageContext";

export const dynamic = "force-dynamic";

export default function AnnouncementPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [committees, setCommittees] = useState([]);
    const [selectedCommitteeId, setSelectedCommitteeId] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const selectedCommittee = committees.find(c => c._id === selectedCommitteeId);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");
            return;
        }
        fetchCommittees();
    }, [router]);

    const fetchCommittees = async () => {
        setFetching(true);
        try {
            const res = await fetch("/api/committee");
            const data = await res.json();
            const admin = JSON.parse(localStorage.getItem("admin_detail"));
            setCommittees((data.committees || []).filter(c => c.createdBy === admin?._id));
        } catch (err) {
            toast.error(t("error") + ": " + (err.message || "Failed to load"));
        } finally {
            setFetching(false);
        }
    };

    const handleAnnounce = async () => {
        if (!selectedCommitteeId) {
            toast.warning(t("selectCommitteeWarning"));
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/announcement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ committeeId: selectedCommitteeId }),
            });

            if (!res.ok) throw new Error("Could not announce results");

            toast.success(t("announceSuccess"));
            fetchCommittees();
        } catch (err) {
            toast.error(t("error") + ": " + err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-black tracking-widest uppercase text-[9px] animate-pulse">{t("loading")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 tracking-tighter uppercase">
                    <FiBell className="text-primary-600" /> {t("announcements")}
                </h1>
                <p className="text-slate-500 font-medium italic">Manage committee drawings and share results with members.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selection Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title={t("activePools")} description="Select a committee to manage">
                        <div className="space-y-2">
                            {committees.length === 0 ? (
                                <p className="text-sm text-slate-400 italic py-4">{t("noData")}</p>
                            ) : committees.map((c) => (
                                <button
                                    key={c._id}
                                    onClick={() => setSelectedCommitteeId(c._id)}
                                    className={`
                                        w-full flex items-center justify-between p-4 rounded-xl border transition-all
                                        ${selectedCommitteeId === c._id
                                            ? "bg-primary-50 border-primary-200 text-primary-700 shadow-sm"
                                            : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"}
                                    `}
                                >
                                    <div className="text-left">
                                        <p className="text-sm font-bold truncate max-w-[150px] uppercase tracking-tight">{c.name}</p>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                            {c.members?.length || 0} {t("members")}
                                        </p>
                                    </div>
                                    <FiChevronRight className={`transition-transform ${selectedCommitteeId === c._id ? "rotate-90" : ""}`} />
                                </button>
                            ))}
                        </div>
                    </Card>

                    {selectedCommitteeId && (
                        <Card className="bg-primary-600 border-none shadow-premium text-white overflow-hidden relative p-6">
                            <div className="relative z-10">
                                <h4 className="text-lg font-black uppercase tracking-tighter mb-2">{t("drawResults")}</h4>
                                <p className="text-white/80 text-xs mb-6 font-medium">Pick a random winner for this committee and notify everyone.</p>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-primary-600 hover:bg-white/90 border-none font-black shadow-lg py-4 text-xs tracking-widest uppercase"
                                    loading={loading}
                                    onClick={handleAnnounce}
                                >
                                    {t("runDrawing")}
                                </Button>
                            </div>
                            <FiLayers size={100} className="absolute -bottom-5 -right-5 text-white/10 rotate-12" />
                        </Card>
                    )}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2">
                    {selectedCommitteeId ? (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <Card
                                title={selectedCommittee.name}
                                description={selectedCommittee.result?.length > 0 ? moment(selectedCommittee.announcementDate).format("LLL") : t("noResultsYet")}
                                className="p-8"
                            >
                                {selectedCommittee.result?.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl text-[10px] font-black tracking-widest border border-green-500/20 uppercase">
                                            <FiCheckCircle className="animate-pulse" /> {t("drawingCompleted")}
                                        </div>
                                        <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                            <Table headers={[t("position"), t("memberName")]}>
                                                {selectedCommittee.result.map((res, i) => (
                                                    <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                                                        <TableCell className="font-black text-primary-600 text-lg">#{res.position}</TableCell>
                                                        <TableCell className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-base">
                                                            {res.member?.name}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </Table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300">
                                            <FiList size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-slate-900 dark:text-white font-black text-xl tracking-tighter uppercase">{t("noResultsYet")}</p>
                                            <p className="text-slate-500 font-medium max-w-xs mx-auto italic">Start a drawing to pick member positions.</p>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Committee Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-6 bg-white/50 dark:bg-slate-900/50 border-none shadow-premium">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("totalSlots")}</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedCommittee.maxMembers}</p>
                                </Card>
                                <Card className="p-6 bg-white/50 dark:bg-slate-900/50 border-none shadow-premium">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("approvedMembers")}</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedCommittee.members?.length || 0}</p>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center py-32 border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-600 mb-8">
                                <FiInfo size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase">{t("selectCommittee")}</h3>
                            <p className="text-slate-500 text-center max-w-sm font-medium italic">{t("selectCommitteeToView")}</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
