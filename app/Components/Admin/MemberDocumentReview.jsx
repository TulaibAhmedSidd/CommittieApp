"use client";

import React, { useState } from "react";
import { FiShield, FiUser, FiCheck, FiX, FiExternalLink, FiImage, FiMapPin, FiMaximize2 } from "react-icons/fi";
import Button from "../Theme/Button";
import BlueTick from "../Theme/BlueTick";

/**
 * Reusable component for Admins to review Member document credentials
 * Supports NIC Front, NIC Back, Electricity Bill, and Supporting Assets
 */
export default function MemberDocumentReview({ member, onAction, actionLoading }) {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!member) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* ID Header */}
            <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <FiShield size={80} />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary-500/20">
                    {(member?.name || "?").charAt(0)}
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic flex items-center gap-2">
                        {member.name}
                        <BlueTick verified={member.verificationStatus === "verified"} size={16} />
                    </h2>
                    <div className="flex gap-4 mt-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <FiUser size={10} /> {member.verificationStatus} Profile
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono italic">
                            <FiMapPin size={10} /> {member.city || member.country || 'Location Unknown'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Document Verification Matrix */}
            <div className="space-y-4">
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <FiImage size={12} className="text-primary-500" /> Mandatory Identity Protocols
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <DocumentButton
                            label="NIC Front"
                            url={member.nicFront}
                            onClick={() => setSelectedImage({ url: member.nicFront, label: 'NIC Front' })}
                        />
                        <DocumentButton
                            label="NIC Back"
                            url={member.nicBack}
                            onClick={() => setSelectedImage({ url: member.nicBack, label: 'NIC Back' })}
                        />
                        <DocumentButton
                            label="Utility Bill"
                            url={member.electricityBill}
                            onClick={() => setSelectedImage({ url: member.electricityBill, label: 'Utility Bill' })}
                        />
                    </div>
                </div>

                {member.documents?.length > 0 && (
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <FiExternalLink size={12} className="text-blue-500" /> Supplemental Financial Assets
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {member.documents.map((doc, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage({ url: doc.url, label: doc.name })}
                                    className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:text-primary-600 hover:border-primary-600 transition-all shadow-sm"
                                >
                                    {doc.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Optional Actions Group */}
            {onAction && member.verificationStatus !== "verified" && (
                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        onClick={() => onAction(member._id, 'verified', member.role)}
                        loading={actionLoading === member._id}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 py-4 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20"
                    >
                        <FiCheck size={16} className="mr-2" /> Authorize Trust Badge
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => onAction(member._id, 'unverified', member.role)}
                        className="flex-1 bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-600 hover:text-white py-4 text-[11px] font-black uppercase tracking-widest"
                    >
                        <FiX size={16} className="mr-2" /> Flag Irregularity
                    </Button>
                </div>
            )}

            {/* Local Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/95 animate-in fade-in duration-300 backdrop-blur-md"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-6xl w-full space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center text-white p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-600 rounded-xl">
                                    <FiMaximize2 />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter italic">Resource Preview</h3>
                                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{selectedImage.label}</p>
                                </div>
                            </div>
                            <button className="p-3 hover:bg-white/10 rounded-2xl transition-all group">
                                <FiX size={32} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                        <div className="rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900 flex items-center justify-center min-h-[400px]">
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.label}
                                className="w-full h-auto max-h-[75vh] object-contain"
                            />
                        </div>
                        <p className="text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tap anywhere to escape preview</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function DocumentButton({ label, url, onClick }) {
    const exists = !!url;
    return (
        <button
            onClick={onClick}
            disabled={!exists}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group ${exists
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-primary-600 hover:scale-[1.02] shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/20 border-transparent text-slate-300 cursor-not-allowed'
                }`}
        >
            <div className={`p-3 rounded-xl transition-colors ${exists ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/10 group-hover:bg-primary-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                <FiImage size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            {exists ? (
                <span className="text-[8px] font-black text-primary-500 uppercase tracking-tight">Available • View</span>
            ) : (
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight">Not Uploaded</span>
            )}
        </button>
    );
}
