"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiMenu,
  FiX,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiSmartphone,
  FiCamera,
  FiClock,
  FiHeart,
  FiMapPin,
  FiZap,
  FiChevronDown,
  FiCreditCard,
} from "react-icons/fi";

import Button from "./Components/Theme/Button";
import Card from "./Components/Theme/Card";
import StatusPill from "./Components/Theme/StatusPill";
import Stat from "./Components/Theme/Stat";
import Money from "./Components/Theme/Money";
import BilingualLabel from "./Components/Theme/BilingualLabel";
import CycleProgress from "./Components/Theme/CycleProgress";
import BlueTick from "./Components/Theme/BlueTick";

const SAMPLE_MEMBERS = [
  { name: "Aliya Khan", city: "Karachi", paid: true, verified: true },
  { name: "Hassan Raza", city: "Lahore", paid: true, verified: true },
  { name: "Fatima Bilal", city: "Islamabad", paid: true, verified: false },
  { name: "Bilal Ahmed", city: "Rawalpindi", paid: false, verified: true },
];

const TRUST_PILLARS = [
  {
    icon: FiShield,
    en: "CNIC verified",
    ur: "شناختی کارڈ تصدیق شدہ",
    body: "Members and organizers both upload CNIC + selfie. No anonymous accounts.",
  },
  {
    icon: FiCamera,
    en: "Proof-first payments",
    ur: "ادائیگی کا ثبوت",
    body: "Every monthly contribution needs a JazzCash / EasyPaisa / bank screenshot. Organizer verifies before the month advances.",
  },
  {
    icon: FiUsers,
    en: "Organizer reputation",
    ur: "منتظم کی ساکھ",
    body: "Verified organizers carry a Blue Tick and a public review history — so you know who you're trusting with your committee.",
  },
];

const HOW_STEPS = [
  {
    n: "01",
    en: "Find a committee near you",
    ur: "اپنے قریب کمیٹی ڈھونڈیں",
    body: "Browse verified committees in Karachi, Lahore, Islamabad and beyond.",
  },
  {
    n: "02",
    en: "Send a join request",
    ur: "شامل ہونے کی درخواست بھیجیں",
    body: "Organizer sees your CNIC verification and approves you for the pool.",
  },
  {
    n: "03",
    en: "Pay monthly with proof",
    ur: "ماہانہ ادائیگی ثبوت کے ساتھ",
    body: "Upload your receipt — organizer verifies, the month moves forward.",
  },
  {
    n: "04",
    en: "Receive your payout",
    ur: "اپنی رقم وصول کریں",
    body: "When your month comes, get the full pool — every rupee accounted for.",
  },
];

const SAMPLE_COMMITTEES = [
  {
    name: "Gulshan Mothers' Circle",
    city: "Karachi",
    monthly: 10000,
    total: 120000,
    current: 4,
    months: 12,
    paid: 11,
    members: 12,
    tone: "ongoing" as const,
  },
  {
    name: "DHA Lahore Saver Pool",
    city: "Lahore",
    monthly: 25000,
    total: 300000,
    current: 1,
    months: 12,
    paid: 8,
    members: 12,
    tone: "ongoing" as const,
  },
  {
    name: "F-7 Islamabad Trust",
    city: "Islamabad",
    monthly: 50000,
    total: 500000,
    current: 0,
    months: 10,
    paid: 0,
    members: 10,
    tone: "open" as const,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Pehle har mahine WhatsApp pe ledger likhna parta tha. Ab sab kuch app pe — kis ne diya, kis ka turn hai, sab clear.",
    name: "Aliya Khan",
    role: "Member · Karachi",
  },
  {
    quote:
      "Three committees chala raha hoon. Verification aur proof upload se members ka bharosa double ho gaya.",
    name: "Hassan Raza",
    role: "Organizer · Lahore",
  },
  {
    quote:
      "Payment screenshot upload kiya, 6 ghante mein verified ho gaya. Receipt bhi mil gayi PDF mein.",
    name: "Fatima Bilal",
    role: "Member · Islamabad",
  },
];

const FAQS = [
  {
    q: "Is this a money-lending platform?",
    a: "No — CommittieApp is a digital ledger for traditional rotating savings (BC / committee). The money moves between members directly; we never hold funds.",
  },
  {
    q: "How are organizers verified?",
    a: "Every organizer uploads CNIC front/back, a selfie, and proof of address. Super-admin approves before they can create a committee. Verified organizers get a Blue Tick.",
  },
  {
    q: "What if a member doesn't pay one month?",
    a: "Organizer can't advance the cycle until 100% of non-beneficiary members pay. Reminders go out automatically. Disputes are logged in the audit trail.",
  },
  {
    q: "Does it work for committees that already started offline?",
    a: "Yes. An organizer can create the committee at its current month and import the past payment history before going live on the app.",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // close mobile menu when route hash changes (anchor links)
  useEffect(() => {
    const onHash = () => setMobileMenuOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <main className="min-h-screen text-ink-900">
      {/* ───────────── Nav ───────────── */}
      <header className="sticky top-0 z-50 border-b border-border-100 bg-surface-50/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-glow">
              <span className="font-black tracking-tighter">BC</span>
            </div>
            <div className="leading-none">
              <p className="text-lg font-black tracking-tighter text-ink-900">
                Committie<span className="text-primary-600">App</span>
              </p>
              <p className="font-urdu text-[11px] text-muted-500" dir="rtl">
                بھروسے کی بی سی
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how" className="text-xs font-black uppercase tracking-[0.18em] text-ink-700 hover:text-primary-600">
              How it works
            </a>
            <a href="#trust" className="text-xs font-black uppercase tracking-[0.18em] text-ink-700 hover:text-primary-600">
              Trust
            </a>
            <a href="#committees" className="text-xs font-black uppercase tracking-[0.18em] text-ink-700 hover:text-primary-600">
              Live pools
            </a>
            <a href="#faq" className="text-xs font-black uppercase tracking-[0.18em] text-ink-700 hover:text-primary-600">
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/admin/login"
              className="text-xs font-black uppercase tracking-[0.18em] text-muted-500 hover:text-primary-600"
            >
              Organizer
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get started
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-xl border border-border-100 bg-surface-50 p-2 text-ink-700 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border-100 bg-surface-50 md:hidden">
            <div className="flex flex-col gap-3 px-4 py-4">
              <a href="#how" className="text-sm font-black uppercase text-ink-700">
                How it works
              </a>
              <a href="#trust" className="text-sm font-black uppercase text-ink-700">
                Trust
              </a>
              <a href="#committees" className="text-sm font-black uppercase text-ink-700">
                Live pools
              </a>
              <a href="#faq" className="text-sm font-black uppercase text-ink-700">
                FAQ
              </a>
              <div className="desi-divider" />
              <Link href="/admin/login" className="text-sm font-black uppercase text-muted-500">
                Organizer login
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="w-full">
                  Member login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="w-full">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden">
        {/* decorative jaali corners */}
        <div className="jaali-border pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-60" />
        <div className="jaali-border pointer-events-none absolute -bottom-12 left-0 h-56 w-56 opacity-40" />

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.2fr_1fr] md:px-8 md:py-24">
          {/* Left — copy */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accent-700">
                BC / بی سی
              </span>
              <span className="font-urdu text-[11px] text-accent-700" dir="rtl">
                بھروسے سے چلنے والی
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black leading-[1.05] tracking-tighter text-ink-900 md:text-6xl">
                Ghar ka committee
                <br />
                <span className="text-primary-700">phone par.</span>
              </h1>
              <p className="font-urdu text-2xl leading-relaxed text-muted-500 md:text-3xl" dir="rtl">
                آپ کی بی سی — اب آپ کے فون پر۔
              </p>
            </div>

            <p className="max-w-xl text-base font-medium leading-7 text-muted-600 md:text-lg">
              Track every committee — kis ne diya, kis ka turn hai, kitna baqi hai. Verified members,
              proof-based payments, and a clean monthly ledger. No more WhatsApp screenshots that
              get lost.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button variant="primary" size="lg">
                  <BilingualLabel en="Start saving" ur="بچت شروع کریں" /> <FiArrowRight />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="accent" size="lg">
                  <BilingualLabel en="Become an organizer" ur="منتظم بنیں" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-muted-500">
              <span className="inline-flex items-center gap-2">
                <FiShield className="text-primary-600" /> CNIC verification
              </span>
              <span className="inline-flex items-center gap-2">
                <FiCreditCard className="text-primary-600" /> JazzCash · EasyPaisa · Bank
              </span>
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="text-primary-600" /> Pakistan-wide
              </span>
            </div>
          </div>

          {/* Right — committee snapshot card */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-transparent blur-xl" />
            <Card className="relative">
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="eyebrow">Live committee</p>
                    <h3 className="mt-1 text-xl font-black text-ink-900">Gulshan Mothers' Circle</h3>
                    <p className="text-xs text-muted-500">Karachi · 12 members · Monthly</p>
                  </div>
                  <StatusPill tone="success">Verified</StatusPill>
                </div>

                <div className="rounded-2xl border border-border-100 bg-surface-100/60 p-4">
                  <p className="eyebrow mb-1">Monthly installment</p>
                  <Money amount={10000} size="lg" suffix="per member" tone="primary" />
                </div>

                <CycleProgress
                  current={4}
                  total={12}
                  paidCount={11}
                  memberCount={12}
                  status="ongoing"
                />

                <div className="space-y-2">
                  <p className="eyebrow">This month's status</p>
                  <ul className="divide-y divide-border-100">
                    {SAMPLE_MEMBERS.map((m, i) => (
                      <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="inline-flex items-center gap-2 font-semibold text-ink-700">
                          {m.name}
                          {m.verified ? <BlueTick verified size={14} /> : null}
                          <span className="text-xs font-medium text-muted-500">· {m.city}</span>
                        </span>
                        <StatusPill tone={m.paid ? "success" : "warning"}>
                          {m.paid ? "Paid" : "Pending"}
                        </StatusPill>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-accent-500/30 bg-accent-500/5 p-4">
                  <p className="eyebrow mb-1">Next payout</p>
                  <p className="text-sm font-semibold text-ink-900">
                    Aliya Khan · Month 4 · <Money amount={120000} size="sm" tone="accent" />
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ───────────── Trust strip ───────────── */}
      <section className="border-y border-border-100 bg-surface-100/60">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-4 md:px-8">
          <Stat
            label="Active members"
            urduLabel="فعال اراکین"
            value="1,200+"
            hint="Across 14 cities"
            icon={FiUsers}
            tone="primary"
          />
          <Stat
            label="Verified organizers"
            urduLabel="تصدیق شدہ منتظمین"
            value="85"
            hint="CNIC + address verified"
            icon={FiAward}
            tone="accent"
          />
          <Stat
            label="Total pooled"
            urduLabel="کل جمع رقم"
            value={<Money amount={50000000} size="md" tone="primary" />}
            hint="Across all live committees"
            icon={FiTrendingUp}
            tone="success"
          />
          <Stat
            label="Payout success"
            urduLabel="کامیاب ادائیگیاں"
            value="100%"
            hint="Every cycle, every member"
            icon={FiCheckCircle}
            tone="success"
          />
        </div>
      </section>

      {/* ───────────── Why trust us ───────────── */}
      <section id="trust" className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="eyebrow">Bharosa · ٹرسٹ</p>
          <h2 className="text-3xl font-black tracking-tighter text-ink-900 md:text-5xl">
            Aap kyun bharosa karein?
            <span className="block text-primary-700">Why members trust us.</span>
          </h2>
          <p className="text-base font-medium text-muted-600">
            Traditional BC works on word-of-mouth. We layer verification, proof, and audit on top —
            so the same trusted social system runs without the WhatsApp anxiety.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TRUST_PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Card key={i} className="group">
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600 transition group-hover:bg-primary-500 group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-ink-900">{p.en}</h3>
                    <p className="font-urdu text-sm text-muted-500" dir="rtl">
                      {p.ur}
                    </p>
                  </div>
                  <p className="text-sm font-medium leading-6 text-muted-600">{p.body}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section id="how" className="border-y border-border-100 bg-surface-100/60">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="eyebrow">Tareeqa · طریقہ</p>
              <h2 className="text-3xl font-black tracking-tighter text-ink-900 md:text-5xl">
                Aik committee kese chalti hai?
                <span className="block text-primary-700">A cycle, end to end.</span>
              </h2>
            </div>
            <div className="rounded-2xl border border-accent-500/30 bg-accent-500/10 px-4 py-2.5 text-xs font-bold text-accent-700">
              Average join → first payout: <span className="font-black">4 to 6 days</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {HOW_STEPS.map((step, i) => (
              <div
                key={i}
                className="relative rounded-[1.5rem] border border-border-100 bg-surface-50 p-5 transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-3xl font-black tracking-tighter text-primary-700">{step.n}</span>
                  {i < HOW_STEPS.length - 1 && (
                    <FiArrowRight className="hidden text-muted-500 md:block" />
                  )}
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-ink-900">
                  {step.en}
                </h3>
                <p className="font-urdu text-xs text-muted-500 mt-0.5" dir="rtl">
                  {step.ur}
                </p>
                <p className="mt-3 text-xs font-medium leading-5 text-muted-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Live committees ───────────── */}
      <section id="committees" className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow">Open pools · کھلے پول</p>
            <h2 className="text-3xl font-black tracking-tighter text-ink-900 md:text-5xl">
              Committees joining ke liye open hain.
            </h2>
            <p className="text-base font-medium text-muted-600">
              Real examples. Pick a city, pick a monthly amount, send a join request.
            </p>
          </div>
          <Link href="/userDash/explore">
            <Button variant="outline">
              Explore all committees <FiArrowRight />
            </Button>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {SAMPLE_COMMITTEES.map((c, i) => (
            <Card key={i} className="flex h-full flex-col gap-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-ink-900">{c.name}</h3>
                  <p className="text-xs font-medium text-muted-500">
                    <FiMapPin className="-mt-0.5 mr-1 inline" />
                    {c.city}
                  </p>
                </div>
                <StatusPill tone={c.tone === "open" ? "info" : "success"}>
                  {c.tone === "open" ? "Open" : "Ongoing"}
                </StatusPill>
              </div>

              <div className="rounded-2xl border border-border-100 bg-surface-100/60 p-4">
                <p className="eyebrow mb-1">Monthly</p>
                <Money amount={c.monthly} size="lg" tone="primary" suffix="per member" />
                <p className="mt-2 text-xs font-medium text-muted-500">
                  Total pool · <Money amount={c.total} size="sm" tone="accent" />
                </p>
              </div>

              <CycleProgress
                current={c.current}
                total={c.months}
                paidCount={c.tone === "open" ? null : c.paid}
                memberCount={c.tone === "open" ? null : c.members}
                status={c.tone}
              />

              <div className="mt-auto">
                <Link href="/register">
                  <Button variant="primary" className="w-full">
                    <BilingualLabel en="Request to join" ur="شامل ہوں" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ───────────── Voices ───────────── */}
      <section className="border-y border-border-100 bg-surface-100/60">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <div className="mb-10 max-w-2xl space-y-3">
            <p className="eyebrow">Voices · آوازیں</p>
            <h2 className="text-3xl font-black tracking-tighter text-ink-900 md:text-5xl">
              Members ki zubani.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="relative overflow-visible">
                <span
                  aria-hidden
                  className="absolute -top-4 left-6 font-serif text-7xl leading-none text-accent-500/40"
                >
                  &ldquo;
                </span>
                <div className="space-y-4 pt-3">
                  <p className="text-base font-medium leading-7 text-ink-700">{t.quote}</p>
                  <div className="flex items-center gap-3 border-t border-border-100 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-black text-white">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-ink-900">{t.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-500">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Organizer CTA ───────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary-500/20 bg-gradient-to-br from-primary-50 via-surface-100 to-accent-500/10 p-8 md:p-14">
          <div className="jaali-border pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-30" />

          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              <p className="eyebrow">Organizer plan · منتظم</p>
              <h2 className="text-3xl font-black tracking-tighter text-ink-900 md:text-4xl">
                Apni committee chalayein —
                <br />
                <span className="text-primary-700">platform aap ka sahara hai.</span>
              </h2>
              <p className="max-w-lg text-base font-medium text-muted-600">
                Member onboarding, payment verification, monthly cycle, payout receipt — sab ek
                jagah. Optional organizer fee bhi set kar sakte hain, transparent rakhi jaayegi.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/register">
                  <Button variant="primary" size="lg">
                    Become an organizer <FiArrowRight />
                  </Button>
                </Link>
                <Link href="/admin/login" className="text-xs font-black uppercase tracking-[0.18em] text-primary-700 hover:text-primary-800">
                  Already organizing? Login →
                </Link>
              </div>
            </div>

            <Card className="bg-surface-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Free forever</p>
                  <StatusPill tone="accent">Most popular</StatusPill>
                </div>
                <Money amount={0} size="xl" tone="primary" suffix="organizer fee" />
                <ul className="space-y-2.5 text-sm font-medium text-ink-700">
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-success-600" /> Up to 3 active committees
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-success-600" /> CNIC + selfie verification
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-success-600" /> Payment proof workflow
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-success-600" /> Member messaging
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-success-600" /> Audit trail + receipts
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section id="faq" className="border-t border-border-100 bg-surface-100/60">
        <div className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
          <div className="mb-10 space-y-3 text-center">
            <p className="eyebrow">FAQ · سوالات</p>
            <h2 className="text-3xl font-black tracking-tighter text-ink-900 md:text-5xl">
              Questions, jawab.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => setOpenFaq(open ? null : i)}
                  className={`block w-full rounded-2xl border bg-surface-50 px-5 py-4 text-left transition ${
                    open ? "border-primary-500/40 shadow-card" : "border-border-100 hover:border-primary-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-black text-ink-900">{faq.q}</h4>
                    <FiChevronDown
                      className={`text-muted-500 transition-transform ${open ? "rotate-180 text-primary-600" : ""}`}
                    />
                  </div>
                  {open ? (
                    <p className="mt-3 text-sm font-medium leading-6 text-muted-600">{faq.a}</p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <div className="rounded-[2.5rem] border border-border-100 bg-surface-50 p-10 text-center md:p-16">
          <FiHeart className="mx-auto mb-4 text-accent-500" size={28} />
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tighter text-ink-900 md:text-5xl">
            Apni committee, apne haath mein.
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-urdu text-lg text-muted-500" dir="rtl">
            آپ کی بی سی، آپ کے کنٹرول میں۔
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Get started — free <FiArrowRight />
              </Button>
            </Link>
            <Link href="/userDash/explore">
              <Button variant="outline" size="lg">
                Browse committees
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── Footer ───────────── */}
      <footer className="border-t border-border-100 bg-surface-100/60">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <div className="desi-divider mb-8" />
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-white">
                <span className="text-xs font-black">BC</span>
              </div>
              <span className="text-base font-black tracking-tighter text-ink-900">
                Committie<span className="text-primary-600">App</span>
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-6 text-xs font-black uppercase tracking-[0.18em] text-muted-500">
              <Link href="/privacy" className="hover:text-primary-600">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary-600">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-primary-600">
                Contact
              </Link>
              <Link href="/theme-guide" className="hover:text-primary-600">
                Design system
              </Link>
            </div>

            <p className="text-xs text-muted-500">
              Made in Pakistan · <span className="font-urdu" dir="rtl">پاکستان میں بنا</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
