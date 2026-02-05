"use client";

import { useEffect, useState, useRef } from "react";
import { formatMoney } from "../utils/commonFunc";
import moment from "moment";
import {
  FiLayers, FiCheckCircle, FiClock, FiAlertCircle,
  FiCalendar, FiDollarSign, FiInfo, FiUploadCloud,
  FiXCircle, FiArrowRight, FiActivity, FiSearch,
  FiUser, FiTable, FiCreditCard, FiMessageSquare
} from "react-icons/fi";
import Card from "./Theme/Card";
import ChatBox from "./ChatBox";
import Button from "./Theme/Button";
import Input from "./Theme/Input";
import Table, { TableRow, TableCell } from "./Theme/Table";
import { useLanguage } from "./LanguageContext";
import { submitPayment } from "../userDash/apis";
import { toast } from "react-toastify";

export default function MyCommittie2() {
  const { t } = useLanguage();
  const [committees, setCommittees] = useState({ approvedCommittees: [], pendingCommittees: [] });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    screenshot: "",
    description: "",
    transactionId: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState("active"); // active, pending, history
  const [chatConfig, setChatConfig] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("member");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed._id);
    }
  }, []);

  useEffect(() => {
    if (userId) fetchCommittees();
  }, [userId]);

  const fetchCommittees = async () => {
    try {
      const res = await fetch("/api/member/my-committie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error(t("error"));
      const data = await res.json();
      setCommittees({
        approvedCommittees: data.approvedCommittees || [],
        pendingCommittees: data.pendingCommittees || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (committee) => {
    setSelectedCommittee(committee);
    setIsPayModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitPayment(selectedCommittee._id, {
        ...paymentData,
        memberId: userId,
        month: selectedCommittee.currentMonth
      });
      toast.success(t("paymentSubmitted") || "Payment submitted successfully");
      setIsPayModalOpen(false);
      setPaymentData({ screenshot: "", description: "", transactionId: "" });
      fetchCommittees();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-[2rem] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">{t("authenticating")} Vault Access...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
            <FiActivity className="animate-spin-slow" /> Personal Ledger
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("professionalPortfolio")}</h1>
          <p className="text-slate-500 font-medium italic">Comprehensive overview of your financial trajectory and committee participations.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem] shadow-inner gap-2">
          {[
            { id: "active", label: "Active Pools", icon: FiLayers },
            { id: "pending", label: "Pending", icon: FiClock },
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`
                        px-6 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all
                        ${view === v.id
                  ? "bg-white dark:bg-slate-800 text-primary-600 shadow-xl"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}
                    `}
            >
              <v.icon size={16} /> {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "active" && (
        <section className="space-y-12">
          {committees.approvedCommittees.length === 0 ? (
            <Card className="py-32 flex flex-col items-center gap-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border-dashed border-2">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300">
                <FiAlertCircle size={48} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-xl">{t("noApprovedCommittees")}</p>
                <p className="text-slate-500 text-sm font-medium italic">You haven't been finalized in any active pools yet.</p>
              </div>
            </Card>
          ) : (
            committees.approvedCommittees.map((c) => {
              const myPayment = c.payments?.find(p => p.month === c.currentMonth && (p.member?._id === userId || p.member === userId));
              const turnRecord = c.result?.find(r => r.position === c.currentMonth);
              const isMyTurn = turnRecord?.member?._id === userId;
              const turnMemberName = isMyTurn ? "YOU" : turnRecord?.member?.name || "System Drawing";

              return (
                <Card key={c._id} className="p-0 overflow-hidden border-none shadow-premium-hover bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl group transition-all duration-700">
                  {/* Status Accent */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${isMyTurn ? "bg-primary-600" : "bg-green-500"}`} />

                  <div className="p-8 md:p-12 space-y-12">
                    {/* Card Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full animate-pulse ${isMyTurn ? "bg-primary-600 shadow-[0_0_12px_rgba(79,70,229,0.8)]" : "bg-green-500"}`} />
                          <p className={`text-xs font-black uppercase tracking-[0.2em] ${isMyTurn ? "text-primary-600" : "text-green-600"}`}>
                            {isMyTurn ? "CRITICAL ALERT: YOU ARE THE BENEFICIARY THIS MONTH!" : "Status: Active Participation"}
                          </p>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{c.name}</h3>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <FiCalendar className="text-primary-500" /> {moment(c.startDate).format("MMM 'YY")} - {moment(c.endDate).format("MMM 'YY")}
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${isMyTurn ? "bg-primary-600 text-white" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>
                            <FiUser /> Current Turn: {turnMemberName}
                          </div>
                          <button
                            onClick={() => router.push(`/userDash/committee/${c._id}`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                          >
                            <FiActivity size={14} /> View Detailed Board <FiArrowRight size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                        <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden group/box min-w-[200px]">
                          <FiDollarSign className="absolute -bottom-4 -right-4 text-white/5 group-hover/box:scale-110 transition-transform" size={80} />
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("myInstallment")}</p>
                          <p className="text-2xl font-black tracking-tighter">
                            RS {formatMoney(c.monthlyAmount + (c.isFeeMandatory ? (c.organizerFee || 0) : 0))}
                          </p>
                          {c.isFeeMandatory && c.organizerFee > 0 && (
                            <p className="text-[9px] text-primary-400 font-bold uppercase mt-1">Inc. {formatMoney(c.organizerFee)} Fee</p>
                          )}
                        </div>
                        <div className={`p-6 rounded-[2rem] shadow-xl relative overflow-hidden group/box min-w-[200px] border-2 ${myPayment?.status === "verified" ? "bg-green-500/5 border-green-500/20 text-green-600" :
                          myPayment?.status === "pending" ? "bg-amber-500/10 border-amber-500/20 text-amber-600" :
                            "bg-red-500/5 border-red-500/20 text-red-500"
                          }`}>
                          <FiCheckCircle className="absolute -bottom-4 -right-4 opacity-10 group-hover/box:rotate-12 transition-transform" size={80} />
                          <p className="text-[9px] font-black uppercase tracking-widest mb-1">Month {c.currentMonth} Status</p>
                          <p className="text-2xl font-black tracking-tighter uppercase">{myPayment?.status || "unpaid"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Info Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Bank Stats */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                          <FiTable className="text-primary-600" />
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Transaction Logs</h4>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner">
                          <Table headers={["Cycle", "Amount", "Verification", "Timestamp"]}>
                            {/* We only show verified or current pending for the user */}
                            {c.payments?.filter(p => p.member?._id === userId || p.member === userId).map((p, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-black text-slate-400 uppercase text-[10px]">Month {p.month}</TableCell>
                                <TableCell className="font-black text-slate-900 dark:text-white">RS {formatMoney(c.monthlyAmount)}</TableCell>
                                <TableCell>
                                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.status === "verified" ? "bg-green-100 text-green-600" :
                                    p.status === "pending" ? "bg-amber-100 text-amber-600" :
                                      "bg-red-100 text-red-600"
                                    }`}>
                                    {p.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-[10px] font-medium text-slate-400">
                                  {p.updatedAt ? moment(p.updatedAt).format("MMM DD, YYYY") : "Awaiting..."}
                                </TableCell>
                              </TableRow>
                            ))}
                            {/* Show unpaid row if current month not submitted */}
                            {!myPayment && (
                              <TableRow className="animate-pulse">
                                <TableCell className="font-black text-primary-600 uppercase text-[10px]">Month {c.currentMonth}</TableCell>
                                <TableCell className="font-black text-slate-900 dark:text-white">
                                  RS {formatMoney(c.monthlyAmount + (c.isFeeMandatory ? (c.organizerFee || 0) : 0))}
                                </TableCell>
                                <TableCell>
                                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest animate-bounce">REQUIRED</span>
                                </TableCell>
                                <TableCell className="text-[10px] font-black text-red-500 uppercase">ACTION PENDING</TableCell>
                              </TableRow>
                            )}
                          </Table>
                        </div>

                        {/* Payout Evidence Card - If Payout Received */}
                        {c.payouts?.filter(p => p.member === userId || p.member?._id === userId).map((payout, idx) => (
                          <Card key={idx} className="bg-green-600 text-white border-none shadow-premium relative overflow-hidden">
                            <FiCheckCircle className="absolute -top-10 -right-10 text-white/10" size={180} />
                            <div className="relative z-10 space-y-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                  <FiDollarSign size={24} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-green-200">Payout Received</p>
                                  <h4 className="text-2xl font-black uppercase tracking-tight">Month {payout.month} Complete</h4>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black/20 rounded-xl space-y-1">
                                  <p className="text-[9px] font-black text-green-200 uppercase tracking-widest">Transaction ID</p>
                                  <p className="text-sm font-mono break-all">{payout.transactionId || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-black/20 rounded-xl space-y-1">
                                  <p className="text-[9px] font-black text-green-200 uppercase tracking-widest">Amount Received</p>
                                  <p className="text-xl font-black">RS {formatMoney(payout.amount)}</p>
                                </div>
                              </div>

                              {payout.screenshot && (
                                <div className="pt-4 border-t border-white/10">
                                  <p className="text-[9px] font-black text-green-200 uppercase tracking-widest mb-2">Proof of Transfer</p>
                                  <a href={payout.screenshot} target="_blank" rel="noopener noreferrer">
                                    <div className="h-32 w-full rounded-xl bg-black/20 overflow-hidden relative group cursor-pointer">
                                      <img src={payout.screenshot} alt="Payout Proof" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                        <FiUploadCloud size={24} />
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Action Sidebar */}
                      <div className="space-y-6">
                        <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] space-y-6 relative overflow-hidden border border-slate-200 dark:border-slate-700">
                          <FiInfo className="absolute -bottom-8 -right-8 text-black/5" size={160} />
                          <div className="relative z-10 space-y-6">
                            {/* Assigned Position Display */}
                            {(() => {
                              const myResult = c.result?.find(r => r.member === userId || r.member?._id === userId);
                              return myResult ? (
                                <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl text-center space-y-2 border border-slate-100 dark:border-slate-700">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Assigned Position</p>
                                  <h3 className="text-5xl font-black text-primary-600">#{myResult.position}</h3>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-slate-500 italic">Expected Payout:</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                      {moment(c.startDate).add(myResult.position - 1, 'months').format("MMMM YYYY")}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-6 bg-slate-200 dark:bg-slate-900/50 rounded-[2rem] text-center">
                                  <p className="text-[10px] font-black uppercase text-slate-400">Position Pending</p>
                                </div>
                              );
                            })()}

                            <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("quickTransfer") || "Deposit Destination"}</p>
                              <div className="space-y-1">
                                <p className="text-lg font-black uppercase text-slate-900 dark:text-white leading-tight">{c.bankDetails?.accountTitle || "ADMIN PENDING"}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">{c.bankDetails?.bankName || "N/A"}</p>
                                <p className="text-xs font-mono text-primary-600 mt-2 font-black tracking-tighter">{c.bankDetails?.iban || "NO IBAN PROVIDED"}</p>
                              </div>
                            </div>

                            <Button
                              className={`w-full py-5 font-black uppercase tracking-[0.2em] text-xs shadow-2xl ${myPayment?.status === "pending" || myPayment?.status === "verified"
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed border-none"
                                : "bg-primary-600 hover:bg-primary-700 shadow-primary-500/20"
                                }`}
                              disabled={myPayment?.status === "verified" || myPayment?.status === "pending"}
                              onClick={() => handlePayNow(c)}
                            >
                              {myPayment?.status === "pending" ? "Sync Under Review" :
                                myPayment?.status === "verified" ? "Authenticated" : "Initiate Transfer"}
                              <FiArrowRight className="ml-2" />
                            </Button>

                            <Button
                              className="w-full py-5 font-black uppercase tracking-[0.2em] text-xs shadow-xl bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-slate-500/20"
                              onClick={() => setChatConfig({
                                committeeId: c._id,
                                otherUserId: c.createdBy, // The Admin
                                otherUserName: "Committee Admin",
                                otherUserModel: "Admin"
                              })}
                            >
                              <FiMessageSquare className="mr-2" /> Chat with Admin
                            </Button>

                            {isMyTurn && (
                              <div className="p-4 bg-primary-600/10 border-2 border-primary-600/20 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2 text-primary-600">
                                  <FiCreditCard />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Payout Config</span>
                                </div>
                                <p className="text-[10px] text-primary-800 dark:text-primary-400 font-medium italic">
                                  Admin is processing your payout. Ensure your [Profile Bank Details] are updated.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </section>
      )}

      {view === "pending" && (
        <section className="space-y-12 animate-in slide-in-from-right-12 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committees.pendingCommittees.length === 0 ? (
              <Card className="col-span-full py-24 flex flex-col items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border-dashed">
                <FiClock size={48} className="text-slate-200" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">{t("noPendingApplications")}</p>
              </Card>
            ) : (
              committees.pendingCommittees.map((c) => (
                <Card key={c._id} className="p-10 border-none shadow-premium bg-white dark:bg-slate-900 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute top-0 left-0 w-2 h-full bg-amber-400" />
                  <div className="space-y-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <FiLayers size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight line-clamp-2">{c.name}</h3>
                      <p className="text-sm text-slate-500 font-medium italic">Position Request Submitted</p>
                    </div>
                    <div className="flex items-center gap-4 py-4 px-6 bg-amber-500/5 text-amber-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border border-amber-500/10">
                      <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping" />
                      Security Verification in Progress
                    </div>
                  </div>
                  <FiClock size={160} className="absolute -bottom-12 -right-12 text-black/5 dark:text-white/5 opacity-50" />
                </Card>
              ))
            )}
          </div>
        </section>
      )}

      {/* Payment Submission Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <Card className="max-w-3xl w-full bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border-none p-0">
            <form onSubmit={handlePaymentSubmit} className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Sidebar */}
              <div className="md:w-72 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
                <FiCreditCard className="absolute -bottom-4 -right-4 text-white/5" size={140} />
                <div className="space-y-8 relative z-10">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary-500 mb-2">Vault Protocol</p>
                    <h3 className="text-3xl font-black tracking-tighter uppercase whitespace-pre-wrap">Submit Proof</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base Installment</p>
                      <p className="text-2xl font-black tracking-tighter">RS {formatMoney(selectedCommittee?.monthlyAmount)}</p>
                    </div>
                    {selectedCommittee?.isFeeMandatory && selectedCommittee?.organizerFee > 0 && (
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Organizer Fee</p>
                        <p className="text-xl font-black text-primary-500">RS {formatMoney(selectedCommittee?.organizerFee)}</p>
                      </div>
                    )}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Required</p>
                      <p className="text-3xl font-black text-white">
                        RS {formatMoney(selectedCommittee?.monthlyAmount + (selectedCommittee?.isFeeMandatory ? (selectedCommittee?.organizerFee || 0) : 0))}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cycle</p>
                      <p className="text-sm font-black">Month {selectedCommittee?.currentMonth}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/10 relative z-10">
                  <p className="text-[10px] font-medium italic text-slate-400 leading-relaxed">
                    Your submission will be audited by the organizer within 24-48 hours.
                  </p>
                </div>
              </div>

              {/* Form area */}
              <div className="flex-1 p-10 md:p-14 space-y-10 overflow-y-auto">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Transaction Credentials</h4>
                    <p className="text-xs text-slate-400 font-medium italic">Please provide precise data for faster authentication.</p>
                  </div>
                  <Button variant="ghost" onClick={() => setIsPayModalOpen(false)} className="p-2 h-auto text-slate-300 hover:text-red-500 transition-colors">
                    <FiXCircle size={32} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <Input
                    label="Reference / Transaction ID"
                    placeholder="e.g. TRX-9922883"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    required
                    className="h-16 font-mono font-black uppercase text-sm tracking-tighter"
                  />
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Screenshot Evidence (Base64/URL)</label>
                    <div className="relative group">
                      <textarea
                        placeholder="Paste base64 image data or provide a secure link to the screenshot..."
                        value={paymentData.screenshot}
                        onChange={(e) => setPaymentData({ ...paymentData, screenshot: e.target.value })}
                        required
                        rows={4}
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 text-xs font-mono resize-none focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                      />
                      <FiUploadCloud className="absolute right-6 top-6 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={24} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Add Detail (Optional)</label>
                    <textarea
                      placeholder="Any clarifying notes for the auditor..."
                      value={paymentData.description}
                      onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-slate-500/10 h-24"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" loading={submitting} className="w-full py-6 bg-primary-600 hover:bg-primary-700 shadow-[0_20px_40px_rgba(79,70,229,0.3)] font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem]">
                    Execute Batch Upload <FiArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Chat Window */}
      {chatConfig && (
        <ChatBox
          committeeId={chatConfig.committeeId}
          currentUserId={userId}
          currentUserModel="Member"
          otherUserId={chatConfig.otherUserId}
          otherUserName={chatConfig.otherUserName}
          otherUserModel={chatConfig.otherUserModel}
          onClose={() => setChatConfig(null)}
        />
      )}
    </div>
  );
}
