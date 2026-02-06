"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiUser, FiMapPin, FiMessageSquare, FiStar, FiAward, FiLayers, FiCalendar, FiPhone, FiMail, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import BlueTick from "../../Components/Theme/BlueTick";
import { toast } from "react-toastify";
import moment from "moment";

function OrganizerProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const organizerId = searchParams.get("id");

    const [organizer, setOrganizer] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [committees, setCommittees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [member, setMember] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const memberData = localStorage.getItem("member");
        if (memberData) setMember(JSON.parse(memberData));

        if (organizerId) {
            fetchData();
        }
    }, [organizerId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch organizer details (using admin API since organizers are admins)
            const orgRes = await fetch(`/api/admin/${organizerId}`);
            if (!orgRes.ok) throw new Error("Organizer not found");
            const orgData = await orgRes.json();
            setOrganizer(orgData);

            // Fetch reviews
            const reviewsRes = await fetch(`/api/review?organizerId=${organizerId}`);
            const reviewsData = await reviewsRes.json();
            setReviews(Array.isArray(reviewsData) ? reviewsData : []);

            // Fetch committees
            const commsRes = await fetch(`/api/committee?adminId=${organizerId}`);
            const commsData = await commsRes.json();
            setCommittees(Array.isArray(commsData) ? commsData : []);

        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async () => {
        if (!member) return toast.error("Please login to review");
        setSubmittingReview(true);
        try {
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organizerId,
                    memberId: member._id,
                    rating,
                    comment: reviewText
                })
            });

            if (res.ok) {
                toast.success("Review submitted!");
                setReviewText("");
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.error || "Eligibility check failed");
            }
        } catch (err) {
            toast.error("Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-slate-400">Loading Organizer Identity...</div>;

    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "N/A";

    const categorizedComms = {
        open: committees.filter(c => c.status === "open"),
        active: committees.filter(c => c.status === "full" || c.status === "active"),
        finished: committees.filter(c => c.status === "finished")
    };

    return (
        <div className="space-y-12">
            {/* Header / Hero */}
            <div className="relative p-8 md:p-12 rounded-[3rem] bg-slate-950 text-white overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <FiUser size={300} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-primary-600 flex items-center justify-center text-5xl font-black shadow-2xl shadow-primary-500/20">
                        {organizer?.name?.charAt(0)}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter flex items-center justify-center md:justify-start gap-4">
                                {organizer?.name}
                                <BlueTick verified={organizer?.verificationStatus === 'verified'} size={32} />
                            </h1>
                            <p className="text-primary-500 font-black uppercase tracking-[0.3em] text-[10px]">Tier 1 Financial Organizer</p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-primary-500" />
                                <span className="text-sm font-black uppercase opacity-60">{organizer?.city}, {organizer?.country}</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-400">
                                <FiStar fill="currentColor" />
                                <span className="text-sm font-black uppercase tracking-widest">{avgRating} Rating</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <FiAward />
                                <span className="text-sm font-black uppercase tracking-widest">{committees.length} Circuits</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <Button className="px-8 py-3 bg-white text-slate-950 hover:bg-primary-500 hover:text-white border-none text-[10px] font-black uppercase tracking-widest">
                                <FiPhone className="mr-2" /> Contact
                            </Button>
                            <Button variant="secondary" className="px-8 py-3 bg-transparent border-white/20 text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest">
                                <FiMail className="mr-2" /> Email
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Committees Column */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Open Circuits */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Open <span className="text-primary-600">Circuits</span></h2>
                            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {categorizedComms.open.length > 0 ? categorizedComms.open.map(c => (
                                <Card key={c._id} className="p-6 border-none bg-white dark:bg-slate-900 shadow-premium-hover">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-black uppercase tracking-tight text-lg">{c.name}</h4>
                                            <span className="text-[9px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">Open</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                            <span>Monthly: RS {c.monthlyAmount?.toLocaleString()}</span>
                                            <span>{c.monthDuration} Months</span>
                                        </div>
                                        <Button
                                            onClick={() => router.push(`/userDash/join?id=${c._id}`)}
                                            className="w-full py-4 text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Join Now
                                        </Button>
                                    </div>
                                </Card>
                            )) : (
                                <p className="text-xs font-bold text-slate-400 uppercase italic">No circuits currently open for recruitment.</p>
                            )}
                        </div>
                    </section>

                    {/* Active/Past */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Ongoing & <span className="text-slate-400">Historical</span></h2>
                        <div className="space-y-4">
                            {[...categorizedComms.active, ...categorizedComms.finished].map(c => (
                                <div key={c._id} className="flex items-center justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group hover:border-primary-500/50 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${c.status === 'finished' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'}`}>
                                            <FiLayers size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-tight">{c.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{moment(c.startDate).format("MMM YYYY")} - {moment(c.endDate).format("MMM YYYY")}</p>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl ${c.status === 'finished' ? 'bg-slate-100 text-slate-500' : 'bg-primary-100 text-primary-700'}`}>
                                        {c.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Column: Reviews */}
                <div className="space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Participant <span className="text-primary-600">Reviews</span></h2>

                        {/* New Review Form */}
                        {member && (
                            <Card className="p-6 bg-primary-500/5 border-primary-500/10 border-2 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 leading-none">Share your Experience</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} onClick={() => setRating(s)} className={`transition-colors ${rating >= s ? 'text-amber-500' : 'text-slate-300'}`}>
                                            <FiStar fill={rating >= s ? 'currentColor' : 'none'} size={20} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 text-sm font-medium border-none focus:ring-2 focus:ring-primary-500/50 resize-none h-24"
                                    placeholder="Briefly describe your cycle experience..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <Button
                                    onClick={handleReviewSubmit}
                                    loading={submittingReview}
                                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest"
                                >
                                    Broadcast Review
                                </Button>
                            </Card>
                        )}

                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                            {reviews.length > 0 ? reviews.map(r => (
                                <div key={r._id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                {r.member?.name?.charAt(0)}
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-tight">{r.member?.name}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 text-[10px] font-black">
                                            <FiStar fill="currentColor" /> {r.rating}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium italic border-l-2 border-primary-500/20 pl-4">{r.comment}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{moment(r.createdAt).fromNow()}</p>
                                </div>
                            )) : (
                                <div className="text-center py-10 opacity-40">
                                    <FiMessageSquare className="mx-auto mb-4" size={40} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No signals recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function OrganizerProfilePage() {
    return (
        <Suspense fallback={<div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-slate-400">Initializing Portal...</div>}>
            <OrganizerProfileContent />
        </Suspense>
    );
}
