"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiShield, FiMail, FiLock, FiChevronRight, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import Card from "../../Components/Theme/Card";

export default function ForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: PIN, 2: Reset Form
    const [pin, setPin] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerifyPin = (e) => {
        e.preventDefault();
        if (pin === "885580") {
            setStep(2);
            toast.success("Security Clearance Granted");
        } else {
            toast.error("Invalid Security PIN");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/forgot-password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Reset failed");

            toast.success("Identity Verified. Password Updated.");
            router.push("/admin/login");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                    <Link href="/admin/login" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors group">
                        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
                    </Link>
                </div>

                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white dark:bg-slate-900 rounded-xl shadow-premium border border-primary-100 dark:border-primary-900/30 mb-2">
                        <FiShield size={28} className="text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Account Recovery</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Follow the security protocols to regain access.</p>
                </div>

                {step === 1 ? (
                    <Card className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/50 dark:border-slate-800/50 shadow-2xl animate-in fade-in zoom-in duration-500">
                        <form onSubmit={handleVerifyPin} className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="text-[11px] font-black text-primary-600 uppercase tracking-[0.2em]">Step 01 / Gatekeeping</div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Enter the encrypted 6-digit bypass PIN.</p>
                            </div>

                            <Input
                                type="password"
                                placeholder="******"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="text-center text-3xl tracking-[0.5em] font-black py-4 border-none bg-slate-100 dark:bg-slate-800/50 focus:ring-primary-500"
                                required
                                maxLength={6}
                            />

                            <Button type="submit" className="w-full py-4 text-base font-black">
                                Verify Clearance <FiChevronRight className="ml-2" />
                            </Button>
                        </form>
                    </Card>
                ) : (
                    <Card className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/50 dark:border-slate-800/50 shadow-2xl animate-in slide-in-from-right-8 fade-in duration-500">
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="text-center space-y-1">
                                <div className="text-[11px] font-black text-green-500 uppercase tracking-[0.2em]">Step 02 / Synchronization</div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Clearance Granted. Reset your credentials.</p>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Administrative Email"
                                    type="email"
                                    placeholder="your-admin@committie.app"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    label="New Neural Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                loading={loading}
                                disabled={loading}
                                className="w-full py-4 font-black shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 border-none"
                            >
                                <FiCheckCircle className="mr-2" /> Commit Reset
                            </Button>
                        </form>
                    </Card>
                )}
            </div>
        </div>
    );
}
