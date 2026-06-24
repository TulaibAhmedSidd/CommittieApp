"use client";

import Link from "next/link";
import {
    FiCheckCircle,
    FiUser,
    FiShield,
    FiSearch,
    FiUserPlus,
    FiUpload,
    FiAward,
    FiMessageCircle,
    FiSettings,
    FiArrowRight,
    FiAlertTriangle,
    FiInfo,
    FiClock,
} from "react-icons/fi";

import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import StatusPill from "../../Components/Theme/StatusPill";
import Money from "../../Components/Theme/Money";
import BilingualLabel from "../../Components/Theme/BilingualLabel";
import StepProgress from "../../Components/Theme/StepProgress";

const SECTIONS = [
    { id: "register", label: "Registration", urdu: "رجسٹریشن" },
    { id: "verify", label: "Verification", urdu: "تصدیق" },
    { id: "explore", label: "Explore", urdu: "تلاش" },
    { id: "join", label: "Joining a committee", urdu: "شامل ہونا" },
    { id: "pay", label: "Monthly payments", urdu: "ماہانہ ادائیگی" },
    { id: "payout", label: "Receiving payout", urdu: "رقم وصول کرنا" },
    { id: "chat", label: "Messaging organizer", urdu: "گفتگو" },
    { id: "profile", label: "Profile & settings", urdu: "پروفائل" },
];

export default function MemberGuide() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <header className="border-b border-border-100 bg-surface-100/60">
                <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
                    <div className="max-w-3xl space-y-4">
                        <Link
                            href="/"
                            className="text-xs font-black uppercase tracking-[0.18em] text-primary-700 hover:text-primary-800"
                        >
                            ← Home
                        </Link>
                        <p className="eyebrow">Guide · رہنما</p>
                        <h1 className="text-4xl font-black tracking-tighter text-ink-900 md:text-6xl">
                            Member guide.
                            <br />
                            <span className="text-primary-700">Aap kya kya kar sakte hain?</span>
                        </h1>
                        <p className="font-urdu text-xl text-muted-500" dir="rtl">
                            ہر آپشن کی مکمل وضاحت۔
                        </p>
                        <p className="text-base font-medium text-muted-600 max-w-2xl">
                            Sign-up se le kar payout milne tak — har step, har screen, har button ka
                            kaam. Beginner-friendly bilingual walkthrough.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="/register">
                                <Button variant="primary" size="lg">
                                    Start sign-up <FiArrowRight />
                                </Button>
                            </Link>
                            <Link href="/guide/organizer">
                                <Button variant="secondary" size="lg">
                                    I'm an organizer
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[220px_1fr] md:gap-16 md:px-8 md:py-16">
                {/* Sidebar TOC */}
                <aside className="md:sticky md:top-24 md:self-start">
                    <p className="eyebrow mb-3">On this page</p>
                    <nav className="space-y-1 text-sm">
                        {SECTIONS.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="block rounded-xl border border-transparent px-3 py-2 font-semibold text-muted-600 transition hover:border-border-100 hover:bg-surface-100/60 hover:text-ink-900"
                            >
                                {s.label}
                                <span className="ml-2 font-urdu text-[11px] text-muted-500" dir="rtl">
                                    {s.urdu}
                                </span>
                            </a>
                        ))}
                    </nav>
                </aside>

                <article className="space-y-16">
                    {/* ───────── 1 — Registration ───────── */}
                    <Section
                        id="register"
                        n="01"
                        en="Registration"
                        ur="رجسٹریشن"
                        lead="Apne pehle 60 seconds mein account banayein."
                    >
                        <p>
                            <Link href="/register" className="text-primary-700 underline">
                                /register
                            </Link>{" "}
                            kholain. <strong>Member</strong> ya <strong>Organizer</strong> mein se{" "}
                            <strong>Member</strong> chuneien — aap ka account turant active ho jata hai
                            (organizer ke barakhilaaf, jise super admin ki manzoori chahiye hoti hai).
                        </p>

                        <StepProgress
                            steps={["Identity", "Contact", "Location", "Security"]}
                            currentStep={4}
                        />

                        <FieldExplainer
                            items={[
                                {
                                    label: "Full name",
                                    urdu: "پورا نام",
                                    body: "Bilkul wohi naam likhain jo aap ke CNIC par hai — verification mein match check hota hai.",
                                },
                                {
                                    label: "Email",
                                    urdu: "ای میل",
                                    body: "Account recovery, payment receipt aur organizer notifications yahan aati hain. Active email use karain.",
                                },
                                {
                                    label: "Phone",
                                    urdu: "فون نمبر",
                                    body: "WhatsApp number better hai — organizer aap se yahin rabta karte hain. Format: 0300-1234567.",
                                },
                                {
                                    label: "City",
                                    urdu: "شہر",
                                    body: "Pakistan ke 22 main shehron ki list. Aap ke shehar ki committees aap ko sabse pehle dikhayi jati hain.",
                                },
                                {
                                    label: "Area / colony (optional)",
                                    urdu: "علاقہ",
                                    body: "Maslan 'Gulshan-e-Iqbal', 'DHA Phase 5'. Local discovery mein madad karta hai.",
                                },
                                {
                                    label: "Location capture (optional)",
                                    urdu: "مقام",
                                    body: "Browser ki ijazat se aap ka latitude/longitude record hota hai — sirf 'qareeb meri' search mein use hota hai, kisi ko bhi public nahi dikhaya jata.",
                                },
                                {
                                    label: "Password",
                                    urdu: "پاس ورڈ",
                                    body: "Minimum 6 characters. Sign-up ke baad email mein bhi reset link aata hai — pehli baar wohi use kar sakte hain.",
                                },
                            ]}
                        />

                        <Callout tone="success" icon={FiCheckCircle}>
                            <strong>Auto-approval:</strong> member sign-up ke baad turant{" "}
                            <Link href="/login" className="text-primary-700 underline">
                                Login
                            </Link>{" "}
                            kar ke dashboard kholain — koi intezaar nahi.
                        </Callout>
                    </Section>

                    {/* ───────── 2 — Verification ───────── */}
                    <Section
                        id="verify"
                        n="02"
                        en="Verification"
                        ur="تصدیق"
                        lead="Blue Tick lene ke liye 3 cheezain upload karain."
                    >
                        <p>
                            Verification optional hai, lekin <strong>verified</strong> members ko committees
                            mein priority approval milta hai, aur high-value committees (₨ 25,000+ monthly)
                            verification mandatory karti hain. Profile screen{" "}
                            <Link href="/userDash/profile" className="text-primary-700 underline">
                                /userDash/profile
                            </Link>{" "}
                            par jayein.
                        </p>

                        <div className="grid gap-3 md:grid-cols-3">
                            {[
                                {
                                    label: "CNIC front",
                                    urdu: "شناختی کارڈ سامنے",
                                    body: "Original card ki clear photo — number aur photo dono visible hone chahiyein.",
                                },
                                {
                                    label: "CNIC back",
                                    urdu: "شناختی کارڈ پیچھے",
                                    body: "Address aur expiry visible hon. Photocopy nahi, asli card.",
                                },
                                {
                                    label: "Electricity bill",
                                    urdu: "بجلی کا بل",
                                    body: "Last 3 mahine ka koi bhi K-Electric / WAPDA / SNGPL bill — address proof ke liye.",
                                },
                            ].map((it, i) => (
                                <Card key={i}>
                                    <div className="space-y-2">
                                        <FiUpload className="text-primary-600" size={22} />
                                        <p className="font-black text-ink-900">{it.label}</p>
                                        <p className="font-urdu text-xs text-muted-500" dir="rtl">
                                            {it.urdu}
                                        </p>
                                        <p className="text-xs text-muted-600">{it.body}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <p>
                            Submit karne ke baad aap ka <StatusPill tone="warning">verification pending</StatusPill>{" "}
                            ho jata hai. Super admin 24 ghante ke andar review karte hain. Approval ke baad
                            aap ke naam ke saath Blue Tick aa jata hai.
                        </p>

                        <Callout tone="warning" icon={FiAlertTriangle}>
                            <strong>Privacy:</strong> aap ke CNIC images sirf super admin dekh sakte hain.
                            Discovery ya nearby search mein kabhi expose nahi hote.
                        </Callout>
                    </Section>

                    {/* ───────── 3 — Explore ───────── */}
                    <Section
                        id="explore"
                        n="03"
                        en="Exploring committees"
                        ur="کمیٹیاں تلاش کرنا"
                        lead="Aap ke shehar mein kaun si committees abhi open hain."
                    >
                        <p>
                            Dashboard se{" "}
                            <Link href="/userDash/explore" className="text-primary-700 underline">
                                Explore
                            </Link>{" "}
                            ya{" "}
                            <Link href="/userDash/near-me" className="text-primary-700 underline">
                                Near me
                            </Link>{" "}
                            tab par jayein. Filters:
                        </p>

                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>
                                <strong>City</strong> · sirf apne shehar ki committees
                            </li>
                            <li>
                                <strong>Monthly amount</strong> · ₨ 5,000 se ₨ 50,000+ tak range
                            </li>
                            <li>
                                <strong>Status</strong> · sirf <StatusPill tone="info">open</StatusPill> ya{" "}
                                <StatusPill tone="success">ongoing</StatusPill> dikhayein
                            </li>
                            <li>
                                <strong>Organizer reputation</strong> · sirf{" "}
                                <BlueTick verified />
                                {" "}verified organizers
                            </li>
                            <li>
                                <strong>Near me</strong> · 50 km ke andar ki committees (location enabled
                                hone par)
                            </li>
                        </ul>

                        <Callout tone="info" icon={FiInfo}>
                            Har committee card par <strong>Monthly · Total pool · Cycle progress</strong>{" "}
                            dikhta hai. Click karke detail page par poori member list, payment history,
                            aur payout schedule dekh sakte hain.
                        </Callout>
                    </Section>

                    {/* ───────── 4 — Joining ───────── */}
                    <Section
                        id="join"
                        n="04"
                        en="Joining a committee"
                        ur="کمیٹی میں شامل ہونا"
                        lead="Request bhejain → organizer approve karta hai → aap shamil ho gaye."
                    >
                        <p>
                            Committee detail page par <strong>Request to join</strong> button dabayein.
                            Aap ki request organizer ke{" "}
                            <Link href="/admin" className="text-primary-700 underline">
                                Pending approvals
                            </Link>{" "}
                            mein chali jati hai.
                        </p>

                        <div className="grid gap-3 md:grid-cols-2">
                            <Card>
                                <div className="space-y-2">
                                    <p className="eyebrow">While pending</p>
                                    <StatusPill tone="warning">Pending</StatusPill>
                                    <p className="text-sm text-muted-600">
                                        Dashboard ke <strong>Pending requests</strong> section mein dikhta
                                        hai. Aap committee ka detail dekh sakte hain lekin payment abhi
                                        nahi kar sakte.
                                    </p>
                                </div>
                            </Card>
                            <Card>
                                <div className="space-y-2">
                                    <p className="eyebrow">Once approved</p>
                                    <StatusPill tone="success">Active member</StatusPill>
                                    <p className="text-sm text-muted-600">
                                        Notification milti hai. Ab aap committee ke active member hain aur
                                        monthly payment cycle shuru ho jata hai.
                                    </p>
                                </div>
                            </Card>
                        </div>

                        <Callout tone="warning" icon={FiAlertTriangle}>
                            <strong>Verification recommended:</strong> agar aap verified nahi hain to
                            organizer aap ki request rad kar sakta hai. Pehle verify karain, phir
                            request bhejain.
                        </Callout>
                    </Section>

                    {/* ───────── 5 — Paying ───────── */}
                    <Section
                        id="pay"
                        n="05"
                        en="Monthly payments"
                        ur="ماہانہ ادائیگی"
                        lead="JazzCash / EasyPaisa / bank transfer ka screenshot upload karain."
                    >
                        <p>
                            Har mahine aap ki committee card par "Pay" button activate hota hai. Click
                            karne par 3 cheezein chahiyein:
                        </p>

                        <FieldExplainer
                            items={[
                                {
                                    label: "Transaction ID",
                                    urdu: "ٹرانزیکشن آئی ڈی",
                                    body: "JazzCash/EasyPaisa SMS mein milta hai. Bank ke liye transfer reference number.",
                                },
                                {
                                    label: "Screenshot / receipt",
                                    urdu: "اسکرین شاٹ",
                                    body: "Clear image — amount, date, recipient account visible hone chahiyein. PDF bhi chal jata hai.",
                                },
                                {
                                    label: "Note (optional)",
                                    urdu: "نوٹ",
                                    body: "Agar koi context dena ho — maslan 'family member ne pay kiya hai mere behalf se'.",
                                },
                            ]}
                        />

                        <p>
                            Submit karne ke baad aap ka status{" "}
                            <StatusPill tone="warning">pending</StatusPill> ho jata hai. Organizer 24
                            ghante mein verify karte hain. Verified hone par{" "}
                            <StatusPill tone="success">verified</StatusPill> aur PDF receipt aap ke
                            email par bhi aati hai.
                        </p>

                        <Callout tone="danger" icon={FiAlertTriangle}>
                            <strong>Strict rule:</strong> organizer{" "}
                            <em>agla month tab tak nahi badha sakta</em> jab tak{" "}
                            <strong>100%</strong> non-beneficiary members ne payment verify nahi karayi.
                            Agar aap late hain to puri committee aap ka intezaar karti hai.
                        </Callout>
                    </Section>

                    {/* ───────── 6 — Payout ───────── */}
                    <Section
                        id="payout"
                        n="06"
                        en="Receiving your payout"
                        ur="رقم وصول کرنا"
                        lead="Jab aap ka mahina aata hai — puri rakam aap ke account mein."
                    >
                        <p>
                            Profile mein <strong>Payout details</strong> (account title, bank, IBAN)
                            zaroor bhar dein. Aap ka mahina aane par:
                        </p>

                        <ol className="space-y-3 text-sm text-muted-600">
                            <li>
                                <strong>1.</strong> Organizer aap ko full pool ki rakam aap ke diye gaye
                                bank/JazzCash account mein bhejte hain.
                            </li>
                            <li>
                                <strong>2.</strong> Transfer ka receipt upload karte hain aur committee
                                ke <strong>Payouts</strong> tab mein record ho jata hai.
                            </li>
                            <li>
                                <strong>3.</strong> Aap ko notification + email milti hai. Agar amount
                                aap ko nahi mili to organizer se{" "}
                                <Link href="/userDash/inbox" className="text-primary-700 underline">
                                    inbox
                                </Link>{" "}
                                par rabta karain — humara audit log poori transaction trace karta hai.
                            </li>
                        </ol>

                        <Card className="border-accent-500/30 bg-accent-500/5">
                            <div className="space-y-2">
                                <p className="eyebrow">Example payout</p>
                                <Money amount={120000} size="xl" tone="primary" showUrduWords />
                                <p className="text-xs text-muted-500">
                                    12 members × ₨ 10,000 monthly = ₨ 1,20,000 lump-sum payout
                                </p>
                            </div>
                        </Card>

                        <Callout tone="info" icon={FiInfo}>
                            Payout milne ke baad bhi aap ki committee ki <strong>baqi mahine ki
                            payments band nahi hoteen</strong> — aap ko committee finish hone tak monthly
                            installment deni hai.
                        </Callout>
                    </Section>

                    {/* ───────── 7 — Chat ───────── */}
                    <Section
                        id="chat"
                        n="07"
                        en="Messaging organizer"
                        ur="گفتگو"
                        lead="Direct inbox — har committee ke saath alag thread."
                    >
                        <p>
                            <Link href="/userDash/inbox" className="text-primary-700 underline">
                                Inbox
                            </Link>{" "}
                            mein har committee ka alag chat thread hota hai. Aap WhatsApp chhor sakte
                            hain — har baat-cheet yahin record hoti hai, audit ke liye.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>• Payment confirmation ke liye organizer ko ping karain</li>
                            <li>• Apna mahina early request karain (emergency case)</li>
                            <li>• Committee ki announcements yahin read karain</li>
                        </ul>
                    </Section>

                    {/* ───────── 8 — Profile ───────── */}
                    <Section
                        id="profile"
                        n="08"
                        en="Profile & settings"
                        ur="پروفائل اور سیٹنگز"
                        lead="Apni info aur payout account hamesha updated rakhain."
                    >
                        <p>
                            <Link href="/userDash/profile" className="text-primary-700 underline">
                                Profile
                            </Link>{" "}
                            par jayein. Yahan se aap:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>• Naam, phone, address update karain</li>
                            <li>• Verification documents upload ya re-upload karain</li>
                            <li>• Payout bank details (account title, bank name, IBAN) save karain</li>
                            <li>• Password change karain</li>
                            <li>• Language English ↔ Urdu switch karain</li>
                            <li>• Account close request karain (active committee na ho to)</li>
                        </ul>

                        <Callout tone="warning" icon={FiAlertTriangle}>
                            <strong>IBAN check karain:</strong> ghalat IBAN matlab payout fail. Bank
                            ki website / app se confirm karain (24 characters: PK + 22 digits).
                        </Callout>
                    </Section>

                    {/* CTA */}
                    <Card className="border-primary-500/30 bg-primary-500/5 text-center">
                        <div className="space-y-4 py-4">
                            <h3 className="text-2xl font-black text-ink-900">Ready to start?</h3>
                            <p className="font-urdu text-muted-500" dir="rtl">
                                شروع کرنے کے لیے تیار ہیں؟
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link href="/register">
                                    <Button variant="primary" size="lg">
                                        Create my account <FiArrowRight />
                                    </Button>
                                </Link>
                                <Link href="/userDash/explore">
                                    <Button variant="secondary" size="lg">
                                        Browse committees
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </article>
            </div>
        </main>
    );
}

/* ────────── shared bits ────────── */

function Section({ id, n, en, ur, lead, children }) {
    return (
        <section id={id} className="space-y-5 scroll-mt-24">
            <div className="flex items-start gap-4 border-b border-border-100 pb-4">
                <span className="text-4xl font-black tracking-tighter text-primary-700">{n}</span>
                <div className="flex-1">
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <h2 className="text-2xl font-black tracking-tight text-ink-900 md:text-3xl">
                            {en}
                        </h2>
                        <span className="font-urdu text-lg text-muted-500" dir="rtl">
                            {ur}
                        </span>
                    </div>
                    {lead ? (
                        <p className="mt-1 text-sm font-medium text-muted-600">{lead}</p>
                    ) : null}
                </div>
            </div>
            <div className="space-y-4 text-sm font-medium leading-7 text-ink-700">{children}</div>
        </section>
    );
}

function FieldExplainer({ items }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-border-100 bg-surface-50">
            <ul className="divide-y divide-border-100">
                {items.map((it, i) => (
                    <li key={i} className="grid gap-2 p-4 md:grid-cols-[200px_1fr] md:gap-6">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-ink-900">
                                {it.label}
                            </p>
                            <p className="font-urdu text-xs text-muted-500" dir="rtl">
                                {it.urdu}
                            </p>
                        </div>
                        <p className="text-sm text-muted-600 leading-6">{it.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Callout({ tone = "info", icon: Icon, children }) {
    const tones = {
        info: "border-info-500/30 bg-info-500/5 text-info-700",
        success: "border-success-500/30 bg-success-500/5 text-success-700",
        warning: "border-warning-500/30 bg-warning-500/10 text-warning-700",
        danger: "border-danger-500/30 bg-danger-500/10 text-danger-700",
    };
    return (
        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${tones[tone] || tones.info}`}>
            {Icon ? <Icon className="mt-0.5 flex-shrink-0" /> : null}
            <div className="text-sm leading-6 text-ink-700">{children}</div>
        </div>
    );
}
