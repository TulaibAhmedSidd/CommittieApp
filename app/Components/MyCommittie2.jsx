"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "../utils/commonFunc";
import moment from "moment";
import { FiLayers, FiCheckCircle, FiClock, FiAlertCircle, FiCalendar } from "react-icons/fi";
import Card from "./Theme/Card";
import { useLanguage } from "./LanguageContext";

export default function MyCommittie2() {
  const { t } = useLanguage();
  const [committees, setCommittees] = useState({ approvedCommittees: [], pendingCommittees: [] });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

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

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-2xl animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("professionalPortfolio")}</h1>
        <p className="text-slate-500 font-medium italic">{t("detailedOverviewDesc")}</p>
      </div>

      {/* Approved Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl shadow-sm">
            <FiCheckCircle size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{t("approvedParticipation")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {committees.approvedCommittees.length === 0 ? (
            <Card className="col-span-full py-20 flex flex-col items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-dashed">
              <FiAlertCircle size={48} className="text-slate-300" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs italic">{t("noApprovedCommittees")}</p>
            </Card>
          ) : (
            committees.approvedCommittees.map((c) => (
              <Card key={c._id} className="p-0 overflow-hidden border-none shadow-premium bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl group hover:scale-[1.02] transition-all duration-500">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500" />
                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{c.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{t("activeMemberApproved")}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-green-500/10 text-green-600 rounded-[1.5rem] shadow-sm rotate-6 group-hover:rotate-0 transition-transform">
                      <FiLayers size={24} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1 border border-white dark:border-slate-700/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("myInstallment")}</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">PKR {formatMoney(c.monthlyAmount)}</p>
                    </div>
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1 border border-white dark:border-slate-700/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("totalPool")}</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">PKR {formatMoney(c.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full w-fit">
                    <FiCalendar className="text-primary-600" />
                    <span>{t("timeline")}: {moment(c.startDate).format("MMM 'YY")} - {moment(c.endDate).format("MMM 'YY")}</span>
                  </div>

                  {c.result?.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                        {t("drawingResults")}
                      </p>
                      <div className="space-y-3">
                        {c.result.slice(0, 2).map((r, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-50 dark:border-slate-700">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pos {r.position}</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{r.member?.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Pending Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl shadow-sm">
            <FiClock size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{t("pendingRequests")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {committees.pendingCommittees.length === 0 ? (
            <Card className="col-span-full py-16 flex flex-col items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-dashed">
              <FiAlertCircle size={32} className="text-slate-300" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] italic">{t("noPendingApplications")}</p>
            </Card>
          ) : (
            committees.pendingCommittees.map((c) => (
              <Card key={c._id} className="p-8 border-none shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{c.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2">{t("waitingForOrganizer")}</p>
                  <div className="flex items-center gap-3 py-3 px-4 bg-amber-500/10 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                    {t("processingRequest")}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
