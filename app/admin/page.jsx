"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FiActivity,
    FiLayers,
    FiUsers,
    FiClock,
    FiPlusSquare,
    FiCheckCircle,
    FiShield,
    FiBell,
    FiMessageSquare,
    FiArrowRight,
    FiAlertTriangle,
    FiTrendingUp,
    FiZap,
} from "react-icons/fi";

import Card from "../Components/Theme/Card";
import Stat from "../Components/Theme/Stat";
import Money from "../Components/Theme/Money";
import StatusPill from "../Components/Theme/StatusPill";
import Button from "../Components/Theme/Button";
import CycleProgress from "../Components/Theme/CycleProgress";
import EmptyState from "../Components/Theme/EmptyState";
import BilingualLabel from "../Components/Theme/BilingualLabel";

export default function AdminDashboard() {
    const router = useRouter();
    const [admin, setAdmin] = useState(null);
    const [stats, setStats] = useState({
        activeCommittees: 0,
        totalMembers: 0,
        pendingApprovals: 0,
        systemStatus: "Operational",
    });
    const [committees, setCommittees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("admin_token");
        const raw = localStorage.getItem("admin_detail");
        if (!token || !raw) {
            router.push("/admin/login");
            return;
        }
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch {
            router.push("/admin/login");
            return;
        }
        setAdmin(parsed);
        void hydrate(parsed._id, token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function hydrate(adminId, token) {
        setLoading(true);
        try {
            const [statsRes, committeesRes] = await Promise.all([
                fetch(`/api/admin/stats?adminId=${adminId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`/api/committee?adminId=${adminId}&limit=6`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (statsRes.ok) {
                const s = await statsRes.json();
                setStats(s);
            }
            if (committeesRes.ok) {
                const c = await committeesRes.json();
                setCommittees(c.committees || []);
            }
        } catch (err) {
            console.error(err);
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

    const totalPooled = useMemo(
        () => committees.reduce((acc, c) => acc + (c.totalAmount || 0), 0),
        [committees],
    );

    const isSuperAdmin = !!admin?.isSuperAdmin;

    if (loading && !admin) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-2xl border-4 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-8">
            {/* ─────── Greeting card ─────── */}
            <Card className="relative overflow-hidden">
                <div className="jaali-border pointer-events-none absolute -right-12 -top-12 h-56 w-56 opacity-30" />
                <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr]">
                    <div className="space-y-3">
                        <p className="eyebrow">Organizer console · منتظم</p>
                        <h1 className="text-3xl font-black tracking-tighter text-ink-900 md:text-4xl">
                            {greeting},
                            <br />
                            <span className="text-primary-700">{admin?.name?.split(" ")[0] || "Organizer"}.</span>
                        </h1>
                        <p className="font-urdu text-lg text-muted-500" dir="rtl">
                            آپ کی کمیٹیوں کا کنٹرول پینل
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <StatusPill tone="success">
                                <FiZap size={12} /> {stats.systemStatus}
                            </StatusPill>
                            {isSuperAdmin ? (
                                <StatusPill tone="accent">
                                    <FiShield size={12} /> Super admin
                                </StatusPill>
                            ) : (
                                <StatusPill tone="info">
                                    <FiUsers size={12} /> Organizer
                                </StatusPill>
                            )}
                            {admin?.verificationStatus === "verified" ? (
                                <StatusPill tone="success">
                                    <FiCheckCircle size={12} /> Verified
                                </StatusPill>
                            ) : (
                                <StatusPill tone="warning">
                                    <FiAlertTriangle size={12} /> Verification {admin?.verificationStatus || "pending"}
                                </StatusPill>
                            )}
                        </div>
                    </div>

                    <Card className="border-primary-500/30 bg-primary-500/5">
                        <div className="space-y-3">
                            <p className="eyebrow">Across your committees</p>
                            <Money amount={totalPooled} size="xl" tone="primary" />
                            <p className="text-xs text-muted-500">
                                Total pooled value · live across {stats.activeCommittees} committee
                                {stats.activeCommittees === 1 ? "" : "s"}
                            </p>
                            <Link href="/admin/create">
                                <Button variant="primary" className="w-full">
                                    <FiPlusSquare /> New committee
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </Card>

            {/* ─────── Stats strip ─────── */}
            <section className="grid gap-4 md:grid-cols-4">
                <Stat
                    label="Active committees"
                    urduLabel="فعال کمیٹیاں"
                    value={String(stats.activeCommittees)}
                    icon={FiLayers}
                    tone="primary"
                />
                <Stat
                    label="Total members"
                    urduLabel="کل اراکین"
                    value={String(stats.totalMembers)}
                    hint={`across all your committees`}
                    icon={FiUsers}
                    tone="accent"
                />
                <Stat
                    label="Pending approvals"
                    urduLabel="منظوری زیر التواء"
                    value={String(stats.pendingApprovals)}
                    hint={
                        stats.pendingApprovals > 0
                            ? "Members waiting for your approval"
                            : "All caught up"
                    }
                    icon={FiClock}
                    tone={stats.pendingApprovals > 0 ? "warning" : "success"}
                />
                <Stat
                    label="Total pooled"
                    urduLabel="کل جمع رقم"
                    value={<Money amount={totalPooled} size="md" tone="primary" />}
                    icon={FiTrendingUp}
                    tone="success"
                />
            </section>

            {/* ─────── Pending approvals callout ─────── */}
            {stats.pendingApprovals > 0 ? (
                <Card className="border-warning-500/30 bg-warning-500/5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-warning-500/15 text-warning-700">
                                <FiClock size={22} />
                            </div>
                            <div>
                                <p className="text-base font-black text-ink-900">
                                    {stats.pendingApprovals} member request
                                    {stats.pendingApprovals === 1 ? "" : "s"} waiting
                                </p>
                                <p className="text-sm text-muted-600">
                                    Members ne join karne ki request bheji hai — review aur approve karain.
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/members">
                            <Button variant="primary">
                                Review requests <FiArrowRight />
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : null}

            {/* ─────── Quick actions ─────── */}
            <section>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-[0.18em] text-muted-500">
                        Quick actions · فوری کام
                    </h2>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                    <ActionTile
                        href="/admin/create"
                        icon={FiPlusSquare}
                        title="Create committee"
                        urdu="نئی کمیٹی"
                        tone="primary"
                    />
                    <ActionTile
                        href="/admin/members"
                        icon={FiUsers}
                        title="Manage members"
                        urdu="اراکین"
                        tone="accent"
                    />
                    <ActionTile
                        href="/admin/announcement"
                        icon={FiBell}
                        title="Announcements"
                        urdu="اعلانات"
                    />
                    <ActionTile
                        href="/admin/inbox"
                        icon={FiMessageSquare}
                        title="Inbox"
                        urdu="پیغامات"
                    />
                    {isSuperAdmin ? (
                        <>
                            <ActionTile
                                href="/admin/approvals"
                                icon={FiShield}
                                title="Approve organizers"
                                urdu="آرگنائزر منظوری"
                                tone="accent"
                            />
                            <ActionTile
                                href="/admin/verify-identities"
                                icon={FiCheckCircle}
                                title="Verify identities"
                                urdu="شناخت کی تصدیق"
                            />
                            <ActionTile
                                href="/admin/logs"
                                icon={FiActivity}
                                title="Audit logs"
                                urdu="آڈٹ ٹریل"
                            />
                            <ActionTile
                                href="/admin/all-members"
                                icon={FiUsers}
                                title="Global member pool"
                                urdu="عالمی پول"
                            />
                        </>
                    ) : (
                        <>
                            <ActionTile
                                href="/admin/assign-member"
                                icon={FiUsers}
                                title="Add members"
                                urdu="اراکین شامل کریں"
                            />
                            <ActionTile
                                href="/admin/referrals"
                                icon={FiZap}
                                title="Referral center"
                                urdu="ریفرل سینٹر"
                            />
                            <ActionTile
                                href="/admin/profile"
                                icon={FiShield}
                                title="My profile"
                                urdu="پروفائل"
                            />
                            <ActionTile
                                href="/guide/organizer"
                                icon={FiBell}
                                title="Organizer guide"
                                urdu="رہنما"
                            />
                        </>
                    )}
                </div>
            </section>

            {/* ─────── Live committees ─────── */}
            <section>
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <p className="eyebrow">Active pools · فعال پول</p>
                        <h2 className="text-2xl font-black tracking-tight text-ink-900">Your committees</h2>
                    </div>
                    <Link href="/admin/manage-committie">
                        <Button variant="ghost" size="sm">
                            Manage all <FiArrowRight />
                        </Button>
                    </Link>
                </div>

                {committees.length === 0 ? (
                    <EmptyState
                        icon={FiLayers}
                        title="No committees yet"
                        description="Spin up your first committee — set monthly amount, max members, and duration."
                        action={
                            <Link href="/admin/create">
                                <Button variant="primary">
                                    <FiPlusSquare /> Create your first committee
                                </Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {committees.map((c) => (
                            <AdminCommitteeCard key={c._id} c={c} />
                        ))}
                    </div>
                )}
            </section>

            {/* ─────── Onboarding hint ─────── */}
            <Card className="border-accent-500/30 bg-accent-500/5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-700">
                            <FiBell size={22} />
                        </div>
                        <div>
                            <p className="text-base font-black text-ink-900">New to the organizer console?</p>
                            <p className="text-sm text-muted-600">
                                Detailed walkthrough — every option explained in plain Urdu + English.
                            </p>
                        </div>
                    </div>
                    <Link href="/guide/organizer">
                        <Button variant="accent">
                            <BilingualLabel en="Read organizer guide" ur="رہنما پڑھیں" />
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}

/* ────────── helpers ────────── */

function ActionTile({ href, icon: Icon, title, urdu, tone = "default" }) {
    const toneClasses = {
        default: "bg-primary-500/10 text-primary-600 group-hover:bg-primary-600 group-hover:text-white",
        primary: "bg-primary-600 text-white group-hover:bg-primary-700",
        accent: "bg-accent-500 text-ink-900 group-hover:bg-accent-600",
    };
    return (
        <Link
            href={href}
            className="group flex items-center gap-4 rounded-[1.5rem] border border-border-100 bg-surface-50 p-4 transition hover:-translate-y-0.5 hover:border-primary-500/50 hover:shadow-card"
        >
            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl transition ${toneClasses[tone] || toneClasses.default}`}>
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

function AdminCommitteeCard({ c }) {
    const paidCount = (c.payments || []).filter(
        (p) => p.month === c.currentMonth && p.status === "verified",
    ).length;
    const memberCount = c.members?.length || 0;
    const isFull = memberCount >= c.maxMembers;

    return (
        <Card>
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-black text-ink-900">{c.name}</h3>
                        <p className="text-xs text-muted-500">
                            {memberCount} / {c.maxMembers} members · {c.monthDuration} months
                        </p>
                    </div>
                    <StatusPill
                        tone={
                            c.status === "ongoing"
                                ? "success"
                                : c.status === "finished"
                                  ? "neutral"
                                  : isFull
                                    ? "info"
                                    : "warning"
                        }
                    >
                        {c.status}
                    </StatusPill>
                </div>

                <CycleProgress
                    current={c.currentMonth}
                    total={c.monthDuration}
                    paidCount={c.status === "open" ? null : paidCount}
                    memberCount={c.status === "open" ? null : memberCount}
                    status={c.status === "open" ? "open" : c.status === "finished" ? "finished" : "ongoing"}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border-100 bg-surface-100/60 p-3">
                        <p className="eyebrow mb-0.5">Monthly</p>
                        <Money amount={c.monthlyAmount} size="md" tone="primary" />
                    </div>
                    <div className="rounded-2xl border border-border-100 bg-surface-100/60 p-3">
                        <p className="eyebrow mb-0.5">Total pool</p>
                        <Money amount={c.totalAmount} size="md" tone="accent" />
                    </div>
                </div>

                {(c.pendingMembers?.length || 0) > 0 ? (
                    <div className="rounded-2xl border border-warning-500/25 bg-warning-500/5 p-3 text-xs font-semibold text-warning-700">
                        {c.pendingMembers.length} join request{c.pendingMembers.length === 1 ? "" : "s"} pending
                    </div>
                ) : null}

                <div className="grid grid-cols-2 gap-2">
                    <Link href={`/admin/manage?id=${c._id}`}>
                        <Button variant="primary" size="sm" className="w-full">
                            Manage
                        </Button>
                    </Link>
                    <Link href={`/admin/edit?id=${c._id}`}>
                        <Button variant="secondary" size="sm" className="w-full">
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
