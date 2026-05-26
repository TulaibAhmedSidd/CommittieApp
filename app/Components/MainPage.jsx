"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatMoney } from "../utils/commonFunc";
import { toast } from "react-toastify";
import moment from "moment";
import { FiGrid, FiLayers, FiCalendar, FiDollarSign, FiClock, FiCheckCircle, FiBell, FiAlertCircle } from "react-icons/fi";

import Button from "./Theme/Button";
import Card from "./Theme/Card";
import EmptyState from "./Theme/EmptyState";
import Notifications from "./NotifList";
import MyCommittie2 from "./MyCommittie2";
import AssociationRequests from "./AssociationRequests";
import AssociationTransparency from "./AssociationTransparency";
import DiscoveryPanel from "./DiscoveryPanel";
import SectionHeader from "./Theme/SectionHeader";
import StatusPill from "./Theme/StatusPill";
import VerifiedMember from "./VerifiedMember";
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
      const token = localStorage.getItem("token");
      const securedRes = await fetch(`/api/member/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!securedRes.ok) throw new Error(t("syncFailed"));
      const data = await securedRes.json();
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
      setCommittees(data?.committees);
    } catch (err) {
      toast.error(t("failedToFetchPools"));
    } finally {
      setLoading(false);
    }
  };

  const registerForCommittee = async (committee) => {
    // Verification Check
    if (userLoggedData?.verificationStatus !== "verified") {
      toast.warning("Verification Required! Please complete your profile verification first.");
      router.push("/userDash?view=verification");
      return;
    }

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            memberId: userLoggedData?._id,
            adminId: adminId
          }),
        });
      }

      const res = await fetch(`/api/committee/${committeeId}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          memberId: userLoggedData?._id
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
    const idStr = committeeId.toString();
    const committeeRecord = userLoggedData?.committees?.find(c => (c.committee?._id || c.committee)?.toString() === idStr);
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
      {view === "verification" ? (
        <VerifiedMember member={userLoggedData} onUpdate={(updated) => setUserLoggedData(updated)} />
      ) : view === "all" ? (
        <>
          <div className="dashboard-shell p-8 md:p-10">
            <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-primary-500/10 to-transparent" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-5">
                <SectionHeader
                  eyebrow="Member Command Center"
                  icon={FiLayers}
                  title={`Build your monthly saving momentum with more clarity.`}
                  description={t("browseParticipateDesc")}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="metric-tile">
                    <p className="eyebrow">Verification</p>
                    <p className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                      {userLoggedData?.verificationStatus === "verified" ? "Ready" : "Pending"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Your identity status controls premium committee access.
                    </p>
                  </div>
                  <div className="metric-tile">
                    <p className="eyebrow">Open Requests</p>
                    <p className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                      {userLoggedData?.committees?.filter((item) => item.status === "pending").length || 0}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Track pending join approvals without chasing organizers.
                    </p>
                  </div>
                  <div className="metric-tile">
                    <p className="eyebrow">Active Circles</p>
                    <p className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                      {userLoggedData?.committees?.filter((item) => item.status === "approved").length || 0}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Keep sight of the circles already moving in your favor.
                    </p>
                  </div>
                </div>
              </div>

              <Card className="border-none bg-slate-950 text-white shadow-[0_28px_70px_-34px_rgba(15,23,42,0.75)] dark:bg-slate-900">
                <div className="space-y-5 p-1">
                  <StatusPill tone={userLoggedData?.verificationStatus === "verified" ? "success" : "warning"} className="w-fit bg-white/10 text-white border-white/10">
                    {userLoggedData?.verificationStatus === "verified" ? "Verified access" : "Verification required"}
                  </StatusPill>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter">Trust moves faster when your profile is complete.</h3>
                    <p className="text-sm font-medium leading-6 text-slate-300">
                      Complete verification, connect with proven organizers, and keep every payment trail visible.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Organizer link</p>
                      <p className="mt-2 text-lg font-black">
                        {userLoggedData?.createdByAdminName || "Independent member"}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Next best action</p>
                      <p className="mt-2 text-lg font-black">
                        {userLoggedData?.verificationStatus === "verified" ? "Explore committees" : "Submit verification"}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white text-slate-950 hover:bg-slate-100 dark:bg-white dark:text-slate-950"
                    onClick={() => router.push(userLoggedData?.verificationStatus === "verified" ? "/userDash/explore" : "/userDash?view=verification")}
                  >
                    {userLoggedData?.verificationStatus === "verified" ? "Explore committees" : "Finish verification"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
          <DiscoveryPanel
            member={userLoggedData}
            refreshMember={() => fetchMemberById(userLoggedData?._id)}
            onChatClick={(other) => setActiveChat(other)}
          />

          {userLoggedData?.createdByAdminName && (
            <div className="dashboard-shell flex items-center gap-6 p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3">
                <FiLayers size={26} />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-1">Connected organizer</p>
                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  Member of Node: <span className="text-primary-600 italic">{userLoggedData.createdByAdminName}</span>
                </p>
              </div>
            </div>
          )}

          <AssociationTransparency member={userLoggedData} />

          <AssociationRequests memberId={userLoggedData?._id} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committees.length === 0 ? (
              <EmptyState
                icon={FiAlertCircle}
                title={t("noActiveCommittees")}
                description="Fresh circles will appear here as trusted organizers open new monthly opportunities."
                className="col-span-full"
              />
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
                      <StatusPill tone={spotsLeft > 0 ? "success" : "danger"}>
                        {spotsLeft > 0 ? `${spotsLeft} ${t("spotsOpen")}` : t("poolFull")}
                      </StatusPill>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter line-clamp-1"
                        onClick={() => { router.push('/userDash/committee/' + c._id) }}
                      >{c.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic line-clamp-2 leading-relaxed">{c.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <StatusPill tone="info">Protected payout trail</StatusPill>
                        <StatusPill tone={c.requireDocuments ? "warning" : "neutral"}>
                          {c.requireDocuments ? "Docs required" : "Quick apply"}
                        </StatusPill>
                      </div>
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
                        userLoggedData?.verificationStatus !== "verified" ? (
                          <div className="space-y-3">
                            <Button
                              className="w-full py-4 bg-amber-600 hover:bg-amber-700 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-600/20"
                              onClick={() => router.push("/userDash?view=verification")}
                            >
                              Verification Required
                            </Button>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight text-center bg-slate-50 dark:bg-slate-800/50 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                              Requires: NIC (Front/Back) & Electricity Bill
                            </p>
                          </div>
                        ) : (
                          <Button
                            className="w-full py-4 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-500/20"
                            disabled={spotsLeft <= 0}
                            onClick={() => registerForCommittee(c)}
                          >
                            {t("applyToJoin")}
                          </Button>
                        )
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
        <SectionHeader
          eyebrow="Communication"
          icon={FiBell}
          title={t("recentAnnouncements")}
          description="Keep a clean view of organizer messages, committee updates, and member-facing alerts."
        />
        <Notifications user={true} userId={userLoggedData?._id} />
      </div>

      {/* Results Block */}
      <div className="pt-12 space-y-8">
        <SectionHeader
          eyebrow="Payout Order"
          icon={FiCheckCircle}
          title={t("drawingResults")}
          description="Review announced draw positions and understand who is scheduled first in each live committee."
        />
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
