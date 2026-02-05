"use client";

import React, { useState, useEffect } from "react";
import { FiUsers, FiClock, FiCheckCircle, FiShield, FiStar, FiMessageSquare, FiX, FiInfo, FiExternalLink } from "react-icons/fi";
import Card from "./Theme/Card";
import BlueTick from "./Theme/BlueTick";
import Button from "./Theme/Button";
import Input from "./Theme/Input";
import { toast } from "react-toastify";
import { useLanguage } from "./LanguageContext";

export default function AssociationTransparency({ member }) {
    const { t } = useLanguage();
    const [selectedOrganizer, setSelectedOrganizer] = useState(null);
    const [orgDetails, setOrgDetails] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

    const fetchOrganizerDetails = async (id) => {
        setReviewLoading(true);
        try {
            const res = await fetch(`/api/admin/${id}/details`);
            const data = await res.json();
            setOrgDetails(data);
        } catch (err) {
            toast.error("Failed to load details");
        } finally {
            setReviewLoading(false);
        }
    };

    const handleOrganizerClick = (org) => {
        setSelectedOrganizer(org);
        fetchOrganizerDetails(org._id);
    };

    const submitReview = async () => {
        if (!reviewForm.comment) return toast.error("Please add a comment");
        setSubmitLoading(true);
        try {
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organizerId: selectedOrganizer._id,
                    memberId: member._id,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment
                })
            });
            if (res.ok) {
                toast.success("Review submitted!");
                fetchOrganizerDetails(selectedOrganizer._id);
                setReviewForm({ rating: 5, comment: "" });
            }
        } catch (err) {
            toast.error("Failed to submit review");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (!member) return null;

    const organizers = member.organizers || [];
    const pendingOrganizers = member.pendingOrganizers || [];

    if (organizers.length === 0 && pendingOrganizers.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-primary-600 rounded-full" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                    Organizers & Trust Circles
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizers.map((org, i) => <div
                    key={org._id}
                    onClick={() => handleOrganizerClick(org)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-primary-600/10 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <FiShield size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1">
                            {org.name || "Organizer"}
                            <BlueTick verified={org.verificationStatus === "verified"} size={12} />
                        </p>
                        <div className="flex items-center gap-1 text-[9px] font-black text-green-600 uppercase tracking-widest">
                            <FiCheckCircle size={10} /> Associated
                        </div>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiExternalLink size={14} className="text-slate-400" />
                    </div>
                </div>
                )}

                {pendingOrganizers.map((orgId, i) => (
                    <Card key={`pending-${i}`} className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border-amber-500/10 hover:border-amber-500/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                <FiClock size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-tight italic">Pending Authorization</p>
                                <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                                    <FiClock size={10} /> Requested
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            {/* Organizer Details Modal */}
            {selectedOrganizer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl relative">
                        <button
                            onClick={() => setSelectedOrganizer(null)}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors z-20"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                            {/* Left Side: Stats & Info */}
                            <div className="lg:col-span-2 p-8 bg-slate-50 dark:bg-slate-800/50 space-y-8 border-r border-slate-100 dark:border-slate-800">
                                <div className="space-y-4">
                                    <div className="w-20 h-20 rounded-3xl bg-primary-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary-600/30">
                                        {selectedOrganizer.name?.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                            {selectedOrganizer.name}
                                            <BlueTick verified={selectedOrganizer.verificationStatus === 'verified'} size={16} />
                                        </h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Organizer ID: {selectedOrganizer._id.substring(selectedOrganizer._id.length - 8)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Circuit Trust</p>
                                        <div className="flex items-center gap-1 text-amber-500 font-black">
                                            <FiStar fill="currentColor" /> {orgDetails?.averageRating || "N/A"}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Pools</p>
                                        <p className="font-black text-slate-900 dark:text-white">{orgDetails?.committeeCount || 0}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <FiMapPin className="text-primary-600" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{orgDetails?.city || "Location Shared"}, {orgDetails?.country || "Pakistan"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <FiCheckCircle className="text-green-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{orgDetails?.verificationStatus === 'verified' ? 'Identity KYC Verified' : 'Standard Profile'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Reviews & Interaction */}
                            <div className="lg:col-span-3 p-8 space-y-8">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <FiMessageSquare /> Financial Feedback / {orgDetails?.reviews?.length || 0} Records
                                    </h4>

                                    {/* Submit Review */}
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">Rate Organizer</p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                                        className={`transition-colors ${reviewForm.rating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                                                    >
                                                        <FiStar fill={reviewForm.rating >= star ? 'currentColor' : 'none'} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Write your experience with this organizer..."
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                            className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 text-xs font-bold outline-none border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/20 h-24 transition-all"
                                        />
                                        <Button
                                            loading={submitLoading}
                                            onClick={submitReview}
                                            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em]"
                                        >
                                            Publish Review <FiCheckCircle className="ml-2" />
                                        </Button>
                                    </div>

                                    {/* Existing Reviews */}
                                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {orgDetails?.reviews?.length > 0 ? orgDetails.reviews.map((rev) => (
                                            <div key={rev._id} className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{rev.member?.name}</p>
                                                    <div className="flex gap-0.5 text-amber-500 text-[10px]">
                                                        {[...Array(rev.rating)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{rev.comment}"</p>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No reviews yet for this organizer</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
