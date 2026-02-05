"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    FiArrowLeft, FiLayers, FiCheckCircle, FiClock, FiAlertCircle,
    FiCalendar, FiDollarSign, FiInfo, FiUploadCloud,
    FiXCircle, FiArrowRight, FiActivity, FiUser, FiMessageSquare, FiStar, FiShield
} from "react-icons/fi";
import Card from "../../../Components/Theme/Card";
import Button from "../../../Components/Theme/Button";
import Input from "../../../Components/Theme/Input";
import Table, { TableRow, TableCell } from "../../../Components/Theme/Table";
import ChatBox from "../../../Components/ChatBox";
import BlueTick from "../../../Components/Theme/BlueTick";
import { formatMoney } from "../../../utils/commonFunc";
import { submitPayment } from "../../apis";
import { toast } from "react-toastify";
import moment from "moment";
import { useLanguage } from "../../../Components/LanguageContext";

export default function CommitteeDetailPage() {
    const { t } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const committeeId = params.id;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [paymentData, setPaymentData] = useState({
        screenshot: "",
        description: "",
        transactionId: ""
    });

    useEffect(() => {
        const userData = localStorage.getItem("member");
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchDetails();
    }, [committeeId]);

    const fetchDetails = async () => {
        try {
            const res = await fetch(`/api/committee/${committeeId}/details`);
            if (!res.ok) throw new Error("Failed to fetch dimensions");
            const result = await res.json();
            setData(result);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitPayment(committeeId, {
                ...paymentData,
                memberId: user._id,
                month: data.committee.currentMonth
            });
            toast.success("Payment submitted for authentication");
            setIsPayModalOpen(false);
            setPaymentData({ screenshot: "", description: "", transactionId: "" });
            fetchDetails();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="py-24 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-[2rem] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Accessing Pool Data...</p>
        </div>
    );

    if (!data) return <div className="p-12 text-center text-slate-500 uppercase font-black">Circuit Offline</div>;

    const { committee, organizer } = data;
    const myPayment = committee.payments?.find(p => p.month === committee.currentMonth && (p.member?._id === user?._id || p.member === user?._id));
    const turnRecord = committee.result?.find(r => r.position === committee.currentMonth);
    const isMyTurn = (turnRecord?.member?._id === user?._id || turnRecord?.member === user?._id);

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-2">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase hover:translate-x-[-4px] transition-transform"
                    >
                        <FiArrowLeft /> Back to Discovery
                    </button>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{committee.name}</h1>
                    <p className="text-slate-500 font-medium italic">{committee.description}</p>
                </div>
                <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl ${committee.status === 'ongoing' ? 'bg-green-600 text-white' : 'bg-primary-600 text-white'
                    }`}>
                    <FiActivity size={16} /> Pool Status: {committee.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 bg-slate-900 text-white border-none space-y-4">
                            <FiDollarSign className="text-primary-500" size={24} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Installment</p>
                                <p className="text-2xl font-black">PKR {formatMoney(committee.monthlyAmount)}</p>
                            </div>
                        </Card>
                        <Card className="p-6 bg-slate-900 text-white border-none space-y-4">
                            <FiCalendar className="text-primary-500" size={24} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Duration</p>
                                <p className="text-2xl font-black">{committee.monthDuration} Months</p>
                            </div>
                        </Card>
                        <Card className="p-6 bg-slate-900 text-white border-none space-y-4">
                            <FiClock className="text-primary-500" size={24} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Current Cycle</p>
                                <p className="text-2xl font-black">Month {committee.currentMonth}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Member Payment Board */}
                    <Card className="p-0 overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Active Payment Board</h3>
                                <p className="text-xs text-slate-400 font-medium">Real-time status of all circuit nodes for Month {committee.currentMonth}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-[8px] font-black uppercase text-slate-400">Verified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                                    <span className="text-[8px] font-black uppercase text-slate-400">Unpaid</span>
                                </div>
                            </div>
                        </div>
                        <Table headers={["Member Identity", "Status", "Timestamp"]}>
                            {committee.members.map((m) => {
                                const p = committee.payments?.find(pm => pm.month === committee.currentMonth && (pm.member?._id === m._id || pm.member === m._id));
                                return (
                                    <TableRow key={m._id}>
                                        <TableCell className="font-black uppercase text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px]">
                                                    {m.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p>{m.name}</p>
                                                    <p className="text-[8px] text-slate-400 normal-case font-medium">{m.city || "Global Node"}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${p?.status === "verified" ? "bg-green-100 text-green-600" :
                                                    p?.status === "pending" ? "bg-amber-100 text-amber-600" :
                                                        "bg-slate-100 text-slate-400"
                                                }`}>
                                                {p?.status || "Awaiting Payment"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[10px] font-medium text-slate-400 italic">
                                            {p ? moment(p.updatedAt).fromNow() : "---"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </Table>
                    </Card>

                    {/* Organizer Trust Card */}
                    <Card className="p-8 md:p-12 border-none bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center text-3xl font-black shadow-2xl">
                                    {organizer.name.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Organizer Reputation</p>
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                        {organizer.name}
                                        <BlueTick verified={organizer.verificationStatus === 'verified'} size={24} />
                                    </h4>
                                    <div className="flex items-center gap-2 text-amber-500 font-black text-sm">
                                        <FiStar fill="currentColor" /> {organizer.averageRating?.toFixed(1) || "New"} <span className="text-slate-400 text-xs normal-case">({organizer.totalReviews} Reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-white border-none shadow-xl hover:bg-primary-600 hover:text-white text-[10px] font-black uppercase tracking-widest"
                                    onClick={() => setActiveChat(organizer)}
                                >
                                    <FiMessageSquare className="mr-2" /> Message Organizer
                                </Button>
                            </div>
                        </div>

                        {/* Recent Reviews */}
                        <div className="space-y-6">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Testimony</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {organizer.reviews?.slice(0, 2).map((rev, i) => (
                                    <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
                                        <div className="flex justify-between items-center text-amber-500">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold">{moment(rev.createdAt).format("MMM DD")}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{rev.comment}"</p>
                                        <p className="text-[9px] font-black uppercase text-primary-600">{rev.member?.name}</p>
                                    </div>
                                ))}
                                {(!organizer.reviews || organizer.reviews.length === 0) && (
                                    <div className="col-span-full p-8 text-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-400 font-bold uppercase italic">No reviews logged yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Payment Status Card */}
                    <Card className="p-8 bg-primary-600 text-white border-none shadow-premium relative overflow-hidden">
                        <FiShield className="absolute -bottom-8 -right-8 text-white/10" size={160} />
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-200 italic">Personal Vault Status</p>
                                <h3 className="text-4xl font-black uppercase tracking-tighter">
                                    {myPayment?.status === 'verified' ? 'Authenticated' :
                                        myPayment?.status === 'pending' ? 'Auth Pending' : 'Action Required'}
                                </h3>
                            </div>

                            <div className="p-6 bg-black/20 rounded-[2rem] border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary-200">Current Installment</p>
                                    <p className="text-xl font-black">RS {formatMoney(committee.monthlyAmount + (committee.isFeeMandatory ? (committee.organizerFee || 0) : 0))}</p>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between items-center">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary-200">Pool Cycle</p>
                                    <p className="text-sm font-black">Month {committee.currentMonth}</p>
                                </div>
                            </div>

                            <Button
                                className={`w-full py-5 font-black uppercase tracking-[0.2em] text-xs shadow-2xl ${myPayment?.status === 'verified' || myPayment?.status === 'pending'
                                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                                        : "bg-white text-primary-600 hover:scale-[0.98]"
                                    }`}
                                disabled={myPayment?.status === 'verified' || myPayment?.status === 'pending'}
                                onClick={() => setIsPayModalOpen(true)}
                            >
                                {myPayment?.status === 'verified' ? "Verified & Locked" :
                                    myPayment?.status === 'pending' ? "Verification in Progress" : "Sync Installment Data"}
                                <FiArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </Card>

                    {/* Bank Info */}
                    <Card className="p-8 bg-white dark:bg-slate-900 shadow-premium border-none space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-600/10 text-primary-600 rounded-xl">
                                <FiDollarSign />
                            </div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vault Coordinates</h5>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400">Account Identity</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white uppercase">{committee.bankDetails?.accountTitle || "ADMIN PENDING"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400">Bank Circuit</p>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">{committee.bankDetails?.bankName || "N/A"}</p>
                            </div>
                            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[9px] font-black uppercase text-primary-600">IBAN / Protocol</p>
                                <p className="text-xs font-mono font-black text-slate-900 dark:text-white break-all">{committee.bankDetails?.iban || "NO IBAN PROVIDED"}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Payment Modal */}
            {isPayModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <Card className="max-w-3xl w-full bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border-none p-0">
                        <form onSubmit={handlePaymentSubmit} className="flex flex-col md:flex-row h-full max-h-[90vh]">
                            {/* Sidebar */}
                            <div className="md:w-72 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
                                <FiInfo className="absolute -bottom-4 -right-4 text-white/5 font-black" size={140} />
                                <div className="space-y-8 relative z-10">
                                    <h3 className="text-3xl font-black tracking-tighter uppercase whitespace-pre-wrap">Sync Installment</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base Installment</p>
                                            <p className="text-2xl font-black tracking-tighter">RS {formatMoney(committee.monthlyAmount)}</p>
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Required</p>
                                            <p className="text-3xl font-black text-white">RS {formatMoney(committee.monthlyAmount + (committee.isFeeMandatory ? (committee.organizerFee || 0) : 0))}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="flex-1 p-10 md:p-14 space-y-10 overflow-y-auto">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Transaction Evidence</h4>
                                    <Button variant="ghost" onClick={() => setIsPayModalOpen(false)} className="p-2 h-auto text-slate-300 hover:text-red-500 transition-colors">
                                        <FiXCircle size={32} />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    <Input
                                        label="Transaction ID / Ref"
                                        placeholder="e.g. TRX-9922883"
                                        value={paymentData.transactionId}
                                        onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                                        required
                                        className="h-16 font-mono font-black uppercase text-sm"
                                    />
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Screenshot Proof (Base64/URL)</label>
                                        <div className="relative group">
                                            <textarea
                                                placeholder="Paste screenshot data or Provide URL..."
                                                value={paymentData.screenshot}
                                                onChange={(e) => setPaymentData({ ...paymentData, screenshot: e.target.value })}
                                                required
                                                rows={4}
                                                className="w-full bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 text-xs font-mono resize-none focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                                            />
                                            <FiUploadCloud className="absolute right-6 top-6 text-slate-300" size={24} />
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" loading={submitting} className="w-full py-6 bg-primary-600 hover:bg-primary-700 font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] shadow-premium">
                                    Finalize Submission <FiArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {activeChat && (
                <ChatBox
                    committeeId={committeeId}
                    currentUserId={user?._id}
                    currentUserModel="Member"
                    otherUserId={activeChat._id}
                    otherUserName={activeChat.name}
                    otherUserModel={activeChat.isAdmin ? "Admin" : "Member"}
                    onClose={() => setActiveChat(null)}
                />
            )}
        </div>
    );
}
