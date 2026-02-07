"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiCheckCircle, FiShield, FiBriefcase, FiLink, FiMapPin, FiNavigation } from "react-icons/fi";
import Button from "../Components/Theme/Button";
import Input from "../Components/Theme/Input";
import Card from "../Components/Theme/Card";
import { toast } from "react-toastify";

import { Suspense } from "react";

function RegisterContent() {
    const searchParams = useSearchParams();
    const referralCode = searchParams.get("ref");
    const [role, setRole] = useState("member");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        county: "",
        location: { type: "Point", coordinates: [0, 0] }
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.phone) {
            toast.error("Phone number is mandatory");
            return;
        }
        if (!formData.city) {
            toast.error("City is mandatory");
            return;
        }
        setLoading(true);
        try {
            const endpoint = role === "member" ? "/api/member" : "/api/admin";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, referralCode }),
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

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            return toast.error("Geolocation is not supported by your browser");
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    location: {
                        type: "Point",
                        coordinates: [position.coords.longitude, position.coords.latitude]
                    }
                }));
                toast.success("Location captured!");
            },
            (error) => {
                toast.error("Unable to retrieve your location");
            }
        );
    };

    const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Sukkur", "Bahawalpur", "Sargodha", "Mardan", "Larkana", "Sheikhupura", "Rahim Yar Khan", "Jhang", "Dera Ghazi Khan"];

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
                <Card className="p-8 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-2xl border-white/50 dark:border-slate-800/50">
                    <div className="text-center mb-8 space-y-2">
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                            Create <span className="text-primary-600">Account</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px]">Join the CommittieApp Ecosystem</p>
                    </div>
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
                        <Input
                            label="Phone Number"
                            name="phone"
                            placeholder="03001234567"
                            icon={<FiPhone />}
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <div className="space-y-1.5 text-left">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">City</label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            >
                                <option value="">Select City</option>
                                {cities.sort().map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="County / Area"
                            name="county"
                            placeholder="e.g. Gulshan, DHA..."
                            icon={<FiMapPin />}
                            value={formData.county}
                            onChange={handleChange}
                        />

                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Input
                                    label="Location Coordinates"
                                    value={`${formData.location.coordinates[1].toFixed(4)}, ${formData.location.coordinates[0].toFixed(4)}`}
                                    icon={<FiNavigation />}
                                    readOnly
                                />
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleGetLocation}
                                className="mb-0.5"
                                title="Get current location"
                            >
                                <FiNavigation />
                            </Button>
                        </div>
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

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center uppercase font-black tracking-widest text-xs opacity-50">Initializing Core...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
