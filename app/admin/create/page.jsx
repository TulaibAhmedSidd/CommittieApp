"use client";

import { useEffect, useState } from "react";
import { createCommittee } from "../apis";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
    FiLayers,
    FiDollarSign,
    FiCheckCircle,
    FiChevronRight,
    FiChevronLeft,
    FiInfo,
    FiTarget,
    FiCpu
} from "react-icons/fi";

import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import Card from "../../Components/Theme/Card";
import StepProgress from "../../Components/Theme/StepProgress";
import { useLanguage } from "../../Components/LanguageContext";

export const dynamic = "force-dynamic";

export default function CreateCommittee() {
    const { t } = useLanguage();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userLoggedDetails, setUserLoggedDetails] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        maxMembers: "",
        monthlyAmount: "",
        monthDuration: "",
        startDate: "",
        endDate: "",
        totalAmount: "",
        createdBy: "",
        bankDetails: {
            accountTitle: "",
            bankName: "",
            iban: ""
        },
        organizerFee: 0,
        isFeeMandatory: false,
        durationError: ''
    });

    const steps = [t("coreParameters"), t("financialSchema"), t("bankInformation"), t("finalCalibration")];

    useEffect(() => {
        const detail = localStorage.getItem("admin_detail");
        const token = localStorage.getItem("admin_token");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        if (detail) {
            const parsed = JSON.parse(detail);
            setUserLoggedDetails(parsed);
            setFormData((prev) => ({ ...prev, createdBy: parsed._id }));
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);

        if (name === "startDate" || name === "monthDuration") {
            calculateEndDate(newData);
        }
        if (name === "monthlyAmount" || name === "monthDuration") {
            calculateTotalAmount(newData);
        }
    };

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            bankDetails: {
                ...prev.bankDetails,
                [name]: value
            }
        }));
    };

    const calculateEndDate = ({ startDate, monthDuration }) => {
        if (!startDate || !monthDuration) return;
        const start = new Date(startDate);
        const duration = parseInt(monthDuration, 10);
        if (!isNaN(duration) && duration > 0) {
            const end = new Date(start.setMonth(start.getMonth() + duration - 1));
            setFormData((prev) => ({
                ...prev,
                endDate: end.toISOString().split("T")[0],
            }));
        }
    };

    const calculateTotalAmount = ({ monthlyAmount, monthDuration }) => {
        const installment = parseFloat(monthlyAmount);
        const duration = parseInt(monthDuration, 10);
        const maxMembers = parseInt(formData.maxMembers, 10) || 0;

        // Basic validation
        if (
            isNaN(installment) ||
            isNaN(duration) ||
            installment <= 0 ||
            duration <= 0 ||
            maxMembers <= 0
        ) {
            setFormData((prev) => ({
                ...prev,
                totalAmount: "",
                durationError: "Invalid input values",
            }));
            return;
        }

        // 🔴 Core BC rule: duration must be multiple of members
        if (duration % maxMembers !== 0) {
            setFormData((prev) => ({
                ...prev,
                totalAmount: "",
                durationError: `Duration must be ${maxMembers}, ${maxMembers * 2}, ${maxMembers * 3} months`,
            }));
            return;
        }

        // ✅ Valid BC calculation
        const monthlyPool = maxMembers * installment;
        const totalBCAmount = installment * duration;
        const perMemberTotal = installment * duration;

        setFormData((prev) => ({
            ...prev,
            totalAmount: Math.round(totalBCAmount),
            durationError: "",
            monthlyPool,
            perMemberTotal,
        }));
    };


    const validateStep = () => {
        if (formData.durationError) { return true }
        if (step === 0) return formData.name.length > 3 && formData.description.length > 5 && formData.maxMembers > 0;
        if (step === 1) return formData.monthlyAmount > 0 && formData.monthDuration >= 3 && formData.startDate;
        if (step === 2) return formData.bankDetails.accountTitle && formData.bankDetails.bankName && formData.bankDetails.iban;
        return true;
    };

    const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const handleBack = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCommittee({ ...formData, createdBy: userLoggedDetails?._id });
            toast.success(t("success"));

            if (confirm(t("assignMembersProtocol") || "Do you want to assign members now?")) {
                router.push("/admin/assign-member");
            } else {
                router.push("/admin");
            }
        } catch (err) {
            toast.error(t("error") + ": " + (err.message || "Initialization Failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 max-w-4xl mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
                        <FiLayers className="animate-spin-slow" /> {t("committees") || "Committees"}
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("createCommittee") || "Create Committee"}</h1>
                    <p className="text-slate-500 font-medium italic">Setup a new committee and define its rules.</p>
                </div>
            </div>

            <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-visible p-8 md:p-12">
                <div className="mb-12">
                    <StepProgress steps={steps} currentStep={step} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-10 min-h-[450px]">
                    {step === 0 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-4 p-5 bg-primary-500/5 rounded-2xl border border-primary-500/10">
                                <div className="p-3 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20">
                                    <FiTarget size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{t("step") || "Step"} 1</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("coreParameters")}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label={t("operationName") || "Operation Name"}
                                    name="name"
                                    placeholder="Nexus Core Pool"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                    required
                                />
                                <Input
                                    label={t("maxLoadMembers") || "Max Members"}
                                    name="maxMembers"
                                    type="number"
                                    min={2}
                                    placeholder="12"
                                    value={formData.maxMembers}
                                    onChange={handleChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">{t("missionDirectiveDesc") || "Mission Description"}</label>
                                <textarea
                                    name="description"
                                    placeholder="Outline the goals..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="input-field min-h-[120px] bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-base font-medium resize-none shadow-sm transition-all focus:ring-2 focus:ring-primary-500/20 w-full"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-4 p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                                <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                                    <FiCpu size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t("step") || "Step"} 2</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("financialSchema")}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label={t("monthlyCommitmentPkr") || "Monthly Commitment (PKR)"}
                                    name="monthlyAmount"
                                    type="number"
                                    min={1}
                                    placeholder="10000"
                                    value={formData.monthlyAmount}
                                    onChange={handleChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                    required
                                />
                                <Input
                                    label={t("cycleDurationMonths") || "Duration (Months)"}
                                    name="monthDuration"
                                    type="number"
                                    min={formData.maxMembers}
                                    placeholder="12"
                                    value={formData.monthDuration}
                                    onChange={handleChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label={t("cycleInitializationStart") || "Start Date"}
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                    required
                                />
                                <div className="space-y-1">
                                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">{t("projectedTermination") || "Projected End Date"}</label>
                                    <div className="h-14 flex items-center px-6 bg-slate-100 dark:bg-slate-950/50 rounded-xl text-slate-500 italic font-black text-lg border border-slate-200 dark:border-slate-800">
                                        {formData.endDate || "Pending..."}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Organizer Fee (Optional)"
                                    name="organizerFee"
                                    type="number"
                                    placeholder="500"
                                    value={formData.organizerFee}
                                    onChange={handleChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                />
                                <div className="flex items-center gap-4 px-6 h-14 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <input
                                        type="checkbox"
                                        id="isFeeMandatory"
                                        checked={formData.isFeeMandatory}
                                        onChange={(e) => setFormData({ ...formData, isFeeMandatory: e.target.checked })}
                                        className="w-5 h-5 accent-primary-600"
                                    />
                                    <label htmlFor="isFeeMandatory" className="text-xs font-black uppercase text-slate-500 tracking-widest cursor-pointer">
                                        Mandatory for all members?
                                    </label>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex justify-between items-center shadow-2xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60 mb-2 underline decoration-primary-500 decoration-2">{t("totalPoolValuation") || "Total Pool Valuation"}</p>
                                    <h4 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                                        PKR {formData.totalAmount ? parseInt(formData.totalAmount).toLocaleString() : "0"}
                                    </h4>
                                    {formData.organizerFee > 0 && (
                                        <p className="text-[10px] font-bold mt-2 text-primary-400">
                                            + {formData.organizerFee} PKR Organizer Fee {formData.isFeeMandatory ? "(Mandatory)" : "(Optional)"}
                                        </p>
                                    )}
                                    <h2 className="text-2xl text-red-500 tracking-tighter uppercase">
                                        {formData.durationError}
                                    </h2>
                                </div>
                                <FiDollarSign size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-4 p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20">
                                    <FiDollarSign size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t("step") || "Step"} 3</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("bankInformation") || "Bank Information"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                <Input
                                    label={t("accountTitle") || "Account Title"}
                                    name="accountTitle"
                                    placeholder="John Doe"
                                    value={formData.bankDetails.accountTitle}
                                    onChange={handleBankChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                    required
                                />
                                <Input
                                    label={t("bankName") || "Bank Name"}
                                    name="bankName"
                                    placeholder="HBL BANK"
                                    value={formData.bankDetails.bankName}
                                    onChange={handleBankChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                    required
                                />
                                <Input
                                    label={t("iban") || "IBAN"}
                                    name="iban"
                                    placeholder="PK00HBL000000000000000"
                                    value={formData.bankDetails.iban}
                                    onChange={handleBankChange}
                                    className="h-14 text-lg font-black tracking-tight"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-4 p-5 bg-green-500/5 rounded-2xl border border-green-500/10">
                                <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20">
                                    <FiCheckCircle size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{t("step") || "Step"} 4</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{t("finalValidation") || "Final Validation"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-premium">
                                {[
                                    { label: t("designation") || "Designation", value: formData.name },
                                    { label: t("neuralLoad") || "Neural Load", value: formData.maxMembers + " " + (t("members") || "Members") },
                                    { label: t("monthlyPulse") || "Monthly Pulse", value: `PKR ${formData.monthlyAmount}` },
                                    { label: t("timeline") || "Timeline", value: `${formData.monthDuration} Months` },
                                    { label: t("activation") || "Activation", value: formData.startDate },
                                    { label: t("deactivation") || "Deactivation", value: formData.endDate },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/80 dark:bg-slate-900/80 p-6 flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                                        <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                                <div className="col-span-full bg-primary-600 p-8 text-white">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{t("totalAssetPool") || "Total Asset Pool"}</span>
                                    <p className="text-4xl font-black tracking-tighter uppercase">PKR {formData.totalAmount ? parseInt(formData.totalAmount).toLocaleString() : "0"}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400 italic">
                                <FiInfo className="shrink-0 mt-0.5" />
                                <p>{t("immutableWarning") || "Please review all details. Some information may be immutable after pool initialization."}</p>
                            </div>
                        </div>
                    )}
                </form>

                <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={handleBack} disabled={step === 0 || loading} className={`flex items-center gap-2 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors ${step === 0 ? "invisible" : ""}`}>
                        <FiChevronLeft /> {t("back") || "Back"}
                    </button>

                    {step < steps.length - 1 ? (
                        <Button onClick={handleNext} disabled={!validateStep()} className="px-10 py-4 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary-500/20">
                            {t("next") || "Next"} <FiChevronRight className="ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} loading={loading} className="px-10 py-4 font-black uppercase text-xs tracking-[0.2em] bg-green-600 hover:bg-green-700 shadow-xl shadow-green-500/20 border-none">
                            {t("launchPoolButton") || "Launch Pool"} <FiCheckCircle className="ml-2" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
