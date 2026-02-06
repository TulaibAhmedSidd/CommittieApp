"use client";

import React, { useState, useEffect } from "react";
import { FiShield, FiCheckCircle, FiInfo, FiFileText, FiCamera, FiArrowRight, FiUploadCloud } from "react-icons/fi";
import Card from "./Theme/Card";
import Button from "./Theme/Button";
import UploadCapture from "./Theme/UploadCapture";
import { toast } from "react-toastify";

export default function VerifiedMember({ member, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState({
        nicFront: member?.nicFront || "",
        nicBack: member?.nicBack || "",
        electricityBill: member?.electricityBill || "",
        supporting: member?.documents || []
    });

    const isDirty =
        docs.nicFront !== (member?.nicFront || "") ||
        docs.nicBack !== (member?.nicBack || "") ||
        docs.electricityBill !== (member?.electricityBill || "");

    const handleUpload = (field, url) => {
        setDocs(prev => ({ ...prev, [field]: url }));
    };

    const saveVerification = async () => {
        if (!docs.nicFront || !docs.nicBack || !docs.electricityBill) {
            return toast.error("Please upload all mandatory documents first!");
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/member/${member._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nicFront: docs.nicFront,
                    nicBack: docs.nicBack,
                    electricityBill: docs.electricityBill,
                    verificationStatus: "pending"
                })
            });

            if (res.ok) {
                const updated = await res.json();
                localStorage.setItem("member", JSON.stringify(updated));
                onUpdate && onUpdate(updated);
                toast.success("Verification documents submitted for review!");
            }
        } catch (err) {
            toast.error("Failed to submit verification");
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        unverified: "bg-slate-500/10 text-slate-500 border-slate-500/20",
        pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        verified: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                            <FiShield size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                            Verification <span className="text-primary-600">Hub</span>
                        </h2>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest max-w-md">
                        The ultimate badge of trust. Verify your identity to unlock premium committees and higher limits.
                    </p>
                </div>

                <div className={`px-6 py-3 rounded-2xl border font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ${statusColors[member?.verificationStatus || "unverified"]}`}>
                    Status: {member?.verificationStatus || "Unverified"}
                    {member?.verificationStatus === "verified" && <FiCheckCircle />}
                </div>
            </div>

            {/* Mandatory Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary-600 px-2">
                    <FiInfo />
                    <h3 className="text-xs font-black uppercase tracking-widest">Mandatory Identity Proofs</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="p-6 space-y-4 border-none shadow-premium-hover bg-white dark:bg-slate-900 overflow-visible">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                            <FiFileText />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">NIC Document</p>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Front Face</h4>
                        </div>
                        <UploadCapture
                            label="NIC Front"
                            value={docs.nicFront}
                            onUpload={(url) => handleUpload("nicFront", url)}
                            memberId={member?._id}
                        />
                    </Card>

                    <Card className="p-6 space-y-4 border-none shadow-premium-hover bg-white dark:bg-slate-900 overflow-visible">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                            <FiFileText />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">NIC Document</p>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Back Face</h4>
                        </div>
                        <UploadCapture
                            label="NIC Back"
                            value={docs.nicBack}
                            onUpload={(url) => handleUpload("nicBack", url)}
                            memberId={member?._id}
                        />
                    </Card>

                    <Card className="p-6 space-y-4 border-none shadow-premium-hover bg-white dark:bg-slate-900 overflow-visible">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                            <FiUploadCloud />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address Proof</p>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Electricity Bill</h4>
                        </div>
                        <UploadCapture
                            label="Utility Bill"
                            value={docs.electricityBill}
                            onUpload={(url) => handleUpload("electricityBill", url)}
                            memberId={member?._id}
                        />
                    </Card>
                </div>
            </div>

            {/* Supporting Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-500 px-2">
                    <FiArrowRight />
                    <h3 className="text-xs font-black uppercase tracking-widest">Supporting Documents (Optional)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {["Gas Bill", "Water Bill", "Work ID", "Bank Statement"].map((type) => (
                        <Card key={type} className="p-4 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary-500/30 transition-colors overflow-visible">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{type}</p>
                            <UploadCapture
                                label={type}
                                value={docs.supporting.find(d => d.name === type)?.url || ""}
                                onUpload={(url) => {
                                    const newSupport = [...docs.supporting];
                                    const idx = newSupport.findIndex(d => d.name === type);
                                    if (idx > -1) newSupport[idx].url = url;
                                    else newSupport.push({ name: type, url });
                                    setDocs(prev => ({ ...prev, supporting: newSupport }));
                                }}
                                memberId={member?._id}
                            />
                        </Card>
                    ))}
                </div>
            </div>

            {/* Action Bar */}
            <div className="sticky bottom-8 z-20 max-w-2xl mx-auto">
                <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/10 flex items-center justify-between gap-6 animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center gap-4 pl-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary-600/20 flex items-center justify-center text-primary-500">
                            <FiInfo />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-black text-white uppercase tracking-tight">Ready for Review?</p>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Submitting will freeze edits during audit.</p>
                        </div>
                    </div>
                    <Button
                        onClick={saveVerification}
                        loading={loading}
                        disabled={!isDirty && member?.verificationStatus !== "unverified"}
                        className="py-4 px-12 bg-primary-600 hover:bg-primary-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20"
                    >
                        Submit Verification
                    </Button>
                </div>
            </div>
        </div>
    );
}
