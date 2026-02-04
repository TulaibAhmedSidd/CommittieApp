"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiUser, FiHome, FiCreditCard, FiSave, FiInfo } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import { useLanguage } from "../../Components/LanguageContext";

export default function ProfilePage() {
    const { t } = useLanguage();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [payoutDetails, setPayoutDetails] = useState({
        accountTitle: "",
        bankName: "",
        iban: ""
    });

    useEffect(() => {
        const data = localStorage.getItem("member");
        if (data) {
            const parsed = JSON.parse(data);
            setMember(parsed);
            fetchProfile(parsed._id);
        }
    }, []);

    const fetchProfile = async (id) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/member/${id}`);
            const data = await res.json();
            if (res.ok) {
                setPayoutDetails(data.payoutDetails || { accountTitle: "", bankName: "", iban: "" });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`/api/member/${member._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ payoutDetails }),
            });

            if (!res.ok) throw new Error("Failed to update profile");
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
                    <FiUser className="animate-pulse" /> Security Registry
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Member Profile</h1>
                <p className="text-slate-500 font-medium italic">Configure your receiving bank details for automated payouts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="p-8 bg-slate-900 text-white border-none rounded-[2rem] overflow-hidden group">
                        <FiCreditCard className="absolute -bottom-4 -right-4 text-white/5 group-hover:scale-110 transition-transform duration-700" size={100} />
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <FiHome size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight">{member?.name}</h4>
                                <p className="text-xs text-slate-400 font-medium">{member?.email}</p>
                            </div>
                            <div className="pt-2 border-t border-white/10">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary-500">Status: Verified</span>
                            </div>
                        </div>
                    </Card>
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-600">
                            <FiInfo size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Important Notice</span>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-500 font-medium leading-relaxed italic">
                            Ensure your bank details are 100% accurate. Admin will use these for your payout turn.
                        </p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <Card className="p-10 border-none shadow-premium bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8">
                                <Input
                                    label="Account Title / Name"
                                    placeholder="John Doe"
                                    value={payoutDetails.accountTitle}
                                    onChange={(e) => setPayoutDetails({ ...payoutDetails, accountTitle: e.target.value })}
                                    required
                                    className="h-14 font-black uppercase text-xs"
                                />
                                <Input
                                    label="Bank Name"
                                    placeholder="Standard Chartered"
                                    value={payoutDetails.bankName}
                                    onChange={(e) => setPayoutDetails({ ...payoutDetails, bankName: e.target.value })}
                                    required
                                    className="h-14 font-black uppercase text-xs"
                                />
                                <Input
                                    label="IBAN / Account Number"
                                    placeholder="PK00 SCBL 0123 4567 8912"
                                    value={payoutDetails.iban}
                                    onChange={(e) => setPayoutDetails({ ...payoutDetails, iban: e.target.value })}
                                    required
                                    className="h-14 font-mono font-black text-sm tracking-tighter"
                                />
                            </div>

                            <Button type="submit" loading={isSaving} className="w-full py-5 bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-500/20 font-black uppercase tracking-[0.2em] text-xs">
                                <FiSave className="mr-2" /> Save Credentials
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
