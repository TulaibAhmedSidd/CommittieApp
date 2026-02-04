"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiCheckCircle, FiShield, FiBriefcase } from "react-icons/fi";
import Button from "../Components/Theme/Button";
import Input from "../Components/Theme/Input";
import Card from "../Components/Theme/Card";
import { toast } from "react-toastify";

export default function RegisterPage() {
    const [role, setRole] = useState("member"); // "member" or "organizer"
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = role === "member" ? "/api/member" : "/api/admin";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || "Registration failed");
            }

            setSuccess(true);
            toast.success(role === "member" ? "Account created successfully!" : "Application submitted successfully!");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-12 text-center space-y-8 animate-in zoom-in duration-500">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${role === "member" ? "bg-green-500/10 text-green-500" : "bg-primary-500/10 text-primary-500"}`}>
                        {role === "member" ? <FiCheckCircle size={48} /> : <FiShield size={48} />}
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            {role === "member" ? "Registration Complete" : "Application Sent"}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            {role === "member"
                                ? <>Your account has been created successfully. You can now <span className="text-primary-600 font-bold uppercase">Login</span> to access your dashboard.</>
                                : <>Your <span className="text-primary-600 font-bold">Organizer Profile</span> is being reviewed by the Super Admin. You will be able to launch committees once approved.</>
                            }
                        </p>
                    </div>
                    <Link href={role === "member" ? "/login" : "/admin/login"}>
                        <Button className="w-full py-4 uppercase font-black tracking-widest text-xs">
                            Return to Login
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Create <span className="text-primary-600">Account</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px]">Join the CommittieApp Ecosystem</p>
                </div>

                <Card className="p-8 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-2xl border-white/50 dark:border-slate-800/50">
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
                        <button
                            onClick={() => setRole("member")}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === "member" ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            Member
                        </button>
                        <button
                            onClick={() => setRole("organizer")}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === "organizer" ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            Organizer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label={role === "member" ? "Full Name" : "Organizer / Company Name"}
                            name="name"
                            placeholder={role === "member" ? "John Doe" : "Trust Circle"}
                            icon={role === "member" ? <FiUser /> : <FiBriefcase />}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            icon={<FiMail />}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {role === "member" && (
                            <Input
                                label="Phone Number"
                                name="phone"
                                placeholder="03001234567"
                                icon={<FiPhone />}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        )}
                        <Input
                            label="Security Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            icon={<FiLock />}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="pt-4">
                            <Button type="submit" loading={loading} className="w-full py-5 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary-500/20">
                                {role === "member" ? "Create Member Account" : "Submit Organizer Application"} <FiArrowRight className="ml-2" />
                            </Button>
                        </div>

                        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Already have an account? <Link href={role === "member" ? "/login" : "/admin/login"} className="text-primary-600 underline">Login here</Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
}
