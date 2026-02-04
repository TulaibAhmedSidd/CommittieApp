"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FiArrowLeft, FiCheckCircle, FiXCircle, FiBell,
    FiEye, FiCalendar, FiDollarSign, FiZap, FiActivity
} from "react-icons/fi";
import { toast } from "react-toastify";
import moment from "moment";
import {
    fetchCommitteebyId,
    pingMember,
    updatePaymentStatus,
    updateCommitteeStatus
} from "../apis";

import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import Table, { TableRow, TableCell } from "../../Components/Theme/Table";
import { useLanguage } from "../../Components/LanguageContext";

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

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        const detail = localStorage.getItem("admin_detail");
        if (!token) {
            router.push("/admin/login");
            return;
        }
        setAdmin(JSON.parse(detail));
        if (committeeId) {
            loadCommittee();
        }
    }, [committeeId, router]);

    const loadCommittee = async () => {
        setLoading(true);
        try {
            const data = await fetchCommitteebyId(committeeId);
            setCommittee(data);
        } catch (err) {
            toast.error(t("error") + ": " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePing = async (memberId) => {
        setActionLoading(true);
        try {
            await pingMember(committeeId, memberId, admin._id);
            toast.success("Ping sent to member");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdatePayment = async (paymentId, status) => {
        setActionLoading(true);
        try {
            await updatePaymentStatus(committeeId, paymentId, status, admin._id);
            toast.success(`Payment ${status}`);
            loadCommittee();
            setViewingPayment(null);
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

    if (loading) return <div className="p-10 text-center uppercase font-black tracking-widest animate-pulse">Initializing Data...</div>;
    if (!committee) return <div className="p-10 text-center">Committee not found</div>;

    const currentMonthPayments = committee.members.map(member => {
        const payment = committee.payments.find(p => p.month === committee.currentMonth && p.member === member._id);
        return { member, payment };
    });

    return (
        <div className="space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-primary-600 font-bold uppercase text-[10px] tracking-widest p-0">
                    <FiArrowLeft className="mr-2" /> {t("back") || "Back"}
                </Button>
                <div className="flex gap-4">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title={`${committee.name} - ${t("month") || "Month"} ${committee.currentMonth}`} description="Payment status for all members this month">
                        <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-4">
                            <Table headers={[t("memberName") || "Member Name", t("status") || "Status", t("actions") || "Actions"]}>
                                {committee.members.map((member) => {
                                    const payment = committee.payments.find(p => p.month === committee.currentMonth && (p.member._id === member._id || p.member === member._id));
                                    return (
                                        <TableRow key={member._id}>
                                            <TableCell className="font-black uppercase text-slate-900 dark:text-white">{member.name}</TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${payment?.status === "verified" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                                    payment?.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                        payment?.status === "rejected" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                                            "bg-slate-100 text-slate-400 border-slate-200"
                                                    }`}>
                                                    {payment?.status || "unpaid"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex gap-2">
                                                {payment?.status === "pending" && (
                                                    <Button variant="ghost" size="sm" onClick={() => setViewingPayment(payment)} className="h-8 w-8 p-0 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg">
                                                        <FiEye size={14} />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => handlePing(member._id)} className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 rounded-lg">
                                                    <FiBell size={14} />
                                                </Button>
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

                            {/* Beneficiary Turn Info */}
                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest mb-1">Beneficiary (This Month)</p>
                                {(() => {
                                    const turn = committee.result.find(r => r.position === committee.currentMonth);
                                    const member = committee.members.find(m => m._id === turn?.member || m._id === turn?.member?._id);
                                    return member ? (
                                        <div className="space-y-2">
                                            <p className="text-sm font-black uppercase text-white">{member.name}</p>
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Payout Account</p>
                                                {member.payoutDetails?.iban ? (
                                                    <>
                                                        <p className="text-[11px] font-bold text-slate-200">{member.payoutDetails.accountTitle}</p>
                                                        <p className="text-[10px] text-slate-400">{member.payoutDetails.bankName}</p>
                                                        <p className="text-[10px] font-mono text-primary-400 mt-1 break-all">{member.payoutDetails.iban}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-[10px] italic text-red-400 uppercase font-black">Member hasn't updated details</p>
                                                )}
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handlePing(member._id)} className="w-full text-[9px] font-black uppercase tracking-widest bg-primary-600/20 text-primary-500 border-none">
                                                Ping for Details
                                            </Button>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">No drawing result found</p>
                                    );
                                })()}
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t("bankDetails") || "Bank Details"}</p>
                                <p className="text-sm font-bold uppercase">{committee.bankDetails?.accountTitle}</p>
                                <p className="text-xs text-slate-400">{committee.bankDetails?.bankName}</p>
                                <p className="text-xs text-slate-400 font-mono tracking-tighter mt-1">{committee.bankDetails?.iban}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Payment Verification Modal */}
            {viewingPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
                    <Card className="max-w-xl w-full bg-white dark:bg-slate-900 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Verify Payment</h3>
                                <Button variant="ghost" onClick={() => setViewingPayment(null)} className="p-2 h-auto text-slate-400">
                                    <FiXCircle size={24} />
                                </Button>
                            </div>

                            {viewingPayment.submission?.screenshot ? (
                                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50">
                                    <img src={viewingPayment.submission.screenshot} alt="Payment Proof" className="w-full h-auto max-h-[300px] object-contain" />
                                </div>
                            ) : (
                                <div className="h-40 flex items-center justify-center bg-slate-100 rounded-2xl text-slate-400 italic text-sm">No screenshot provided</div>
                            )}

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</p>
                                        <p className="font-mono text-sm break-all text-slate-200">{viewingPayment.submission?.transactionId || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Submitted At</p>
                                        <p className="text-sm text-slate-200">{moment(viewingPayment.submission?.submittedAt).format("LLL")}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</p>
                                    <p className="text-sm italic text-slate-200">{viewingPayment.submission?.description || "No description"}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    onClick={() => handleUpdatePayment(viewingPayment._id, "verified")}
                                    loading={actionLoading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 font-black uppercase text-[10px] tracking-widest py-4"
                                >
                                    <FiCheckCircle className="mr-2" /> Approve
                                </Button>
                                <Button
                                    onClick={() => handleUpdatePayment(viewingPayment._id, "rejected")}
                                    loading={actionLoading}
                                    className="flex-1 bg-red-600 hover:bg-red-700 font-black uppercase text-[10px] tracking-widest py-4"
                                >
                                    <FiXCircle className="mr-2" /> Reject
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
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
