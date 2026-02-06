"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FiArrowLeft, FiCheckCircle, FiXCircle, FiBell,
    FiEye, FiCalendar, FiDollarSign, FiZap, FiActivity, FiMessageSquare
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
    const [payoutModalOpen, setPayoutModalOpen] = useState(false);
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

    const handleUpdatePayment = async (paymentId, status, memberId = null) => {
        setActionLoading(true);
        try {
            await updatePaymentStatus(committeeId, paymentId, status, admin._id, memberId);
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
                    {/* Pending Requests */}
                    {committee.pendingMembers?.length > 0 && (
                        <Card title="Pending Join Requests" className="border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-900/30">
                            <div className="overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm mt-4 bg-white dark:bg-slate-900">
                                <Table headers={["Member Name", "Actions"]}>
                                    {committee.pendingMembers.map((member) => (
                                        <TableRow key={member._id}>
                                            <TableCell className="font-black uppercase text-slate-900 dark:text-white">
                                                {member.name}
                                                <span className="block text-[9px] text-slate-400 normal-case font-medium">{member.email}</span>
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

                    <Card title={`${committee.name} - ${t("month") || "Month"} ${committee.currentMonth}`} description="Payment status for all members this month">
                        <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-4">
                            <Table headers={[t("memberName") || "Member Name", t("status") || "Status", t("actions") || "Actions"]}>
                                {committee.members.map((member) => {
                                    const payment = committee.payments.find(p => p.month === committee.currentMonth && (p.member._id === member._id || p.member === member._id));
                                    const turn = committee.result.find(r => r.position === committee.currentMonth);
                                    const isBeneficiary = (turn?.member === member._id || turn?.member?._id === member._id);
                                    const totalDue = committee.monthlyAmount + (committee.isFeeMandatory ? (committee.organizerFee || 0) : 0);

                                    return (
                                        <TableRow key={member._id} className={isBeneficiary ? "bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500" : ""}>
                                            <TableCell className="font-black uppercase text-slate-900 dark:text-white">
                                                {member.name}
                                                {isBeneficiary && <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-[9px] rounded-full">BENEFICIARY</span>}
                                                <div className="text-[9px] text-slate-400 font-medium normal-case mt-1">
                                                    Due: RS {totalDue.toLocaleString()} {committee.isFeeMandatory && committee.organizerFee > 0 && `(Inc. Fee)`}
                                                </div>
                                            </TableCell>
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
                                                {payment?.submission && (
                                                    <Button variant="ghost" size="sm" onClick={() => setViewingPayment(payment)} className="h-8 w-8 p-0 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg" title="View Proof">
                                                        <FiEye size={14} />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => handlePing(member._id)} className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 rounded-lg" title="Ping Member">
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
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg"
                                                    title="Message Member"
                                                >
                                                    <FiMessageSquare size={14} />
                                                </Button>
                                                {(!payment || payment.status !== "verified") && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm(`Force mark ${member.name} as PAID for Month ${committee.currentMonth}?`)) {
                                                                handleUpdatePayment(payment?._id || "FORCE_RECONCILE", "verified", member._id);
                                                            }
                                                        }}
                                                        className="h-8 w-8 p-0 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg"
                                                        title="Force Verify (No Proof)"
                                                    >
                                                        <FiCheckCircle size={14} />
                                                    </Button>
                                                )}
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
                onClose={() => setViewingPayment(null)}
                title="Verify Incoming Node Payment"
                size="lg"
            >
                <div className="space-y-8">
                    {viewingPayment?.submission?.screenshot ? (
                        <div className="rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-inner">
                            <img src={viewingPayment.submission.screenshot} alt="Payment Proof" className="w-full h-auto max-h-[400px] object-contain" />
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-[2rem] text-slate-400 italic text-xs font-bold uppercase tracking-widest">No evidence provided</div>
                    )}

                    <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction Identity</p>
                            <p className="font-mono text-sm font-black text-slate-900 dark:text-white break-all">{viewingPayment?.submission?.transactionId || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{moment(viewingPayment?.submission?.submittedAt).format("LLL")}</p>
                        </div>
                        <div className="col-span-full">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Member Testimony</p>
                            <p className="text-sm italic text-slate-600 dark:text-slate-400">"{viewingPayment?.submission?.description || "No description logged"}"</p>
                        </div>
                    </div>

                    {viewingPayment?.status !== 'verified' && (
                        <div className="flex gap-4">
                            <Button
                                onClick={() => handleUpdatePayment(viewingPayment._id, "verified", viewingPayment?.member)}
                                loading={actionLoading}
                                className="flex-1 py-4 bg-green-600 hover:bg-green-700 font-black uppercase text-[10px] tracking-widest border-none"
                            >
                                <FiCheckCircle className="mr-2" /> Authenticate
                            </Button>
                            <Button
                                onClick={() => handleUpdatePayment(viewingPayment._id, "rejected", viewingPayment?.member)}
                                loading={actionLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700 font-black uppercase text-[10px] tracking-widest py-4 border-none"
                            >
                                <FiXCircle className="mr-2" /> Flag Irregularity
                            </Button>
                        </div>
                    )}
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
