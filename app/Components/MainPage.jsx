"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatMoney } from "../utils/commonFunc";
import { toast } from "react-toastify";
import moment from "moment";
import { FiGrid, FiLayers, FiCalendar, FiDollarSign, FiClock, FiCheckCircle, FiBell, FiAlertCircle } from "react-icons/fi";

import Button from "./Theme/Button";
import Card from "./Theme/Card";
import Notifications from "./NotifList";
import MyCommittie2 from "./MyCommittie2";
import AssociationRequests from "./AssociationRequests";
import AssociationTransparency from "./AssociationTransparency";
import DiscoveryPanel from "./DiscoveryPanel";
import ChatBox from "./ChatBox";
import { useLanguage } from "./LanguageContext";

export const dynamic = "force-dynamic";

export default function MainPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoggedData, setUserLoggedData] = useState(null);
  const [view, setView] = useState(searchParams.get("view") || "all");
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("member");
    if (!token) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(userData);
    setUserLoggedData(parsed);
    fetchCommittees();
    if (parsed?._id) fetchMemberById(parsed._id);
  }, [router]);

  useEffect(() => {
    const newView = searchParams.get("view") || "all";
    setView(newView);
  }, [searchParams]);

  const fetchMemberById = async (id) => {
    try {
      const res = await fetch(`/api/member/${id}`);
      if (!res.ok) throw new Error(t("syncFailed"));
      const data = await res.json();
      setUserLoggedData(data);
      localStorage.setItem("member", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCommittees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/committee");
      if (!res.ok) throw new Error(t("failedToFetchPools"));
      const data = await res.json();
      setCommittees(data);
    } catch (err) {
      toast.error(t("failedToFetchPools"));
    } finally {
      setLoading(false);
    }
  };

  const registerForCommittee = async (committee) => {
    const committeeId = committee._id;
    const adminId = committee.createdBy?._id || committee.createdBy;

    try {
      // Check if already associated
      const isAssociated = userLoggedData?.organizers?.some(org => (org._id || org) === adminId);
      const isPending = userLoggedData?.pendingOrganizers?.includes(adminId);

      if (!isAssociated && !isPending) {
        // Trigger auto-association
        await fetch("/api/member/pool", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: userLoggedData?._id,
            adminId: adminId
          }),
        });
      }

      const res = await fetch("/api/member/assign-members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: userLoggedData?._id,
          committeeId: committeeId,
        }),
      });
      if (!res.ok) throw new Error(t("error"));

      fetchMemberById(userLoggedData?._id);
      fetchCommittees();
      toast.success(t("applicationSubmitted"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getMemberStatus = (committeeId) => {
    const committeeRecord = userLoggedData?.committees?.find(c => (c.committee?._id || c.committee) === committeeId);
    if (!committeeRecord) return "available";
    return committeeRecord.status;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-in fade-in duration-500">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-2xl animate-spin shadow-lg" />
        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">{t("syncingData")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {view === "all" ? (
        <>
          <div className="flex flex-col gap-2 pb-6 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("discoverPools")}</h1>
            <p className="text-slate-500 font-medium italic">{t("browseParticipateDesc")}</p>
          </div>

          <DiscoveryPanel onChatClick={(other) => setActiveChat(other)} />

          {userLoggedData?.createdByAdminName && (
            <div className="flex items-center gap-4 p-6 bg-primary-500/5 rounded-[2rem] border border-primary-500/10">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <FiLayers size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Primary Organizer</p>
                <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                  Associated with: <span className="text-primary-600">{userLoggedData.createdByAdminName}</span>
                </p>
              </div>
            </div>
          )}

          <AssociationTransparency member={userLoggedData} />

          <AssociationRequests memberId={userLoggedData?._id} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committees.length === 0 ? (
              <Card className="col-span-full py-24 flex flex-col items-center gap-6 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-dashed">
                <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] text-slate-300">
                  <FiAlertCircle size={64} />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs italic">{t("noActiveCommittees")}</p>
              </Card>
            ) : committees.map((c) => {
              const status = getMemberStatus(c._id);
              const spotsLeft = c.maxMembers - (c.members?.length || 0);

              return (
                <Card key={c._id} className="group hover:scale-[1.02] transition-all duration-500 p-0 flex flex-col h-full border-none shadow-premium bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-hidden">
                  <div className="p-8 flex flex-col h-full space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-slate-900 dark:bg-white rounded-[1.5rem] text-white dark:text-slate-900 shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                        <FiLayers size={24} />
                      </div>
                      <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${spotsLeft > 0 ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
                        }`}>
                        {spotsLeft > 0 ? `${spotsLeft} ${t("spotsOpen")}` : t("poolFull")}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter line-clamp-1">{c.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic line-clamp-2 leading-relaxed">{c.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">{t("installment")}</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white block">PKR {formatMoney(c.monthlyAmount)}</span>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">{t("duration")}</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white block">{c.monthDuration} {t("durationMonths")}</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-auto">
                      {status === "available" ? (
                        <Button
                          className="w-full py-4 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-500/20"
                          disabled={spotsLeft <= 0}
                          onClick={() => registerForCommittee(c)}
                        >
                          {t("applyToJoin")}
                        </Button>
                      ) : status === "pending" ? (
                        <div className="w-full flex items-center justify-center gap-3 py-4 bg-amber-500/10 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-sm">
                          <FiClock className="animate-pulse" /> {t("applicationPending")}
                        </div>
                      ) : (
                        <button
                          onClick={() => router.push(`/userDash/committee/${c._id}`)}
                          className="w-full flex items-center justify-center gap-3 py-4 bg-green-500/10 text-green-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-500/20 shadow-sm hover:bg-green-500/20 transition-all"
                        >
                          <FiCheckCircle /> {t("memberStatusLocked")} — View Details
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <MyCommittie2 />
      )}


      {/* Announcements */}
      <div id="notifications" className="pt-12 scroll-mt-24 space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl">
            <FiBell size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("recentAnnouncements")}</h2>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>
        <Notifications user={true} userId={userLoggedData?._id} />
      </div>

      {/* Results Block */}
      <div className="pt-12 space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl">
            <FiCheckCircle size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t("drawingResults")}</h2>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {committees.filter(c => c.result?.length > 0).map((c) => (
            <Card key={c._id} className="border-none shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-green-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{c.name}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {moment(c.announcementDate).format("MMM DD, YYYY")}
                </span>
              </div>
              <div className="space-y-3">
                {c.result.slice(0, 3).map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl transition-all hover:bg-slate-100 dark:hover:bg-slate-700">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-xl text-xs font-black shadow-lg shadow-primary-500/20">
                        {res.position}
                      </span>
                      <span className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-tight">{res.member?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {
        activeChat && (
          <ChatBox
            currentUserId={userLoggedData?._id}
            currentUserModel="Member"
            otherUserId={activeChat._id}
            otherUserName={activeChat.name}
            otherUserModel={activeChat.isAdmin ? "Admin" : "Member"}
            onClose={() => setActiveChat(null)}
          />
        )
      }
    </div >
  );
}
