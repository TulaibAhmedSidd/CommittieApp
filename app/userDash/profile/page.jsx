"use client";

import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiLock, FiSave, FiArrowLeft, FiCamera, FiPhone, FiCreditCard, FiShield, FiMapPin, FiNavigation, FiCrosshair, FiCheckCircle } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Input from "../../Components/Theme/Input";
import BlueTick from "../../Components/Theme/BlueTick";
import { toast } from "react-toastify";
import Link from "next/link";

export default function MemberProfilePage() {
    const [member, setMember] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "Pakistan",
        city: "",
        nicNumber: "",
        nicImage: "",
        location: { type: "Point", coordinates: [0, 0] },
        accountTitle: "",
        bankName: "",
        iban: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const detail = localStorage.getItem("member");
        if (detail) {
            const parsed = JSON.parse(detail);
            setMember(parsed);
            setFormData(prev => ({
                ...prev,
                name: parsed.name,
                email: parsed.email,
                phone: parsed.phone || "",
                nicNumber: parsed.nicNumber || "",
                nicImage: parsed.nicImage || "",
                location: parsed.location || { type: "Point", coordinates: [0, 0] },
                accountTitle: parsed.payoutDetails?.accountTitle || "",
                bankName: parsed.payoutDetails?.bankName || "",
                iban: parsed.payoutDetails?.iban || ""
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const detectLocation = () => {
        if (!navigator.geolocation) return toast.error("Geolocation not supported");

        toast.info("Detecting your location...", { autoClose: 2000 });
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setFormData(prev => ({
                ...prev,
                location: { type: "Point", coordinates: [longitude, latitude] }
            }));
            toast.success("Location precision established!");
        }, (err) => {
            toast.error("Failed to detect location. Please enter coordinates manually.");
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await fetch("/api/member/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    memberId: member._id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    country: formData.country,
                    city: formData.city,
                    nicNumber: formData.nicNumber,
                    nicImage: formData.nicImage,
                    location: formData.location,
                    payoutDetails: {
                        accountTitle: formData.accountTitle,
                        bankName: formData.bankName,
                        iban: formData.iban
                    },
                    password: formData.newPassword || undefined,
                    requestVerification: formData.nicImage ? true : false
                })
            });

            if (res.ok) {
                const updatedMember = await res.json();
                localStorage.setItem("member", JSON.stringify(updatedMember));
                setMember(updatedMember);
                toast.success("Profile updated successfully!");
                setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
            } else {
                const error = await res.json();
                throw new Error(error.message || "Failed to update profile");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!member) return null;

    return (
        <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Link href="/userDash" className="text-primary-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                        <FiArrowLeft /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Member <span className="text-primary-600">Profile</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-8 flex flex-col items-center text-center space-y-6 bg-slate-900 border-none text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-3xl font-black shadow-2xl shadow-indigo-600/50 mx-auto">
                                    {member.name?.charAt(0)}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center text-slate-600 dark:text-white border border-slate-100 dark:border-slate-700 hover:scale-110 transition-transform">
                                    <FiCamera size={18} />
                                </button>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{member.isAdmin ? 'Circuit Organizer' : 'Node Member'}</p>
                                <h2 className="text-xl font-black tracking-tight uppercase flex items-center justify-center gap-2">
                                    {member.name}
                                    <BlueTick verified={member.verificationStatus === 'verified'} size={20} />
                                </h2>
                                <p className="text-xs text-slate-400 font-medium italic">{member.email}</p>
                            </div>
                            <div className="pt-4 flex justify-center gap-2">
                                {member.verificationStatus === "verified" ? (
                                    <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-blue-500/20 flex items-center gap-1">
                                        Verified Member <FiShield className="text-[10px]" />
                                    </div>
                                ) : member.verificationStatus === "pending" ? (
                                    <div className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-amber-500/20">
                                        Verification Pending
                                    </div>
                                ) : (
                                    <div className="px-3 py-1 bg-slate-500/10 text-slate-500 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-slate-500/20">
                                        Unverified
                                    </div>
                                )}
                            </div>
                        </div>
                        <FiUser size={120} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12" />
                    </Card>

                    <Card className="p-6 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Membership Info</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Committees</span>
                                <span className="text-[10px] font-black text-primary-600 uppercase">{member.committees?.length || 0} Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                                <span className="text-[10px] font-black text-green-500 uppercase">{member.status}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="lg:col-span-2 p-8 border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-primary-600">
                                <FiUser />
                                <h3 className="text-xs font-black uppercase tracking-widest">Personal Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    icon={<FiUser />}
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={<FiMail />}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    icon={<FiPhone />}
                                />
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-primary-600">
                                <FiShield />
                                <h3 className="text-xs font-black uppercase tracking-widest">Verification & Identity</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="NIC Number"
                                    name="nicNumber"
                                    value={formData.nicNumber}
                                    onChange={handleChange}
                                    placeholder="42101-XXXXXXX-X"
                                />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original NIC Image (URL)</label>
                                    <input
                                        type="text"
                                        name="nicImage"
                                        placeholder="Paste NIC Image URL..."
                                        value={formData.nicImage}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-primary-600">
                                <div className="flex items-center gap-2">
                                    <FiMapPin />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Geo-Location Presence</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={detectLocation}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-primary-600/10 px-4 py-2 rounded-xl border border-primary-600/20 hover:bg-primary-600 hover:text-white transition-all"
                                >
                                    <FiNavigation /> Auto-Detect Presence
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.location.coordinates[0]}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, coordinates: [parseFloat(e.target.value), prev.location.coordinates[1]] } }))}
                                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.location.coordinates[1]}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, coordinates: [prev.location.coordinates[0], parseFloat(e.target.value)] } }))}
                                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-mono"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">Location data helps organizers find members in their vicinity. Your privacy is protected with range-based discovery.</p>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-primary-600">
                                <FiCreditCard />
                                <h3 className="text-xs font-black uppercase tracking-widest">Payout Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Account Title"
                                    name="accountTitle"
                                    value={formData.accountTitle}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    icon={<FiUser />}
                                />
                                <Input
                                    label="Bank Name"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    placeholder="Meezan Bank"
                                    icon={<FiShield />}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="IBAN / Account Number"
                                        name="iban"
                                        value={formData.iban}
                                        onChange={handleChange}
                                        placeholder="PK00MEZN..."
                                        icon={<FiCreditCard />}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-primary-600">
                                <FiLock />
                                <h3 className="text-xs font-black uppercase tracking-widest">Security Settings</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    icon={<FiLock />}
                                />
                                <Input
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    icon={<FiLock />}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" loading={loading} className="w-full py-5 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary-500/20">
                                Save Profile Changes <FiSave className="ml-2" />
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
