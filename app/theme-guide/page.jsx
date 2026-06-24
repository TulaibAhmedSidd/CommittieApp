"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    FiUsers,
    FiTrendingUp,
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiZap,
    FiLayers,
    FiSun,
    FiMoon,
    FiHome,
    FiInbox,
    FiSave,
    FiRotateCcw,
} from "react-icons/fi";

import Button from "../Components/Theme/Button";
import Card from "../Components/Theme/Card";
import StatusPill from "../Components/Theme/StatusPill";
import Input from "../Components/Theme/Input";
import Modal from "../Components/Theme/Modal";
import EmptyState from "../Components/Theme/EmptyState";
import SectionHeader from "../Components/Theme/SectionHeader";
import StepProgress from "../Components/Theme/StepProgress";
import Table, { TableRow, TableCell } from "../Components/Theme/Table";
import BlueTick from "../Components/Theme/BlueTick";
import Money from "../Components/Theme/Money";
import BilingualLabel from "../Components/Theme/BilingualLabel";
import Stat from "../Components/Theme/Stat";
import CycleProgress from "../Components/Theme/CycleProgress";

const THEMES = [
    { id: "default", label: "Emerald (default)", apiKey: "midnight" },
    { id: "theme-forest", label: "Forest", apiKey: "forest" },
    { id: "theme-solar", label: "Solar / mehndi gold", apiKey: "solar" },
    { id: "theme-royal", label: "Royal / Mughal purple", apiKey: "royal" },
    { id: "theme-crimson", label: "Crimson / wedding red", apiKey: "crimson" },
    { id: "theme-ocean", label: "Ocean", apiKey: "ocean" },
    { id: "theme-sunset", label: "Sunset", apiKey: "sunset" },
    { id: "theme-rose", label: "Rose", apiKey: "rose" },
    { id: "theme-onyx", label: "Onyx", apiKey: "onyx" },
    { id: "theme-steel", label: "Steel", apiKey: "steel" },
    { id: "theme-cyber", label: "Cyber", apiKey: "cyber" },
];

/** Clean theme classes off BOTH <html> and <body>. ThemeContext writes to
 *  both, so a local switcher must clean both or stale CSS variables stay
 *  on whichever one wasn't touched. */
function setActiveThemeClass(themeId) {
    const targets = [document.documentElement, document.body];
    targets.forEach((el) => {
        Array.from(el.classList)
            .filter((c) => c.startsWith("theme-"))
            .forEach((c) => el.classList.remove(c));
        if (themeId && themeId !== "default") el.classList.add(themeId);
    });
}

const PALETTE_GROUPS = [
    { key: "primary", label: "Primary (emerald)" },
    { key: "accent", label: "Accent (gold)" },
    { key: "surface", label: "Surface (cream)" },
    { key: "ink", label: "Ink (text)" },
    { key: "border", label: "Border (rule)", shades: [50, 100, 200, 300, 400, 500] },
    { key: "success", label: "Success", shades: [50, 100, 500, 600, 700] },
    { key: "warning", label: "Warning", shades: [50, 100, 500, 600, 700] },
    { key: "danger", label: "Danger", shades: [50, 100, 500, 600, 700] },
    { key: "info", label: "Info", shades: [50, 100, 500, 600, 700] },
];

const DEFAULT_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export default function ThemeGuidePage() {
    const [activeTheme, setActiveTheme] = useState("default");
    const [isDark, setIsDark] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setActiveThemeClass(activeTheme);
    }, [activeTheme]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    const persistTheme = async () => {
        const meta = THEMES.find((t) => t.id === activeTheme);
        if (!meta) return;
        try {
            await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activeTheme: meta.apiKey }),
            });
            toast.success(`Saved "${meta.label}" as platform default`);
        } catch (err) {
            toast.error("Could not save theme — check console");
            console.error(err);
        }
    };

    const resetToDefault = async () => {
        setActiveTheme("default");
        try {
            await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activeTheme: "midnight" }),
            });
            toast.success("Reset to emerald default");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen px-4 pb-24 pt-10 md:px-8">
            <div className="mx-auto max-w-6xl space-y-12">
                {/* Header + theme switcher */}
                <header className="space-y-6">
                    <SectionHeader
                        eyebrow="Design system preview"
                        title="CommittieApp · Trust-bank emerald + gold"
                        description="Every primitive in one place. Flip themes and toggle dark mode to confirm tokens propagate everywhere — nothing here uses raw Tailwind palette colors."
                        icon={FiLayers}
                    />

                    <Card className="p-0">
                        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <p className="eyebrow">Live theme</p>
                                <p className="text-sm font-semibold text-ink-700 dark:text-ink-500">
                                    Pick a palette below. Every primitive on this page re-paints because
                                    Tailwind reads from CSS variables. Use <strong>Save as platform default</strong>{" "}
                                    to persist via <code>/api/settings</code> so all pages pick it up.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={persistTheme}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-glow hover:bg-primary-700"
                                >
                                    <FiSave /> Save default
                                </button>
                                <button
                                    onClick={resetToDefault}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-border-100 bg-surface-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-ink-700 hover:border-primary-500 hover:text-primary-600 dark:border-border-200 dark:bg-surface-100 dark:text-ink-500"
                                >
                                    <FiRotateCcw /> Reset
                                </button>
                                <button
                                    onClick={() => setIsDark((d) => !d)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-border-100 bg-surface-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-ink-700 hover:border-primary-500 hover:text-primary-600 dark:border-border-200 dark:bg-surface-100 dark:text-ink-500"
                                >
                                    {isDark ? <FiSun /> : <FiMoon />}
                                    {isDark ? "Light mode" : "Dark mode"}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 border-t border-border-100 bg-surface-100/60 p-6 dark:border-border-200 dark:bg-surface-200/30">
                            {THEMES.map((t) => {
                                const active = t.id === activeTheme;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveTheme(t.id)}
                                        className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all ${
                                            active
                                                ? "border-primary-500 bg-primary-500 text-white shadow-glow"
                                                : "border-border-100 bg-surface-50 text-ink-700 hover:border-primary-500/50 dark:border-border-200 dark:bg-surface-100 dark:text-ink-500"
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </header>

                {/* Palette swatches */}
                <section className="space-y-5">
                    <SectionHeader
                        eyebrow="Tokens"
                        title="Color ramps"
                        description="Each shade is a CSS variable — `bg-primary-500/10` opacity utilities work everywhere."
                    />
                    <div className="space-y-6">
                        {PALETTE_GROUPS.map((group) => {
                            const shades = group.shades || DEFAULT_SHADES;
                            return (
                                <div key={group.key} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-500">
                                            {group.label}
                                        </p>
                                        <code className="text-[10px] text-muted-500">
                                            --{group.key}-{shades[0]} … --{group.key}-{shades[shades.length - 1]}
                                        </code>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
                                        {shades.map((s) => (
                                            <div
                                                key={s}
                                                className="flex h-16 flex-col items-center justify-end rounded-2xl border border-border-100 p-2 text-[10px] font-bold dark:border-border-200"
                                                style={{ backgroundColor: `rgb(var(--${group.key}-${s}))` }}
                                            >
                                                <span
                                                    className={`rounded-md px-1.5 ${s >= 500 ? "bg-white/70 text-ink-900" : "bg-ink-900/70 text-white"}`}
                                                >
                                                    {s}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Typography */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Typography" title="Type scale & bilingual" />
                    <Card>
                        <div className="space-y-6">
                            <div>
                                <p className="eyebrow">Eyebrow / kicker</p>
                                <h1 className="text-5xl font-black tracking-tighter text-ink-900 dark:text-ink-700">
                                    Apni committee, apne haath mein
                                </h1>
                                <p className="mt-2 text-base font-medium text-muted-500">
                                    Lead headline — emerald-on-cream, tight tracking, ready for a real
                                    "made-for-Pakistan" hero.
                                </p>
                            </div>

                            <div className="desi-divider" />

                            <div className="space-y-3">
                                <p className="text-xs font-black uppercase tracking-[0.28em] text-muted-500">
                                    Bilingual labels
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <BilingualLabel en="Pay Now" ur="ابھی ادا کریں" />
                                    <BilingualLabel en="Verified" ur="تصدیق شدہ" />
                                    <BilingualLabel en="Pending Approval" ur="منظوری زیر التواء" />
                                </div>
                                <div className="flex flex-wrap gap-8">
                                    <BilingualLabel en="Join Committee" ur="کمیٹی میں شامل ہوں" layout="stack" />
                                    <BilingualLabel en="Monthly Installment" ur="ماہانہ قسط" layout="stack" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Money */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Currency" title="Money primitive" />
                    <Card>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <Money amount={50000} size="xl" suffix="/ month" tone="primary" />
                                <Money amount={600000} size="lg" suffix="total pool" tone="accent" />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-border-100 bg-surface-100/60 p-4 dark:border-border-200 dark:bg-surface-200/30">
                                    <p className="eyebrow mb-2">Western grouping (default)</p>
                                    <Money amount={1500000} size="lg" />
                                </div>
                                <div className="rounded-2xl border border-border-100 bg-surface-100/60 p-4 dark:border-border-200 dark:bg-surface-200/30">
                                    <p className="eyebrow mb-2">Lakh-style grouping</p>
                                    <Money amount={1500000} size="lg" grouping="lakh" />
                                </div>
                            </div>
                            <div className="rounded-2xl border border-accent-500/30 bg-accent-500/10 p-4">
                                <p className="eyebrow mb-2">With Urdu words (trust surfaces)</p>
                                <Money amount={250000} size="lg" tone="primary" showUrduWords />
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Stat tiles */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Dashboard" title="Stat tiles" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Stat
                            label="Total Pool"
                            urduLabel="کل رقم"
                            value={<Money amount={1200000} size="lg" tone="primary" />}
                            hint="Across 4 active committees"
                            icon={FiTrendingUp}
                            tone="primary"
                            delta={{ value: 12, label: "vs last month" }}
                        />
                        <Stat
                            label="Active Members"
                            urduLabel="فعال اراکین"
                            value="248"
                            hint="42 pending verification"
                            icon={FiUsers}
                            tone="accent"
                        />
                        <Stat
                            label="Paid This Cycle"
                            urduLabel="اس مہینے ادا"
                            value="186 / 220"
                            hint="34 reminders sent"
                            icon={FiCheckCircle}
                            tone="success"
                            delta={{ value: 4 }}
                        />
                        <Stat
                            label="Overdue"
                            urduLabel="بقایا"
                            value={<Money amount={85000} size="md" tone="danger" />}
                            hint="12 members past due"
                            icon={FiAlertCircle}
                            tone="danger"
                            delta={{ value: -8 }}
                        />
                    </div>
                </section>

                {/* CycleProgress */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Committee" title="Monthly cycle progress" />
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CycleProgress current={3} total={12} paidCount={18} memberCount={20} status="ongoing" />
                        </Card>
                        <Card>
                            <CycleProgress current={1} total={10} status="open" />
                        </Card>
                        <Card>
                            <CycleProgress current={6} total={12} paidCount={8} memberCount={15} status="paused" />
                        </Card>
                        <Card>
                            <CycleProgress current={12} total={12} status="finished" />
                        </Card>
                    </div>
                </section>

                {/* Buttons */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Actions" title="Button variants" />
                    <Card>
                        <div className="space-y-5">
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary">Primary</Button>
                                <Button variant="accent">Accent</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="danger">Danger</Button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary" size="sm">
                                    Small
                                </Button>
                                <Button variant="primary" size="md">
                                    Medium
                                </Button>
                                <Button variant="primary" size="lg">
                                    Large
                                </Button>
                                <Button variant="primary" loading>
                                    Submitting…
                                </Button>
                                <Button variant="primary" disabled>
                                    Disabled
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary">
                                    <BilingualLabel en="Pay Now" ur="ابھی ادا کریں" />
                                </Button>
                                <Button variant="accent">
                                    <BilingualLabel en="Join Committee" ur="شامل ہوں" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Status pills */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Status" title="Status pills" />
                    <Card>
                        <div className="flex flex-wrap gap-3">
                            <StatusPill tone="success">Verified · تصدیق شدہ</StatusPill>
                            <StatusPill tone="warning">Pending Review</StatusPill>
                            <StatusPill tone="danger">Payment Overdue</StatusPill>
                            <StatusPill tone="info">Cycle Open</StatusPill>
                            <StatusPill tone="accent">Premium Organizer</StatusPill>
                            <StatusPill tone="neutral">Inactive</StatusPill>
                        </div>
                    </Card>
                </section>

                {/* StepProgress */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Onboarding" title="Step progress" />
                    <Card>
                        <StepProgress
                            steps={["Profile", "Verify CNIC", "Add Bank", "Done"]}
                            currentStep={2}
                        />
                    </Card>
                </section>

                {/* Inputs */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Forms" title="Inputs" />
                    <Card>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input label="Full name" placeholder="Ahmed Khan" />
                            <Input label="CNIC" placeholder="35202-XXXXXXX-X" />
                            <Input label="Phone" placeholder="+92 3XX XXXXXXX" />
                            <Input
                                label="Email"
                                placeholder="invalid"
                                error="Looks like a typo — check the email."
                            />
                        </div>
                    </Card>
                </section>

                {/* Table */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Data" title="Table" />
                    <Table headers={["Member", "City", "Status", "Due"]}>
                        <TableRow>
                            <TableCell>
                                <span className="inline-flex items-center gap-2 font-semibold">
                                    Ahmed Khan <BlueTick verified size={14} />
                                </span>
                            </TableCell>
                            <TableCell>Karachi</TableCell>
                            <TableCell>
                                <StatusPill tone="success">Paid</StatusPill>
                            </TableCell>
                            <TableCell>
                                <Money amount={0} size="sm" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Fatima Ali</TableCell>
                            <TableCell>Lahore</TableCell>
                            <TableCell>
                                <StatusPill tone="warning">Pending</StatusPill>
                            </TableCell>
                            <TableCell>
                                <Money amount={50000} size="sm" tone="danger" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Bilal Shah</TableCell>
                            <TableCell>Islamabad</TableCell>
                            <TableCell>
                                <StatusPill tone="danger">Overdue</StatusPill>
                            </TableCell>
                            <TableCell>
                                <Money amount={50000} size="sm" tone="danger" />
                            </TableCell>
                        </TableRow>
                    </Table>
                </section>

                {/* EmptyState + Modal trigger */}
                <section className="space-y-5">
                    <SectionHeader eyebrow="Feedback" title="Empty state · Modal" />
                    <div className="grid gap-4 md:grid-cols-2">
                        <EmptyState
                            icon={FiInbox}
                            title="No committees yet"
                            description="Browse open committees nearby or ask a trusted organizer for a join code."
                            action={<Button variant="primary">Explore committees</Button>}
                        />
                        <Card>
                            <div className="flex h-full flex-col items-start gap-4">
                                <p className="text-sm font-semibold text-ink-700 dark:text-ink-500">
                                    Modal uses surface + ink tokens, with ink-900/60 backdrop and a floating
                                    shadow. Test it here.
                                </p>
                                <Button onClick={() => setModalOpen(true)}>Open modal</Button>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <footer className="pt-8 text-center text-xs text-muted-500">
                    <div className="desi-divider mb-4" />
                    <p>
                        CommittieApp design system · emerald{" "}
                        <span className="rounded bg-primary-500/10 px-1.5 py-0.5 text-primary-700">#047857</span>{" "}
                        · gold{" "}
                        <span className="rounded bg-accent-500/15 px-1.5 py-0.5 text-accent-700">#C9A227</span>{" "}
                        · cream{" "}
                        <span className="rounded bg-surface-200 px-1.5 py-0.5 text-ink-700">#FBF7EE</span>
                    </p>
                </footer>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Payment">
                <div className="space-y-4 text-ink-700 dark:text-ink-500">
                    <p>
                        Submitting evidence for{" "}
                        <Money amount={50000} size="md" tone="primary" suffix="for March 2026" />
                    </p>
                    <p className="text-sm text-muted-500">
                        Organizer will verify within 24 hours. You'll get a notification once approved.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => setModalOpen(false)}>
                            <BilingualLabel en="Submit Evidence" ur="جمع کریں" />
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
