"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiLayers, FiDollarSign, FiCalendar, FiUsers, FiPlusCircle, FiCheck } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import { formatMoney } from "../../utils/commonFunc";
import { toast } from "react-toastify";
import { useLanguage } from "../../Components/LanguageContext";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
    const { t } = useLanguage();
    const [committees, setCommittees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(null);
    const [userId, setUserId] = useState(null);

    console.log("committees", committees)
    useEffect(() => {
        const userData = localStorage.getItem("member");
        if (userData) {
            setUserId(JSON.parse(userData)._id);
        }
        fetchOpenCommittees();
    }, []);

    const fetchOpenCommittees = async () => {
        try {
            const res = await fetch("/api/committee/open");
            if (res.ok) {
                const data = await res.json();
                setCommittees(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRequest = async (committeeId) => {
        setJoining(committeeId);
        try {
            // Check auth again
            const userData = localStorage.getItem("member");
            if (!userData) {
                toast.error("Please login first");
                return;
            }
            const uid = JSON.parse(userData)._id;

            const res = await fetch("/api/committee/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ committeeId, userId: uid })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Request submitted successfully!");
            } else {
                toast.info(data.error);
            }
        } catch (err) {
            toast.error("Failed to request join");
        } finally {
            setJoining(null);
        }
    };

    if (loading) return <div className="p-10 text-center uppercase font-black tracking-widest animate-pulse">Scanning Network...</div>;
    const router = useRouter();
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-8 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
                        <FiSearch /> Discover Opportunities
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Explore Pools</h1>
                    <p className="text-slate-500 font-medium max-w-xl italic">
                        Find and join open committees. Secure your spot in the next high-value pool.
                    </p>
                </div>
            </div>

            {committees.length === 0 ? (
                <Card className="py-24 text-center border-dashed">
                    <FiLayers size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-black uppercase text-slate-400">No Open Pools</h3>
                    <p className="text-sm text-slate-400 mt-2">Check back later for new opportunities.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {committees.map((c) => (
                        <Card key={c._id} className="group p-0 overflow-hidden border-none shadow-premium hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900">
                            <div className="p-8 space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Open for Enrollment</span>
                                    </div>
                                    <h3 className=" cursor-pointer text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-primary-600 transition-colors"
                                        onClick={() => { router.push('/userDash/committee/' + c._id) }}
                                    >{c.name}</h3>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 h-10 italic">{c.description}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Monthly</p>
                                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black">
                                            <FiDollarSign size={12} className="text-primary-500" /> {formatMoney(c.monthlyAmount)}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Duration</p>
                                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black">
                                            <FiCalendar size={12} className="text-primary-500" /> {c.monthDuration} Mo
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><FiUsers /> {c.members.length} / {c.maxMembers} Filled</span>
                                </div>

                                <Button
                                    onClick={() => handleJoinRequest(c._id)}
                                    loading={joining === c._id}
                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white font-black uppercase text-[10px] tracking-widest shadow-xl"
                                >
                                    {joining === c._id ? "Sending Request..." : "Request to Join"} <FiPlusCircle className="ml-2" />
                                </Button>
                            </div>
                            <FiLayers size={180} className="absolute -bottom-10 -right-10 text-black/5 dark:text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
