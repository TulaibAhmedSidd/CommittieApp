"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiUsers, FiUserPlus, FiRefreshCw, FiCheckCircle, FiXCircle, FiMinusCircle, FiActivity, FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";
import { fetchCommitteebyId, fetchCommittees } from "../apis";

import Card from "@/app/Components/Theme/Card";
import Button from "@/app/Components/Theme/Button";
import Table, { TableRow, TableCell } from "@/app/Components/Theme/Table";
import { useLanguage } from "@/app/Components/LanguageContext";

export default function MembersListing() {
  const { t } = useLanguage();
  const router = useRouter();
  const [committees, setCommittees] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoggedDetails, setUserLoggedDetails] = useState(null);

  useEffect(() => {
    const detail = localStorage.getItem("admin_detail");
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (detail) setUserLoggedDetails(JSON.parse(detail));
    loadCommittees();
  }, [router]);

  const loadCommittees = async () => {
    try {
      setLoading(true);
      const data = await fetchCommittees();
      setCommittees(data);
    } catch (err) {
      toast.error(t("error") + ": Registry unreachable");
    } finally {
      setLoading(false);
    }
  };

  const loadCommitteById = async (id) => {
    try {
      setLoading(true);
      const data = await fetchCommitteebyId(id);
      setSelectedCommittee(data);
    } catch (err) {
      toast.error(t("error") + ": Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCommittee = (committeeId) => {
    const committee = committees.find((c) => c._id === committeeId);
    setSelectedCommittee(committee);
  };

  const handleMemberAction = async (memberId, action, successMessage) => {
    try {
      const response = await fetch(
        action === "delete"
          ? "/api/member/unassign-member"
          : `/api/member/${action}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId,
            committeeId: selectedCommittee._id,
          }),
        }
      );

      if (!response.ok) throw new Error("Internal failure.");

      toast.success(successMessage);
      loadCommitteById(selectedCommittee._id);
    } catch (err) {
      toast.error(err.message || t("error"));
    }
  };

  if (loading && !selectedCommittee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/10 rounded-full" />
          <div className="absolute top-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-slate-400 font-black tracking-widest uppercase text-[10px] animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Upper Meta Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary-600 font-black tracking-[0.2em] text-[10px] uppercase">
            <FiShield className="animate-pulse" /> {t("members")}
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("memberArchive")}</h1>
          <p className="text-slate-500 font-medium italic">{t("memberArchiveDesc")}</p>
        </div>
        <Button onClick={() => router.push("/admin/addmember")} className="px-8 py-4 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary-500/20">
          <FiUserPlus className="mr-2" /> {t("initializeParticipant")}
        </Button>
      </div>

      <Card className="p-0 overflow-visible border-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl">
        {/* Hub Selector */}
        <div className="p-8 bg-slate-900 dark:bg-white rounded-t-[2.5rem] border-b border-white/5 dark:border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <label className="block w-full max-w-md">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-3 block">{t("neuralPoolSelector")}</span>
            <div className="relative group">
              <select
                className="w-full bg-slate-800 dark:bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm font-black text-white dark:text-slate-900 appearance-none focus:ring-4 focus:ring-primary-500/30 transition-all cursor-pointer shadow-lg pr-12"
                onChange={(e) => handleSelectCommittee(e.target.value)}
                value={selectedCommittee?._id || ""}
              >
                <option value="" disabled className="text-slate-500 font-bold uppercase italic">-- {t("calibrateSelection")} --</option>
                {committees.map((c) => {
                  const isManaged = c.createdBy === userLoggedDetails?._id || userLoggedDetails?.email?.toLowerCase() === "tulaib@gmail.com";
                  return (
                    <option key={c._id} value={c._id} disabled={!isManaged} className="font-bold py-2 uppercase">
                      {c.name} {!isManaged ? " [READ ONLY]" : " [ACTIVE]"}
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <FiLayers size={18} />
              </div>
            </div>
          </label>

          {selectedCommittee && (
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{t("loadBalance")}</p>
                <p className="text-2xl font-black text-primary-500 tracking-tighter italic leading-none">{selectedCommittee?.members?.length || 0} / {selectedCommittee.maxMembers}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => loadCommitteById(selectedCommittee._id)} className="h-14 w-14 rounded-2xl bg-slate-800 dark:bg-slate-200 text-slate-400 dark:text-slate-600 hover:text-primary-500 transition-all">
                <FiRefreshCw className={loading ? "animate-spin" : "scale-110"} size={20} />
              </Button>
            </div>
          )}
        </div>

        {selectedCommittee ? (
          <div className="p-10 space-y-16 animate-in slide-in-from-bottom-8 duration-700">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{selectedCommittee.name}</h2>
                <p className="text-sm text-slate-500 max-w-2xl font-medium italic">"{selectedCommittee.description || t("noDescription")}"</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary-600 shadow-xl shadow-primary-500/20 text-white min-w-[200px]">
                <FiTrendingUp size={24} className="opacity-50" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t("successRate")}</p>
                  <p className="text-xl font-black tracking-tighter leading-none italic uppercase">100.0% {t("approved")}</p>
                </div>
              </div>
            </div>

            {/* Pending Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">Add Member Requests</h3>
                <span className="text-[10px] font-black px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20 uppercase">
                  {t("pending")}: {selectedCommittee.pendingMembers?.length || 0}
                </span>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30">
                <Table>
                  <thead className="w-full">
                    <tr className="w-full bg-slate-50 dark:bg-slate-900/50">
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("temporalSubject")}</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("sublinkGateway")}</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("protocolOverride")}</th>
                    </tr>
                  </thead>
                  <tbody className="w-full divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedCommittee.pendingMembers && selectedCommittee.pendingMembers.length > 0 ? (
                      selectedCommittee.pendingMembers.map((m) => (
                        <TableRow key={m._id} className="w-full group hover:bg-amber-500/5 transition-all">
                          <TableCell>
                            <div className="flex items-center gap-4 ml-2">
                              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center font-black text-xs text-amber-600">
                                {m.name?.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{m.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 italic lowercase pl-8">{m.email}</TableCell>
                          <TableCell className="pr-8 text-right">
                            <Button size="sm" onClick={() => handleMemberAction(m._id, "approve", t("identityAuthorized"))} className="bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 border-none font-black text-[10px] tracking-widest py-3 px-6 uppercase">
                              <FiCheckCircle className="mr-2" /> {t("unlock")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="w-full">
                        <TableCell colSpan={3} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-2 opacity-40">
                            <FiUsers size={32} />
                            <p className="font-black uppercase text-[10px] tracking-widest italic text-slate-400">No Pending Requests</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Participation Registry */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">Member in Committee</h3>
                <span className="text-[10px] font-black px-3 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-500/20 uppercase">
                  {t("approved")}: {selectedCommittee.members?.length || 0}
                </span>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30">
                <Table>
                  <thead className="w-full">
                    <tr className="w-full bg-slate-50 dark:bg-slate-900/50">
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("activeNode")}</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("sublinkGateway")}</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">{t("manualOverride")}</th>
                    </tr>
                  </thead>
                  <tbody className="w-full divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedCommittee.members && selectedCommittee.members.length > 0 ? (
                      selectedCommittee.members.map((m) => (
                        <TableRow key={m._id} className="w-full group hover:bg-primary-500/5 transition-all">
                          <TableCell>
                            <div className="flex items-center gap-4 ml-2">
                              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-black text-xs shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                                {m.name?.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1">{m.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("uid")}://{m._id?.substring(0, 8)}</span>
                                  <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase">{t("managedBy")}: {m.createdByAdminName || "Root"}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 italic lowercase pl-8">{m.email}</TableCell>
                          <TableCell className="pr-8 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                              <Button variant="ghost" size="sm" className="text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 p-3 h-10 w-10 flex items-center justify-center rounded-xl" onClick={() => handleMemberAction(m._id, "pending", t("identityRecycled"))}>
                                <FiMinusCircle size={18} />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleMemberAction(m._id, "delete", t("physicalLinkSevered"))} className="text-red-500 bg-red-500/5 hover:bg-red-500/10 p-3 h-10 w-10 flex items-center justify-center rounded-xl">
                                <FiXCircle size={18} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-2 opacity-40">
                            <FiShield size={32} />
                            <p className="font-black uppercase text-[10px] tracking-widest italic text-slate-400">Zero Active Nodes Found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-36 text-center space-y-8 animate-in zoom-in duration-1000">
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-primary-500/20 rounded-[2.5rem] animate-ping" />
              <div className="relative w-32 h-32 bg-slate-900 dark:bg-white rounded-[2.5rem] flex items-center justify-center text-primary-600 shadow-2xl rotate-12">
                <FiActivity size={56} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">{t("systemAwaitingSelection")}</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium italic">{t("bridgeConnectionDesc")}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
