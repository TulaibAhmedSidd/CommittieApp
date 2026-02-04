"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCommittees, deleteCommittee } from "./apis";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit3, FiTrash2, FiUsers, FiDollarSign, FiCalendar, FiArrowRight, FiActivity, FiLayers, FiInfo } from "react-icons/fi";
import moment from "moment";
import { formatMoney } from "@/app/utils/commonFunc";
import { toast } from "react-toastify";

import Button from "../Components/Theme/Button";
import Card from "../Components/Theme/Card";
import { useLanguage } from "../Components/LanguageContext";

export const dynamic = "force-dynamic";

export default function Committiee() {
  const { t } = useLanguage();
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoggedDetails, setUserLoggedDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const detail = localStorage.getItem("admin_detail");
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (detail) {
      setUserLoggedDetails(JSON.parse(detail));
    }

    loadCommittees();
  }, [router]);

  async function loadCommittees() {
    if (!userLoggedDetails?._id) return;
    setLoading(true);
    try {
      const data = await fetchCommittees(userLoggedDetails._id);
      setCommittees(data);
    } catch (err) {
      toast.error(t("error") + ": " + (err.message || "Failed to load"));
    } finally {
      setLoading(false);
    }
  }

  // Re-load when user details are available
  useEffect(() => {
    if (userLoggedDetails?._id) loadCommittees();
  }, [userLoggedDetails]);

  const handleDelete = async (id) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await deleteCommittee(id);
      setCommittees(committees.filter((c) => c._id !== id));
      toast.success(t("deleteSuccess"));
    } catch (err) {
      toast.error(t("error"));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/20 rounded-full" />
          <div className="absolute top-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-slate-500 font-black tracking-widest uppercase text-[10px] animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-none relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-500">
                  <FiActivity size={18} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{t("systemHealth")}</span>
              </div>
              <div>
                <h4 className="text-3xl font-black text-white tracking-tighter uppercase">{t("operational") || "Operational"}</h4>
                <p className="text-xs text-slate-500 font-medium">{t("activePools")}: {committees.length}</p>
              </div>
            </div>
            <FiActivity size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-primary-600/10 transition-colors" />
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-premium group cursor-pointer hover:shadow-2xl transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                  <FiDollarSign size={18} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{t("totalValuation")}</span>
              </div>
              <div>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                  RS {formatMoney(committees.reduce((acc, c) => acc + (c.totalAmount || 0), 0))}
                </h4>
                <p className="text-xs text-slate-500 font-medium">{t("totalValuation")}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-primary-600 border-none shadow-premium-hover flex flex-col justify-between relative overflow-hidden p-6">
          <div className="relative z-10">
            <h3 className="text-white text-xl font-black tracking-tighter mb-2 uppercase">{t("newPool") || "New Pool"}</h3>
            <p className="text-white/70 text-xs mb-6 max-w-[200px] font-medium">{t("createPoolDesc") || "Create a new committee pool"}</p>
            <Link href="/admin/create">
              <Button className="w-full bg-white text-primary-600 border-none hover:bg-white/90 shadow-xl shadow-black/10 font-black uppercase text-[10px] tracking-widest py-4">
                {t("createPool") || "Create Pool"} <FiPlus className="ml-1" />
              </Button>
            </Link>
          </div>
          <FiLayers size={140} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
        </Card>
      </div>

      {/* Main List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-primary-600 rounded-full" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("operationalPools") || "Operational Pools"}</h2>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t("totalPools") || "Total Pools"}: {committees.length}
          </div>
        </div>

        {committees.length === 0 ? (
          <Card className="py-24 border-dashed bg-transparent border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400">
              <FiInfo size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t("noData")}</h3>
              <p className="text-sm text-slate-500 max-w-xs italic">{t("noPoolsYet")}</p>
            </div>
            <Link href="/admin/create">
              <Button variant="outline" className="border-2 font-black uppercase tracking-widest text-[10px]">{t("createPool")}</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {committees.map((c) => {
              const isOwner = true; // Since we filter by API now
              const isReadyToAnnounce = c.status === "open" && c.members.length >= c.maxMembers;

              return (
                <Card key={c._id} className={`group p-0 border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 ${isReadyToAnnounce ? "ring-2 ring-primary-500" : ""}`}>
                  {isReadyToAnnounce && (
                    <div className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest py-2 text-center animate-pulse">
                      ⚠️ Action Required: Ready to Announce Result
                    </div>
                  )}
                  <div className="p-8 space-y-8">
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${isReadyToAnnounce ? 'bg-red-500' : 'bg-green-500'}`} />
                          <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.3em]">{t("uid")}://{c._id.substring(c._id.length - 8)}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none group-hover:text-primary-600 transition-colors uppercase">{c.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/edit?id=${c._id}`}>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50">
                            <FiEdit3 size={18} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(c._id)}
                          className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 size={18} />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed h-10 italic">
                      {c.description || t("noDescription")}
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("cycleDuration")}</p>
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                          <FiCalendar className="text-primary-500" size={14} />
                          <span className="text-xs font-black uppercase">{moment(c.startDate).format("MMM 'YY")} - {moment(c.endDate).format("MMM 'YY")}</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("members")}</p>
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                          <FiUsers className="text-primary-500" size={14} />
                          <span className="text-xs font-black">{c.members?.length || 0} / {c.maxMembers}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("monthlyPulse")}</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                          RS {formatMoney(c.monthlyAmount)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/manage?id=${c._id}`} className="px-6 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black uppercase text-[10px] tracking-widest cursor-pointer shadow-lg hover:bg-primary-700 transition-all">
                          {t("manage") || "Manage"}
                        </Link>
                        <Link href={`/admin/announcement?id=${c._id}`} className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 group-hover:bg-primary-600 group-hover:text-white transition-all cursor-pointer shadow-lg">
                          <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
