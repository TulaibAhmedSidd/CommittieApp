"use client";

import BlueTick from "@/app/Components/Theme/BlueTick";
import { FiCopy, FiExternalLink, FiUser } from "react-icons/fi";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FiArrowLeft, FiCheckCircle, FiXCircle, FiBell,
    FiEye, FiCalendar, FiDollarSign, FiZap, FiActivity, FiMessageSquare, FiShield, FiX
} from "react-icons/fi";
import { toast } from "react-toastify";
import moment from "moment";
import {
    fetchCommitteebyId,
    pingMember,
    updatePaymentStatus,
    updateCommitteeStatus,
    manageComRequest
} from "../apis";

import Modal from "../../Components/Theme/Modal";
import UploadCapture from "../../Components/Theme/UploadCapture";
import { useLanguage } from "../../Components/LanguageContext";
import ChatBox from "../../Components/ChatBox";
import Button from "@/app/Components/Theme/Button";
import Card from "@/app/Components/Theme/Card";
import SectionHeader from "@/app/Components/Theme/SectionHeader";
import StatusPill from "@/app/Components/Theme/StatusPill";
import Table, { TableCell, TableRow } from "@/app/Components/Theme/Table";
import Input from "@/app/Components/Theme/Input";
import MemberDocumentReview from "../../Components/Admin/MemberDocumentReview";

function ManageContent() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const committeeId = searchParams.get("id");

    const [committee, setCommittee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [viewingPayment, setViewingPayment] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [payoutModalOpen, setPayoutModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [inspectingMember, setInspectingMember] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [payoutData, setPayoutData] = useState({
        memberId: "",
        memberName: "",
        amount: 0,
        transactionId: "",
        screenshot: ""
    });
    const [chatConfig, setChatConfig] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        const detail = localStorage.getItem("admin_detail");
        if (!token) {
            router.push("/admin/login");
            return;
        }
        if (!committeeId) {
            router.replace("/admin/manage-committie");
            return;
        }
        setAdmin(JSON.parse(detail));
        loadCommittee();
    }, [committeeId, router]);

    const loadCommittee = async () => {
        setLoading(true);
        try {
            const data = await fetchCommitteebyId(committeeId);
            setCommittee(data);
            setSelectedMonth(prev => prev || data.currentMonth || 1);
        } catch (err) {
            toast.error(t("error") + ": " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePing = async (memberId, customMessage) => {
        setActionLoading(true);
        try {
            await pingMember(committeeId, memberId, admin._id, customMessage);
            toast.success("Ping sent to member");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdatePayment = async (paymentId, status, memberId = null, reason = "", month = null) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const cleanMemberId = (memberId?._id || memberId)?.toString() || null;
            const res = await fetch(`/api/committee/${committeeId}/payment`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    paymentId: paymentId?.toString(), 
                    status, 
                    memberId: cleanMemberId, 
                    reason,
                    month: month || selectedMonth 
                })
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || resData.message || "Failed to update payment status");

            toast.success(`Payment ${status === "verified" ? "authenticated and confirmed" : status}`);
            loadCommittee();
            setViewingPayment(null);
            setRejectionReason("");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAdvanceMonth = async () => {
        if (!confirm("Are you sure you want to advance to the next month? This will notify the next winner.")) return;
        setActionLoading(true);
        try {
            await updateCommitteeStatus(committeeId, "advance_month", admin._id);
            toast.success("Month advanced successfully");
            loadCommittee();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseBC = async () => {
        if (!confirm("Are you sure you want to close this BC?")) return;
        setActionLoading(true);
        try {
            await updateCommitteeStatus(committeeId, "close_bc", admin._id);
            toast.success("BC closed successfully");
            loadCommittee();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openPayoutModal = (member) => {
        const totalAmount = committee.monthlyAmount * committee.members.length;
        setPayoutData({
            memberId: member._id,
            memberName: member.name,
            amount: totalAmount,
            transactionId: "",
            screenshot: ""
        });
        setPayoutModalOpen(true);
    };

    const handleRecordPayout = async () => {
        if (!payoutData.screenshot || !payoutData.transactionId) {
            return toast.warning("Evidence and Transaction ID are required");
        }

        setActionLoading(true);
        try {
            const res = await fetch(`/api/committee/${committeeId}/payout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminId: admin._id,
                    memberId: payoutData.memberId,
                    amount: payoutData.amount,
                    month: committee.currentMonth,
                    transactionId: payoutData.transactionId,
                    screenshot: payoutData.screenshot
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Payout recorded successfully");
            setPayoutModalOpen(false);
            loadCommittee();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequest = async (memberId, action) => {
        setActionLoading(true);
        try {
            await manageComRequest(committeeId, memberId, action, admin._id);
            toast.success(`Request ${action}ed`);
            loadCommittee();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center uppercase font-black tracking-widest animate-pulse">Initializing Data...</div>;
    if (!committee) return <div className="p-10 text-center">Committee not found</div>;

    return (
        <div className="space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8">
            <div className="dashboard-shell overflow-hidden p-8 md:p-10">
                <div className="absolute inset-y-0 right-0 w-72 bg-gradient-to-l from-primary-500/10 to-transparent" />
                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <Button variant="ghost" onClick={() => router.back()} className="w-fit text-slate-500 hover:text-primary-600 font-bold uppercase text-[10px] tracking-widest p-0">
                            <FiArrowLeft className="mr-2" /> {t("back") || "Back"}
                        </Button>
                        <SectionHeader
                            eyebrow="Committee Operations"
                            icon={FiActivity}
                            title={committee.name}
                            description={`Month ${committee.currentMonth} of ${committee.monthDuration}. Review requests, verify payments, and keep beneficiary movement transparent.`}
                        />
                        <div className="flex flex-wrap gap-2">
                            <StatusPill tone="info">Status: {committee.status}</StatusPill>
                            <StatusPill tone="success">Members: {committee.members?.length || 0}</StatusPill>
                            <StatusPill tone="warning">Pending: {committee.pendingMembers?.length || 0}</StatusPill>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                    {committee.status !== "finished" && (
                        <>
                            <Button onClick={handleAdvanceMonth} loading={actionLoading} className="bg-amber-600 hover:bg-amber-700 text-[10px] tracking-widest font-black uppercase py-4 shadow-xl shadow-amber-500/20">
                                <FiZap className="mr-2" /> {t("advanceMonth") || "Advance Month"}
                            </Button>
                            <Button onClick={handleCloseBC} loading={actionLoading} className="bg-red-600 hover:bg-red-700 text-[10px] tracking-widest font-black uppercase py-4 shadow-xl shadow-red-500/20">
                                <FiXCircle className="mr-2" /> {t("closeBC") || "Close BC"}
                            </Button>
                        </>
                    )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Pending Requests */}
                    {committee.pendingMembers?.length > 0 && (
                        <Card title="Pending Join Requests" className="border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-900/30">
                            <div className="overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm mt-4 bg-white dark:bg-slate-900">
                                <Table headers={["Member Name", "Identity Check", "Actions"]}>
                                    {committee.pendingMembers.map((member) => (
                                        <TableRow key={member._id}>
                                            <TableCell className="font-black uppercase text-slate-900 dark:text-white">
                                                {member.name}
                                                <span className="block text-[9px] text-slate-400 normal-case font-medium">{member.email}</span>
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => setSelectedMember(member)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white transition-all group"
                                                >
                                                    <FiShield className="group-hover:animate-pulse" /> Verify Identity
                                                </button>
                                            </TableCell>
                                            <TableCell className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    loading={actionLoading}
                                                    onClick={() => handleRequest(member._id, "approve")}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-black uppercase text-[10px] tracking-widest px-4 py-2"
                                                >
                                                    <FiCheckCircle className="mr-1" /> Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    loading={actionLoading}
                                                    onClick={() => handleRequest(member._id, "reject")}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest px-4 py-2"
                                                >
                                                    <FiXCircle className="mr-1" /> Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Table>
                            </div>
                        </Card>
                    )}

                    {/* Member Details Modal */}
                    {selectedMember && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <Card className="max-w-4xl w-full p-10 space-y-8 bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <FiShield size={160} />
                                </div>

                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Review Credentials</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Inspecting identity documents for Join Request</p>
                                    </div>
                                    <button onClick={() => setSelectedMember(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                                        <FiX size={28} className="text-slate-400 group-hover:rotate-90 transition-transform" />
                                    </button>
                                </div>

                                <div className="relative z-10">
                                    <MemberDocumentReview member={selectedMember} />
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end relative z-10">
                                    <Button onClick={() => setSelectedMember(null)} className="px-12 py-4 text-[10px] font-black uppercase tracking-widest bg-slate-900 shadow-xl">Close Review</Button>
                                </div>
                            </Card>
                        </div>
                    )}

                    <Card className="p-8 space-y-6 bg-white dark:bg-slate-900 border-none shadow-premium">
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-primary-600 text-white rounded-md text-[9px] font-black uppercase tracking-wider">
                                            Cycle Navigation · ماہانہ ریکارڈ
                                        </span>
                                        {selectedMonth !== committee.currentMonth && (
                                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-md text-[9px] font-black uppercase">
                                                Historical Mode
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                        {committee.name} — Month {selectedMonth} Roster & Ledger
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {selectedMonth === committee.currentMonth
                                            ? "Active billing cycle — reconcile payments, inspect member credentials, and disburse payouts."
                                            : `Reviewing past installment records and payment proofs for Month ${selectedMonth}.`}
                                    </p>
                                </div>
                            </div>

                            {/* Month Navigation Tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                {Array.from({ length: committee.monthDuration || 1 }, (_, i) => i + 1).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setSelectedMonth(m)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                            selectedMonth === m
                                                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20 scale-[1.02]"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                        }`}
                                    >
                                        <span>Month {m}</span>
                                        {m === committee.currentMonth && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <Table headers={["Member / Contact", "KYC & Payout Details", "Due Amount", "Cycle Status", "Actions"]}>
                                {committee.members.map((member) => {
                                    const payment = (committee.payments || []).slice().reverse().find(p => 
                                        Number(p.month) === Number(selectedMonth) && 
                                        ((p.member?._id || p.member)?.toString() === member._id.toString())
                                    );
                                    const turn = (committee.result || []).find(r => Number(r.position) === Number(selectedMonth));
                                    const isBeneficiary = (turn?.member === member._id || turn?.member?._id === member._id);
                                    const totalDue = committee.monthlyAmount + (committee.isFeeMandatory ? (committee.organizerFee || 0) : 0);

                                    return (
                                        <TableRow key={member._id} className={isBeneficiary ? "bg-primary-50/50 dark:bg-primary-900/10 border-l-4 border-primary-500" : ""}>
                                            <TableCell className="font-black uppercase text-slate-900 dark:text-white">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                                        {member.name?.charAt(0) || "M"}
                                                    </div>
                                                    <div>
                                                        <button 
                                                            onClick={() => setInspectingMember(member)}
                                                            className="text-left font-black hover:text-primary-600 transition flex items-center gap-1.5 group"
                                                            title="Click to inspect full member profile and history"
                                                        >
                                                            <span>{member.name}</span>
                                                            <BlueTick verified={member.verificationStatus === "verified"} size={14} />
                                                        </button>
                                                        <span className="block text-[10px] text-slate-400 normal-case font-medium">{member.phone ? `+92 ${member.phone}` : "No phone"}</span>
                                                        <span className="block text-[9px] text-slate-400 normal-case font-mono">{member.email}</span>
                                                    </div>
                                                </div>
                                                {isBeneficiary && (
                                                    <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-primary-600 text-white text-[8px] font-black tracking-wider rounded-full">
                                                        MONTH {selectedMonth} BENEFICIARY
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                                            member.verificationStatus === "verified"
                                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                                : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                                                        }`}>
                                                            {member.verificationStatus === "verified" ? "KYC Verified" : "Unverified"}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">{member.city || "Global Node"}</span>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                                                        {member.payoutDetails?.iban ? (
                                                            <span className="text-primary-600 font-bold" title={member.payoutDetails.iban}>
                                                                {member.payoutDetails.bankName || "IBAN"}: ...{member.payoutDetails.iban.slice(-6)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-rose-400 italic">No IBAN set</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                                RS {totalDue.toLocaleString()}
                                            </TableCell>

                                            <TableCell>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center gap-1 ${
                                                    payment?.status === "verified"
                                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                        : payment?.status === "pending"
                                                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                        : payment?.status === "rejected"
                                                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                                                        : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800"
                                                }`}>
                                                    {payment?.status === "verified" && <FiCheckCircle size={10} />}
                                                    {payment?.status || "unpaid"}
                                                </span>
                                                {payment?.submission?.transactionId && (
                                                    <span className="block text-[8px] font-mono text-slate-400 mt-1 uppercase truncate max-w-[100px]">
                                                        Ref: {payment.submission.transactionId}
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    {payment?.submission?.screenshot ? (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setViewingPayment({ ...payment, memberName: member.name, memberPhone: member.phone, memberEmail: member.email, bankName: member.payoutDetails?.bankName })}
                                                            className="h-8 px-2.5 text-[10px] font-black uppercase bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm"
                                                            title="Inspect Payment Evidence"
                                                        >
                                                            <FiEye className="mr-1" /> View Proof
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setInspectingMember(member)}
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                            title="Inspect Member Profile"
                                                        >
                                                            <FiUser size={14} />
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePing(member._id)}
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                        title="Ping Member (Send Reminder)"
                                                    >
                                                        <FiBell size={14} />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setChatConfig({
                                                            committeeId: committee._id,
                                                            otherUserId: member._id,
                                                            otherUserName: member.name,
                                                            otherUserModel: "Member"
                                                        })}
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                        title="Message Member"
                                                    >
                                                        <FiMessageSquare size={14} />
                                                    </Button>

                                                    {(!payment || payment.status !== "verified") && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (confirm(`Force mark ${member.name} as PAID for Month ${selectedMonth}?`)) {
                                                                    handleUpdatePayment(payment?._id || "FORCE_RECONCILE", "verified", member._id, "", selectedMonth);
                                                                }
                                                            }}
                                                            className="h-8 w-8 p-0 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 rounded-lg"
                                                            title="Force Reconcile / Mark Paid"
                                                        >
                                                            <FiCheckCircle size={14} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </Table>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden p-8">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-2">
                                <FiActivity className="text-primary-500" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{t("poolStats") || "Pool Stats"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t("currentMonth") || "Month"}</p>
                                    <p className="text-2xl font-black">{committee.currentMonth} / {committee.monthDuration}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t("status") || "Status"}</p>
                                    <p className="text-2xl font-black uppercase text-primary-500">{committee.status}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest mb-1">Beneficiary (This Month)</p>
                                {(() => {
                                    const turn = committee.result.find(r => r.position === committee.currentMonth);
                                    const member = committee.members.find(m => m._id === turn?.member || m._id === turn?.member?._id);
                                    if (!member) return <p className="text-xs text-slate-500 italic">No drawing result found</p>;

                                    const alreadyPaid = committee.payouts?.some(p => p.month === committee.currentMonth && (p.member === member._id || p.member?._id === member._id));

                                    return (
                                        <div className="space-y-4">
                                            <p className="text-sm font-black uppercase text-white">{member.name}</p>

                                            {alreadyPaid ? (
                                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                                                    <FiCheckCircle className="text-green-500" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Payout Complete</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Payout Account</p>
                                                        {member.payoutDetails?.iban ? (
                                                            <>
                                                                <p className="text-[11px] font-bold text-slate-200">{member.payoutDetails.accountTitle}</p>
                                                                <p className="text-[10px] text-slate-400">{member.payoutDetails.bankName}</p>
                                                                <p className="text-[10px] font-mono text-primary-400 mt-1 break-all">{member.payoutDetails.iban}</p>
                                                            </>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] italic text-red-400 uppercase font-black">Member hasn't updated details</p>
                                                                <Button variant="ghost" size="sm" onClick={() => handlePing(member._id, "URGENT: Please update your bank details for payout.")} className="w-full text-[9px] font-black uppercase tracking-widest bg-red-500/20 text-red-400 border-none hover:bg-red-500/30">
                                                                    Ping for Details
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {member.payoutDetails?.iban && (
                                                        <Button onClick={() => openPayoutModal(member)} className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary-500/20">
                                                            <FiDollarSign className="mr-2" /> Record Payout
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* View Payment Evidence Modal */}
            <Modal
                isOpen={!!viewingPayment}
                onClose={() => { setViewingPayment(null); setRejectionReason(""); }}
                title={`Payment Evidence Verification — Month ${viewingPayment?.month || selectedMonth}`}
                size="lg"
            >
                <div className="space-y-6">
                    {viewingPayment?.submission?.screenshot ? (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-3 group">
                            <img 
                                src={viewingPayment.submission.screenshot} 
                                alt="Payment Proof" 
                                className="w-full h-auto max-h-[380px] object-contain rounded-lg shadow-md" 
                            />
                            <a 
                                href={viewingPayment.submission.screenshot} 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary-400 hover:text-primary-300 flex items-center gap-1.5"
                            >
                                <FiExternalLink /> Open Full Size in New Tab
                            </a>
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 italic text-xs font-bold uppercase tracking-widest">No evidence screenshot provided</div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Participant</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{viewingPayment?.memberName || "Member"}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Expected Due</p>
                            <p className="text-sm font-mono font-black text-primary-600">RS {committee.monthlyAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Transaction Ref</p>
                            <p className="font-mono text-xs font-black text-slate-900 dark:text-white break-all uppercase">{viewingPayment?.submission?.transactionId || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Submitted</p>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{moment(viewingPayment?.submission?.submittedAt || viewingPayment?.updatedAt).format("MMM DD, LT")}</p>
                        </div>
                        {viewingPayment?.submission?.description && (
                            <div className="col-span-full pt-2 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Member Note / Testimony</p>
                                <p className="text-xs italic text-slate-700 dark:text-slate-300">"{viewingPayment.submission.description}"</p>
                            </div>
                        )}
                    </div>

                    {viewingPayment?.status !== 'verified' && (
                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                                    Rejection Note / Feedback (Optional, sent to member if flagged)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Transaction ID not found in bank statement, amount is short"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full h-11 px-4 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={() => handleUpdatePayment(viewingPayment._id, "verified", viewingPayment?.member, "", viewingPayment?.month || selectedMonth)}
                                    loading={actionLoading}
                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-[10px] tracking-widest text-white border-none shadow-lg shadow-emerald-500/20"
                                >
                                    <FiCheckCircle className="mr-2" /> Authenticate & Confirm
                                </Button>
                                <Button
                                    onClick={() => handleUpdatePayment(viewingPayment._id, "rejected", viewingPayment?.member, rejectionReason, viewingPayment?.month || selectedMonth)}
                                    loading={actionLoading}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 font-black uppercase text-[10px] tracking-widest text-white py-4 border-none shadow-lg shadow-rose-500/20"
                                >
                                    <FiXCircle className="mr-2" /> Flag Irregularity
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Inspect Member Profile & Risk Modal */}
            <Modal
                isOpen={!!inspectingMember}
                onClose={() => setInspectingMember(null)}
                title="Participant Dossier & Risk Profile"
                size="lg"
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-xl font-black">
                                {inspectingMember?.name?.charAt(0) || "M"}
                            </div>
                            <div>
                                <h4 className="text-xl font-black uppercase flex items-center gap-2">
                                    {inspectingMember?.name}
                                    <BlueTick verified={inspectingMember?.verificationStatus === "verified"} size={18} />
                                </h4>
                                <p className="text-xs text-slate-400 font-mono">{inspectingMember?.email}</p>
                                <p className="text-[10px] text-primary-400 mt-0.5 font-bold uppercase">{inspectingMember?.city || "Pakistan"} • {inspectingMember?.county || "Member"}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            inspectingMember?.verificationStatus === "verified"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}>
                            {inspectingMember?.verificationStatus === "verified" ? "Verified Node" : "Unverified"}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Direct Contact</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{inspectingMember?.phone ? `+92 ${inspectingMember.phone}` : "No phone provided"}</p>
                            <p className="text-xs text-slate-500 font-mono">{inspectingMember?.email}</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Payout Bank Coordinates</p>
                            {inspectingMember?.payoutDetails?.iban ? (
                                <div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white">{inspectingMember.payoutDetails.accountTitle}</p>
                                    <p className="text-[11px] text-slate-500">{inspectingMember.payoutDetails.bankName}</p>
                                    <p className="text-xs font-mono font-bold text-primary-600 mt-1 break-all">{inspectingMember.payoutDetails.iban}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-rose-500 italic">No payout coordinates on file</p>
                            )}
                        </div>
                    </div>

                    {/* Committee Payment Timeline */}
                    <div className="space-y-3">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Payment History in this Pool ({committee?.name})
                        </h5>
                        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[220px] overflow-y-auto">
                            <Table headers={["Month", "Amount", "Status", "Reference", "Proof"]}>
                                {Array.from({ length: committee?.monthDuration || 1 }, (_, i) => i + 1).map((m) => {
                                    const p = (committee?.payments || []).slice().reverse().find(pay => 
                                        Number(pay.month) === m && 
                                        ((pay.member?._id || pay.member)?.toString() === inspectingMember?._id?.toString())
                                    );
                                    return (
                                        <TableRow key={m}>
                                            <TableCell className="font-black text-xs">Month {m}</TableCell>
                                            <TableCell className="font-mono text-xs">RS {committee?.monthlyAmount?.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                                    p?.status === "verified" ? "bg-emerald-100 text-emerald-700" :
                                                    p?.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                                                }`}>
                                                    {p?.status || "unpaid"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-mono text-[10px] text-slate-400">
                                                {p?.submission?.transactionId || "—"}
                                            </TableCell>
                                            <TableCell>
                                                {p?.submission?.screenshot ? (
                                                    <button 
                                                        onClick={() => {
                                                            setInspectingMember(null);
                                                            setViewingPayment({ ...p, memberName: inspectingMember?.name });
                                                        }}
                                                        className="text-primary-600 font-bold text-[10px] hover:underline"
                                                    >
                                                        View Slip
                                                    </button>
                                                ) : "—"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </Table>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button 
                            variant="secondary" 
                            onClick={() => setInspectingMember(null)}
                            className="text-xs font-black uppercase px-6"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Payout Recording Modal */}
            <Modal
                isOpen={payoutModalOpen}
                onClose={() => setPayoutModalOpen(false)}
                title="Official Resource Disbursement"
                size="lg"
            >
                <div className="space-y-8">
                    <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary-500">Recipient Identity</p>
                        <h4 className="text-2xl font-black uppercase tracking-tighter">{payoutData.memberName}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Disbursement Amount (PKR)"
                            type="number"
                            value={payoutData.amount}
                            onChange={(e) => setPayoutData({ ...payoutData, amount: e.target.value })}
                            required
                            className="h-14 font-mono font-black"
                        />
                        <Input
                            label="Transaction Protocol Ref"
                            value={payoutData.transactionId}
                            onChange={(e) => setPayoutData({ ...payoutData, transactionId: e.target.value })}
                            required
                            className="h-14 font-mono uppercase font-black tracking-tight"
                            placeholder="e.g. TR-772911"
                        />
                    </div>

                    <UploadCapture
                        label="Transfer Evidence (Screenshot)"
                        id="payout-proof"
                        value={payoutData.screenshot}
                        onUpload={(url) => setPayoutData({ ...payoutData, screenshot: url })}
                        required
                        placeholder="Log Payout Receipt"
                    />

                    <div className="flex gap-4">
                        <Button variant="secondary" onClick={() => setPayoutModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 border-none">Cancel</Button>
                        <Button onClick={handleRecordPayout} loading={actionLoading} className="flex-[2] bg-primary-600 hover:bg-primary-700 font-black uppercase text-[10px] tracking-widest py-4 shadow-xl shadow-primary-500/20 border-none">
                            <FiCheckCircle className="mr-2" /> Confirm Transmission
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Chat Box */}
            {chatConfig && admin && (
                <ChatBox
                    committeeId={chatConfig.committeeId}
                    currentUserId={admin._id}
                    currentUserModel="Admin"
                    otherUserId={chatConfig.otherUserId}
                    otherUserName={chatConfig.otherUserName}
                    otherUserModel="Member"
                    onClose={() => setChatConfig(null)}
                />
            )}
        </div>
    );
}


export default function ManagePage() {
    return (
        <Suspense fallback={<div className="p-10 text-center uppercase font-black tracking-widest animate-pulse">Loading Application...</div>}>
            <ManageContent />
        </Suspense>
    );
}
