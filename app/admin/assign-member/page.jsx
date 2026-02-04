"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchMembers, fetchCommittees } from "../apis";
import { useRouter } from "next/navigation";
import { FiUserPlus, FiLayers, FiUsers, FiCheckCircle, FiChevronRight, FiChevronLeft, FiAlertCircle, FiShield, FiLink } from "react-icons/fi";
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
    const [selectedMember, setSelectedMember] = useState("");
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
            setCommittees(comms || []);
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
                body: JSON.stringify({ memberId: selectedMember, committeeId: selectedCommittee }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to assign member");
            }

            toast.success(t("assignSuccess"));
            setStep(0);
            setSelectedMember("");
            setSelectedCommittee("");
            loadData();
        } catch (err) {
            toast.error(t("error") + ": " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const currentCommittee = committees.find(c => c._id === selectedCommittee);
    const currentMember = members.find(m => m._id === selectedMember);

    const isCommitteeAllowed = (c) => c.createdBy?.toString() === userLoggedDetails?._id?.toString();
    const isMemberAllowed = (m) => {
        if (!currentCommittee) return false;
        const isAlreadyIn = currentCommittee.members?.some(am => (am._id || am)?.toString() === m._id?.toString()) ||
            currentCommittee.pendingMembers?.some(pm => (pm._id || pm)?.toString() === m._id?.toString());

        const createdByMe = m.createdBy?.toString() === userLoggedDetails?._id?.toString();
        const isApproved = m.status === "approved" || !m.status;
        return !isAlreadyIn && createdByMe && isApproved;
    };

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    return (
        <div className="space-y-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
                        <FiLink className="animate-pulse" /> {t("committeeHub")}
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("bindParticipant")}</h1>
                    <p className="text-slate-500 font-medium italic">{t("assignmentInstructions")}</p>
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
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="relative">
                                                <div className="w-12 h-12 border-4 border-primary-500/10 rounded-full" />
                                                <div className="absolute top-0 w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                            <p className="text-slate-400 font-black tracking-widest uppercase text-[9px]">{t("loading")}</p>
                                        </div>
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
                                                onClick={() => setSelectedCommittee(c._id)}
                                                className={`
                                                    p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex justify-between items-center group
                                                    ${selectedCommittee === c._id
                                                        ? "border-primary-500 bg-primary-500/5 shadow-xl shadow-primary-500/10 scale-[1.01]"
                                                        : "border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:translate-x-1"}
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
                                                            {c.members?.length || 0} / {c.maxMembers} {t("capacity")} • PKR {formatMoney(c.monthlyAmount)} / {t("cycle")}
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
                            <div className="flex items-center gap-4 p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                                <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                                    <FiUsers size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t("step")} 2</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("selectMember")}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{t("selectionProxy")}</label>
                                <select
                                    value={selectedMember}
                                    onChange={(e) => setSelectedMember(e.target.value)}
                                    className="w-full h-16 bg-slate-800 dark:bg-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 text-lg font-black tracking-tight focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer text-white dark:text-slate-900"
                                >
                                    <option value="">{t("selectMember")}...</option>
                                    {members.filter(isMemberAllowed).map((m) => (
                                        <option key={m._id} value={m._id}>{m.name} [{m.email}]</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-slate-400 font-medium mt-2 px-1 flex items-center gap-2">
                                    <FiShield size={12} className="text-primary-500" /> {t("verifiedOnly")}
                                </p>
                            </div>

                            {currentMember && (
                                <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-inner animate-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-primary-600 text-white rounded-[1.5rem] flex items-center justify-center text-3xl font-black shadow-xl shadow-primary-500/20 rotate-3">
                                        {currentMember.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{currentMember.name}</h4>
                                        <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest opacity-60">{currentMember.email}</p>
                                        <div className="pt-2 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full">{t("approved")}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("finalBinding")}</p>
                                </div>
                            </div>

                            <Card className="border-none bg-slate-900 dark:bg-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                                    <div className="flex items-center gap-12 md:gap-20">
                                        <div className="space-y-3">
                                            <div className="w-24 h-24 bg-white/10 dark:bg-slate-50 rounded-3xl flex items-center justify-center text-white dark:text-slate-900 shadow-2xl scale-110">
                                                <FiUsers size={40} />
                                            </div>
                                            <p className="text-[10px] font-black text-white dark:text-slate-400 uppercase tracking-widest">{currentMember?.name}</p>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-0.5 w-16 md:w-32 bg-primary-500/40" />
                                            <FiChevronRight className="text-primary-500" />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="w-24 h-24 bg-white/10 dark:bg-slate-50 rounded-3xl flex items-center justify-center text-white dark:text-slate-900 shadow-2xl scale-110">
                                                <FiLayers size={40} />
                                            </div>
                                            <p className="text-[10px] font-black text-white dark:text-slate-400 uppercase tracking-widest">{currentCommittee?.name}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 max-w-sm">
                                        <p className="text-white/60 dark:text-slate-500 text-sm font-medium">
                                            Adding <span className="text-white dark:text-slate-900 font-black">{currentMember?.name}</span> to the <span className="text-white dark:text-slate-900 font-black">{currentCommittee?.name}</span>.
                                        </p>
                                        <div className="px-6 py-3 bg-primary-600 rounded-2xl inline-block shadow-lg">
                                            <p className="text-xs font-black text-white tracking-widest uppercase italic">Monthly Amount: PKR {formatMoney(currentCommittee?.monthlyAmount)}</p>
                                        </div>
                                    </div>
                                </div>
                                <FiLink size={180} className="absolute -bottom-10 -right-10 text-white/5 dark:text-slate-900/5 group-hover:scale-110 transition-transform duration-1000" />
                            </Card>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-8">
                    <button onClick={handleBack} disabled={step === 0 || loading} className={`flex items-center gap-2 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors ${step === 0 ? "invisible" : ""}`}>
                        <FiChevronLeft /> {t("back")}
                    </button>

                    {step < steps.length - 1 ? (
                        <Button onClick={handleNext} disabled={(step === 0 && !selectedCommittee) || (step === 1 && !selectedMember)} className="px-10 py-4 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary-500/20">
                            {t("next")} <FiChevronRight className="ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleAssign} loading={loading} className="px-10 py-4 font-black uppercase text-xs tracking-[0.2em] bg-green-600 hover:bg-green-700 shadow-xl shadow-green-500/20 border-none">
                            {t("establishLink")} <FiLink className="ml-2" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AssignMembers;
