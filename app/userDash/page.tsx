"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiMessageCircle,
  FiUser,
  FiMapPin,
  FiArrowRight,
  FiBell,
  FiUpload,
  FiAward,
} from "react-icons/fi";

import Button from "../Components/Theme/Button";
import Card from "../Components/Theme/Card";
import Stat from "../Components/Theme/Stat";
import Money from "../Components/Theme/Money";
import StatusPill from "../Components/Theme/StatusPill";
import CycleProgress from "../Components/Theme/CycleProgress";
import EmptyState from "../Components/Theme/EmptyState";
import BlueTick from "../Components/Theme/BlueTick";
import BilingualLabel from "../Components/Theme/BilingualLabel";

type Member = {
  _id: string;
  name: string;
  email?: string;
  city?: string;
  county?: string;
  phone?: number | string;
  verificationStatus?: "unverified" | "pending" | "verified";
  status?: string;
};

type Committee = {
  _id: string;
  name: string;
  description?: string;
  monthlyAmount: number;
  monthDuration: number;
  totalAmount: number;
  maxMembers: number;
  currentMonth: number;
  status: "open" | "full" | "ongoing" | "finished";
  members: any[];
  pendingMembers: any[];
  payments?: any[];
  payouts?: any[];
  createdBy?: any;
  adminDetails?: { name?: string; email?: string };
};

export default function UserDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [member, setMember] = useState<Member | null>(null);
  const [approved, setApproved] = useState<Committee[]>([]);
  const [pending, setPending] = useState<Committee[]>([]);
  const [explore, setExplore] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const raw = typeof window !== "undefined" ? localStorage.getItem("member") : null;
    if (!token || !raw) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setMember(parsed);
      void hydrate(parsed._id, token);
    } catch {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function hydrate(id: string, token: string) {
    setLoading(true);
    try {
      const [meRes, myRes, openRes] = await Promise.all([
        fetch(`/api/member/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/member/my-committie", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userId: id }),
        }),
        fetch("/api/committee?limit=6"),
      ]);

      if (meRes.ok) {
        const me = await meRes.json();
        setMember(me);
        localStorage.setItem("member", JSON.stringify(me));
      }

      if (myRes.ok) {
        const my = await myRes.json();
        setApproved(my.approvedCommittees || []);
        setPending(my.pendingCommittees || []);
      }

      if (openRes.ok) {
        const open = await openRes.json();
        setExplore((open.committees || []).filter((c: Committee) => c.status === "open").slice(0, 4));
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load your dashboard — check connection");
    } finally {
      setLoading(false);
    }
  }

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Assalam-o-Alaikum, subh bakhair";
    if (h < 18) return "Assalam-o-Alaikum";
    return "Assalam-o-Alaikum, shaam bakhair";
  }, []);

  const verification = member?.verificationStatus ?? "unverified";

  const dueThisMonth = useMemo(() => {
    if (!member) return { count: 0, amount: 0 };
    let count = 0;
    let amount = 0;
    approved.forEach((c) => {
      const myPay = (c.payments || []).find(
        (p: any) => p.member?.toString?.() === member._id && p.month === c.currentMonth,
      );
      const status = myPay?.status || "unpaid";
      if (status === "unpaid" || status === "rejected") {
        count += 1;
        amount += c.monthlyAmount || 0;
      }
    });
    return { count, amount };
  }, [approved, member]);

  const totalCommittees = approved.length + pending.length;

  if (loading && !member) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-2xl border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8 md:py-12">
      {/* ─────── Greeting + identity ─────── */}
      <section className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <Card className="relative overflow-hidden">
          <div className="jaali-border pointer-events-none absolute -right-12 -top-12 h-48 w-48 opacity-30" />
          <div className="relative space-y-4">
            <p className="eyebrow">Dashboard · ڈیش بورڈ</p>
            <h1 className="text-3xl font-black tracking-tighter text-ink-900 md:text-4xl">
              {greeting},
              <br />
              <span className="text-primary-700">{member?.name?.split(" ")[0] || "Member"}.</span>
            </h1>
            <p className="font-urdu text-lg text-muted-500" dir="rtl">
              آپ کا کمیٹی ڈیش بورڈ
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-border-100 bg-surface-100/60 px-3 py-1.5 text-xs font-bold text-muted-600">
                <FiMapPin className="text-primary-600" />
                {member?.city || "—"} {member?.county ? `· ${member.county}` : ""}
              </span>
              <VerificationPill status={verification} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-lg font-black text-white">
                  {member?.name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-base font-black text-ink-900">
                    {member?.name} {verification === "verified" ? <BlueTick verified size={14} /> : null}
                  </p>
                  <p className="text-xs text-muted-500">{member?.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link href="/userDash/profile">
                <Button variant="secondary" size="sm" className="w-full">
                  <FiUser /> Profile
                </Button>
              </Link>
              <Link href="/userDash/inbox">
                <Button variant="secondary" size="sm" className="w-full">
                  <FiMessageCircle /> Inbox
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* ─────── Verification CTA ─────── */}
      {verification !== "verified" ? (
        <Card className="border-warning-500/30 bg-warning-500/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-warning-500/15 text-warning-700">
                <FiAlertTriangle size={22} />
              </div>
              <div>
                <p className="text-base font-black text-ink-900">
                  {verification === "pending"
                    ? "Verification under review"
                    : "Apni profile verify karain"}
                </p>
                <p className="text-sm text-muted-600">
                  {verification === "pending"
                    ? "Aap ke documents super admin ke paas review ke liye hain. 24 ghante mein update ho jata hai."
                    : "CNIC front/back + selfie upload karain. Verified members ko Blue Tick aur committees mein priority milti hai."}
                </p>
              </div>
            </div>
            <Link href="/userDash/profile">
              <Button variant={verification === "pending" ? "secondary" : "primary"}>
                {verification === "pending" ? "View status" : "Verify now"} <FiArrowRight />
              </Button>
            </Link>
          </div>
        </Card>
      ) : null}

      {/* ─────── Stats strip ─────── */}
      <section className="grid gap-4 md:grid-cols-4">
        <Stat
          label="My committees"
          urduLabel="میری کمیٹیاں"
          value={String(totalCommittees)}
          hint={`${approved.length} active · ${pending.length} pending`}
          icon={FiAward}
          tone="primary"
        />
        <Stat
          label="Due this month"
          urduLabel="اس مہینے واجب"
          value={<Money amount={dueThisMonth.amount} size="md" tone="danger" />}
          hint={`${dueThisMonth.count} pending payment${dueThisMonth.count === 1 ? "" : "s"}`}
          icon={FiClock}
          tone={dueThisMonth.count > 0 ? "warning" : "success"}
        />
        <Stat
          label="Verified status"
          urduLabel="تصدیق کی حیثیت"
          value={verification === "verified" ? "Yes" : verification === "pending" ? "Pending" : "Not yet"}
          icon={FiCheckCircle}
          tone={verification === "verified" ? "success" : "warning"}
        />
        <Stat
          label="Open committees nearby"
          urduLabel="قریبی کمیٹیاں"
          value={String(explore.length)}
          hint="Tap to explore"
          icon={FiSearch}
          tone="accent"
        />
      </section>

      {/* ─────── Quick actions ─────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-muted-500">Quick actions</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <ActionTile
            href="/userDash/explore"
            icon={FiSearch}
            title="Explore committees"
            urdu="کمیٹیاں دیکھیں"
          />
          <ActionTile
            href="/userDash/near-me"
            icon={FiMapPin}
            title="Near me"
            urdu="میرے قریب"
          />
          <ActionTile
            href="/userDash/inbox"
            icon={FiMessageCircle}
            title="Messages"
            urdu="پیغامات"
          />
          <ActionTile
            href="/guide/member"
            icon={FiBell}
            title="How it works"
            urdu="کیسے استعمال کریں"
          />
        </div>
      </section>

      {/* ─────── My committees ─────── */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="eyebrow">Active · فعال</p>
            <h2 className="text-2xl font-black tracking-tight text-ink-900">My committees</h2>
          </div>
          <Link href="/userDash/explore">
            <Button variant="ghost" size="sm">
              Explore more <FiArrowRight />
            </Button>
          </Link>
        </div>

        {approved.length === 0 ? (
          <EmptyState
            icon={FiAward}
            title="No active committees yet"
            description="Browse open pools and send a join request. Verified members get priority approval."
            action={
              <Link href="/userDash/explore">
                <Button variant="primary">Explore committees</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {approved.map((c) => (
              <MemberCommitteeCard key={c._id} committee={c} memberId={member?._id} />
            ))}
          </div>
        )}
      </section>

      {/* ─────── Pending requests ─────── */}
      {pending.length > 0 ? (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">Awaiting · زیر التواء</p>
              <h2 className="text-2xl font-black tracking-tight text-ink-900">Pending requests</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((c) => (
              <Card key={c._id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-black text-ink-900">{c.name}</h3>
                      <p className="text-xs text-muted-500">
                        Organizer: {c.adminDetails?.name || c.createdBy?.name || "—"}
                      </p>
                    </div>
                    <StatusPill tone="warning">Pending</StatusPill>
                  </div>
                  <Money amount={c.monthlyAmount} size="md" tone="primary" suffix="per month" />
                  <p className="text-xs text-muted-500">
                    Organizer review pending — you'll be notified once approved.
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* ─────── Discover ─────── */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="eyebrow">Discover · دریافت</p>
            <h2 className="text-2xl font-black tracking-tight text-ink-900">Committees open right now</h2>
          </div>
        </div>

        {explore.length === 0 ? (
          <EmptyState
            icon={FiSearch}
            title="No open committees right now"
            description="Check back soon — new pools open every week."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {explore.map((c) => (
              <Card key={c._id} className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-ink-900">{c.name}</h3>
                    <p className="text-xs text-muted-500">
                      {c.maxMembers} members · {c.monthDuration} months
                    </p>
                  </div>
                  <StatusPill tone="info">Open</StatusPill>
                </div>
                <Money amount={c.monthlyAmount} size="md" tone="primary" suffix="per month" />
                <p className="text-xs text-muted-500">
                  Total pool · <Money amount={c.totalAmount} size="sm" tone="accent" />
                </p>
                <Link href={`/userDash/committee/${c._id}`} className="mt-auto">
                  <Button variant="outline" className="w-full">
                    <BilingualLabel en="View details" ur="تفصیل دیکھیں" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ────────── helpers (file-local; no new primitives) ────────── */

function VerificationPill({ status }: { status: string }) {
  if (status === "verified")
    return (
      <StatusPill tone="success">
        <FiCheckCircle size={12} /> Verified
      </StatusPill>
    );
  if (status === "pending")
    return (
      <StatusPill tone="warning">
        <FiClock size={12} /> Verification pending
      </StatusPill>
    );
  return (
    <StatusPill tone="danger">
      <FiAlertTriangle size={12} /> Not verified
    </StatusPill>
  );
}

function ActionTile({
  href,
  icon: Icon,
  title,
  urdu,
}: {
  href: string;
  icon: any;
  title: string;
  urdu: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[1.5rem] border border-border-100 bg-surface-50 p-4 transition hover:-translate-y-0.5 hover:border-primary-500/50 hover:shadow-card"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-ink-900">{title}</p>
        <p className="font-urdu text-xs text-muted-500" dir="rtl">
          {urdu}
        </p>
      </div>
    </Link>
  );
}

function MemberCommitteeCard({
  committee,
  memberId,
}: {
  committee: Committee;
  memberId?: string;
}) {
  const paidThisMonth = committee.payments?.find(
    (p: any) =>
      p.member?.toString?.() === memberId && p.month === committee.currentMonth,
  );
  const paidStatus = paidThisMonth?.status || "unpaid";

  const paidCount = (committee.payments || []).filter(
    (p: any) => p.month === committee.currentMonth && p.status === "verified",
  ).length;

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-ink-900">{committee.name}</h3>
            <p className="text-xs text-muted-500">
              Organizer: {committee.adminDetails?.name || committee.createdBy?.name || "—"}
            </p>
          </div>
          <StatusPill tone={committee.status === "ongoing" ? "success" : "info"}>
            {committee.status}
          </StatusPill>
        </div>

        <CycleProgress
          current={committee.currentMonth}
          total={committee.monthDuration}
          paidCount={paidCount}
          memberCount={committee.members?.length}
          status={committee.status === "open" ? "open" : "ongoing"}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-100 bg-surface-100/60 p-3">
            <p className="eyebrow mb-0.5">Monthly</p>
            <Money amount={committee.monthlyAmount} size="md" tone="primary" />
          </div>
          <div className="rounded-2xl border border-border-100 bg-surface-100/60 p-3">
            <p className="eyebrow mb-0.5">Your status</p>
            <StatusPill
              tone={
                paidStatus === "verified"
                  ? "success"
                  : paidStatus === "pending"
                    ? "warning"
                    : paidStatus === "rejected"
                      ? "danger"
                      : "neutral"
              }
            >
              {paidStatus}
            </StatusPill>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link href={`/userDash/committee/${committee._id}`}>
            <Button variant="secondary" size="sm" className="w-full">
              Details
            </Button>
          </Link>
          {paidStatus !== "verified" ? (
            <Link href={`/userDash/committee/${committee._id}?action=pay`}>
              <Button variant="primary" size="sm" className="w-full">
                <FiUpload /> Pay
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" size="sm" className="w-full" disabled>
              <FiCheckCircle /> Paid
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
