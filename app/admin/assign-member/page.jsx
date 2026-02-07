"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchMembers, fetchCommittees } from "../apis";
import { useRouter } from "next/navigation";
import {
    FiUserPlus, FiLayers, FiUsers, FiCheckCircle,
    FiChevronRight, FiChevronLeft, FiAlertCircle,
    FiShield, FiLink, FiPlusSquare, FiMinusSquare, FiTrash2
} from "react-icons/fi";
import { formatMoney } from "@/app/utils/commonFunc";

import Button from "../../Components/Theme/Button";
import Card from "../../Components/Theme/Card";
import StepProgress from "../../Components/Theme/StepProgress";
import { useLanguage } from "../../Components/LanguageContext";

export const dynamic = "force-dynamic";

const AssignMembers = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [members, setMembers] = useState([]);
    const [committees, setCommittees] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedCommittee, setSelectedCommittee] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [userLoggedDetails, setUserLoggedDetails] = useState(null);

    const steps = [t("committees"), t("members"), t("review")];

    useEffect(() => {
        const detail = localStorage.getItem("admin_detail");
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin/login");
            return;
        }
        if (detail) {
            setUserLoggedDetails(JSON.parse(detail));
        }
        loadData();
    }, [router]);

    const loadData = async () => {
        setFetching(true);
        try {
            const [mems, comms] = await Promise.all([fetchMembers(), fetchCommittees()]);
            setMembers(mems || []);
            setCommittees(comms?.committees || []);
        } catch (err) {
            toast.error(t("error") + ": " + (err.message || "Failed to load"));
        } finally {
            setFetching(false);
        }
    };

    const handleAssign = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/member/assign-members", {
                method: "PATCH",
                body: JSON.stringify({
                    memberIds: selectedMembers,
                    committeeId: selectedCommittee,
                    adminId: userLoggedDetails?._id
                }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to assign members");

            toast.success(data.message);
            setStep(0);
            setSelectedMembers([]);
            setSelectedCommittee("");
            loadData();
        } catch (err) {
            toast.error(t("error") + ": " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const currentCommittee = committees.find(c => c._id === selectedCommittee);

    const isCommitteeAllowed = (c) => c.createdBy?.toString() === userLoggedDetails?._id?.toString() || c.createdBy === userLoggedDetails?._id;

    const isMemberAllowed = (m) => {
        if (!currentCommittee) return false;
        const isAlreadyIn = currentCommittee.members?.some(am => (am._id || am)?.toString() === m._id?.toString()) ||
            currentCommittee.pendingMembers?.some(pm => (pm._id || pm)?.toString() === m._id?.toString());

        const isLinkedToMe = m.organizers?.some(oid => (oid._id || oid)?.toString() === userLoggedDetails?._id?.toString()) ||
            m.createdBy?.toString() === userLoggedDetails?._id?.toString();

        const isApproved = m.status === "approved" || !m.status;
        return !isAlreadyIn && isLinkedToMe && isApproved && !selectedMembers.includes(m._id);
    };

    const toggleMember = (id) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(selectedMembers.filter(mid => mid !== id));
        } else {
            if (currentCommittee && (currentCommittee.members.length + currentCommittee.pendingMembers.length + selectedMembers.length >= currentCommittee.maxMembers)) {
                toast.warning(`Committee limit reached (${currentCommittee.maxMembers})`);
                return;
            }
            setSelectedMembers([...selectedMembers, id]);
        }
    };

    const handleSelectAll = () => {
        const allowed = members.filter(isMemberAllowed);
        const limitStr = currentCommittee.maxMembers - (currentCommittee.members.length + currentCommittee.pendingMembers.length + selectedMembers.length);
        const toAdd = allowed.slice(0, Math.max(0, limitStr));
        setSelectedMembers([...selectedMembers, ...toAdd.map(m => m._id)]);
    };

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    return (
        <div className="space-y-12 max-w-4xl mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
                        <FiLink className="animate-pulse" /> {t("committeeHub")}
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Bulk Assignment</h1>
                    <p className="text-slate-500 font-medium italic">Bind multiple participants to your committee at once.</p>
                </div>
            </div>

            <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-visible p-8 md:p-12">
                <div className="mb-12">
                    <StepProgress steps={steps} currentStep={step} />
                </div>

                <div className="min-h-[450px]">
                    {step === 0 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-4 p-5 bg-primary-500/5 rounded-2xl border border-primary-500/10">
                                <div className="p-3 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20">
                                    <FiLayers size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{t("step")} 1</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("selectCommittee")}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {fetching ? (
                                    <div className="text-center py-24 animate-pulse">
                                        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-slate-400 font-black tracking-widest uppercase text-[9px]">{t("loading")}</p>
                                    </div>
                                ) : committees.filter(isCommitteeAllowed).length === 0 ? (
                                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                                        <FiAlertCircle size={40} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500 font-black tracking-tight uppercase">{t("noData")}</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {committees.filter(isCommitteeAllowed).map((c) => (
                                            <div
                                                key={c._id}
                                                onClick={() => {
                                                    setSelectedCommittee(c._id);
                                                    setSelectedMembers([]); // Reset on change
                                                }}
                                                className={`
                                                    p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex justify-between items-center group
                                                    ${selectedCommittee === c._id
                                                        ? "border-primary-500 bg-primary-500/5 shadow-xl shadow-primary-500/10 scale-[1.01]"
                                                        : "border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 h-16 md:h-20"}
                                                `}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={`
                                                        w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                                                        ${selectedCommittee === c._id ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 rotate-12" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}
                                                    `}>
                                                        <FiLayers size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">{c.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            {(c.members?.length || 0) + (c.pendingMembers?.length || 0)} / {c.maxMembers} {t("assigned") || "Assigned"} • PKR {formatMoney(c.monthlyAmount)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${selectedCommittee === c._id ? "border-primary-500 bg-primary-500 text-white" : "border-slate-200"}`}>
                                                    {selectedCommittee === c._id && <FiCheckCircle size={20} />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center justify-between gap-4 p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                                        <FiUsers size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t("step")} 2</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Bulk Selection</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={handleSelectAll} className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-500/10 border-none">Select All</Button>
                                    <Button variant="ghost" onClick={() => setSelectedMembers([])} className="text-xs font-black uppercase tracking-widest text-red-500 bg-red-500/10 border-none">Clear</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {members.filter(m => {
                                    const isLinked = m.organizers?.some(oid => (oid._id || oid)?.toString() === userLoggedDetails?._id?.toString()) ||
                                        m.createdBy?.toString() === userLoggedDetails?._id?.toString();
                                    return isLinked;
                                }).map((m) => {
                                    const allowed = isMemberAllowed(m) || selectedMembers.includes(m._id);
                                    const isSelected = selectedMembers.includes(m._id);
                                    const inCommittee = currentCommittee?.members?.some(am => (am._id || am) === m._id) || currentCommittee?.pendingMembers?.some(pm => (pm._id || pm) === m._id);

                                    return (
                                        <div
                                            key={m._id}
                                            onClick={() => allowed && !inCommittee && toggleMember(m._id)}
                                            className={`
                                                relative p-5 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer
                                                ${inCommittee ? "opacity-30 grayscale cursor-not-allowed border-slate-100" :
                                                    isSelected ? "border-primary-500 bg-primary-50 shadow-md" : "border-slate-100 hover:border-slate-300"}
                                            `}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${isSelected ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                                                {m.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{m.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{m.email}</p>
                                            </div>
                                            {isSelected && <FiCheckCircle className="text-primary-600" />}
                                            {inCommittee && <FiAlertCircle className="text-slate-400" title="Already in committee" />}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-6 bg-slate-900 rounded-3xl text-white flex justify-between items-center shadow-2xl">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Queue Status</p>
                                    <p className="text-2xl font-black">{selectedMembers.length} Participants <span className="text-primary-500 text-lg">Selected</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Max Capacity</p>
                                    <p className="text-2xl font-black text-slate-400 italic">/ {currentCommittee?.maxMembers}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-4 p-5 bg-green-500/5 rounded-2xl border border-green-500/10">
                                <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20">
                                    <FiCheckCircle size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{t("step")} 3</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Batch Sync Review</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="bg-slate-900 text-white border-none p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                                    <FiLayers className="absolute -bottom-4 -right-4 text-white/5" size={140} />
                                    <div className="relative z-10 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary-500">Target Committee</p>
                                        <h3 className="text-3xl font-black tracking-tighter uppercase">{currentCommittee?.name}</h3>
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Monthly Pulse</p>
                                                <p className="text-sm font-black">PKR {formatMoney(currentCommittee?.monthlyAmount)}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Total Members</p>
                                                <p className="text-sm font-black">
                                                    {(Array.isArray(currentCommittee?.members) ? currentCommittee.members.length : 0) +
                                                        (Array.isArray(currentCommittee?.pendingMembers) ? currentCommittee.pendingMembers.length : 0) +
                                                        selectedMembers.length} / {currentCommittee?.maxMembers || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Selected Batch ({selectedMembers.length})</p>
                                    {selectedMembers.map(mid => {
                                        const m = members.find(mem => mem._id === mid);
                                        return (
                                            <div key={mid} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-black text-[10px]">
                                                        {m?.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <p className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">{m?.name}</p>
                                                </div>
                                                <button onClick={() => toggleMember(mid)} className="text-red-400 hover:text-red-600 p-2"><FiTrash2 size={14} /></button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-8">
                    <button onClick={handleBack} disabled={step === 0 || loading} className={`flex items-center gap-2 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors ${step === 0 ? "invisible" : ""}`}>
                        <FiChevronLeft /> {t("back")}
                    </button>

                    {step < steps.length - 1 ? (
                        <Button onClick={handleNext} disabled={(step === 0 && !selectedCommittee) || (step === 1 && selectedMembers.length === 0)} className="px-10 py-4 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary-500/20">
                            {t("next")} <FiChevronRight className="ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleAssign} loading={loading} className="px-10 py-4 font-black uppercase text-xs tracking-[0.2em] bg-green-600 hover:bg-green-700 shadow-xl shadow-green-500/20 border-none">
                            Establish Links <FiLink className="ml-2" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AssignMembers;
