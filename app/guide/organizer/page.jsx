"use client";

import Link from "next/link";
import {
    FiCheckCircle,
    FiUser,
    FiShield,
    FiUsers,
    FiPlusSquare,
    FiUpload,
    FiAward,
    FiMessageCircle,
    FiBell,
    FiArrowRight,
    FiAlertTriangle,
    FiInfo,
    FiClock,
    FiTrendingUp,
    FiActivity,
    FiZap,
} from "react-icons/fi";

import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import StatusPill from "../../Components/Theme/StatusPill";
import Money from "../../Components/Theme/Money";
import BilingualLabel from "../../Components/Theme/BilingualLabel";
import StepProgress from "../../Components/Theme/StepProgress";

const SECTIONS = [
    { id: "register", label: "Register & approval", urdu: "رجسٹریشن" },
    { id: "verify", label: "Identity verification", urdu: "تصدیق" },
    { id: "create", label: "Create a committee", urdu: "کمیٹی بنائیں" },
    { id: "members", label: "Member management", urdu: "اراکین" },
    { id: "payments", label: "Verifying payments", urdu: "ادائیگیاں" },
    { id: "cycle", label: "Advancing months", urdu: "ماہانہ سائیکل" },
    { id: "payout", label: "Recording payouts", urdu: "ادائیگی ریکارڈ" },
    { id: "announce", label: "Announcements", urdu: "اعلانات" },
    { id: "fee", label: "Organizer fee", urdu: "آرگنائزر فیس" },
    { id: "referrals", label: "Referrals", urdu: "ریفرل" },
    { id: "super", label: "Super admin powers", urdu: "سپر ایڈمن" },
];

export default function OrganizerGuide() {
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
                            Organizer guide.
                            <br />
                            <span className="text-primary-700">Committee chalanay ka tareeqa.</span>
                        </h1>
                        <p className="font-urdu text-xl text-muted-500" dir="rtl">
                            ہر آپشن کی مکمل وضاحت۔
                        </p>
                        <p className="text-base font-medium text-muted-600 max-w-2xl">
                            Organizer banne se le kar committee finish hone tak — har screen, har
                            field, har approval ka mukammal walkthrough.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="/register?role=organizer">
                                <Button variant="accent" size="lg">
                                    Apply as organizer <FiArrowRight />
                                </Button>
                            </Link>
                            <Link href="/guide/member">
                                <Button variant="secondary" size="lg">
                                    I'm a member
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
                    {/* ───────── 1 — Register ───────── */}
                    <Section
                        id="register"
                        n="01"
                        en="Registration & approval"
                        ur="رجسٹریشن اور منظوری"
                        lead="Organizer banne ka process — member ke barakhilaaf, approval lazmi hai."
                    >
                        <p>
                            <Link href="/register?role=organizer" className="text-primary-700 underline">
                                /register
                            </Link>{" "}
                            par jayein aur <strong>Become organizer</strong> tab chuneien. Same form jaisa
                            member ka hai, lekin status auto-approve nahi hota.
                        </p>

                        <StepProgress
                            steps={["Sign up", "Pending review", "Super admin approve", "Active"]}
                            currentStep={2}
                        />

                        <p>
                            Submit karne ke baad aap ka status{" "}
                            <StatusPill tone="warning">pending</StatusPill> ho jata hai. Super admin
                            (Tulaib ya designated admin) aap ki profile review karte hain:
                        </p>

                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>• Naam aur contact details legitimate hain ya nahi</li>
                            <li>• Pehle se koi member account to nahi (duplicate check)</li>
                            <li>• City aur area valid hain</li>
                            <li>• Referral source (agar koi senior organizer ne refer kiya hai)</li>
                        </ul>

                        <p>
                            Approval ke baad aap ko email aati hai aur aap{" "}
                            <Link href="/admin/login" className="text-primary-700 underline">
                                /admin/login
                            </Link>{" "}
                            par login kar sakte hain. Average wait time: <strong>24-48 ghante</strong>.
                        </p>

                        <Callout tone="warning" icon={FiAlertTriangle}>
                            <strong>Pending state mein:</strong> aap login nahi kar sakte. Login screen
                            par "Registration pending Super Admin approval" error ayega. Sabr karain — ya
                            super admin ko WhatsApp par poll karain.
                        </Callout>
                    </Section>

                    {/* ───────── 2 — Verification ───────── */}
                    <Section
                        id="verify"
                        n="02"
                        en="Identity verification"
                        ur="شناخت کی تصدیق"
                        lead="Blue Tick lazmi hai — verified organizers ko zyada members miltay hain."
                    >
                        <p>
                            Admin profile (
                            <Link href="/admin/profile" className="text-primary-700 underline">
                                /admin/profile
                            </Link>
                            ) par jayein. Upload karain:
                        </p>

                        <FieldExplainer
                            items={[
                                {
                                    label: "CNIC number",
                                    urdu: "شناختی کارڈ نمبر",
                                    body: "13 digits, daashon ke saath (35202-1234567-8). Member-facing UI mein last 4 hi visible hote hain.",
                                },
                                {
                                    label: "CNIC image",
                                    urdu: "شناختی کارڈ کی تصویر",
                                    body: "Front + back. Original card, clear photo. Members ko kabhi nahi dikhayi jati — sirf super admin ke paas.",
                                },
                                {
                                    label: "Profile selfie",
                                    urdu: "سیلفی",
                                    body: "Live selfie holding CNIC. Spoof-detection mein madad karta hai.",
                                },
                                {
                                    label: "Bank statement (optional)",
                                    urdu: "بینک اسٹیٹمنٹ",
                                    body: "Pichlay 3 mahine ka. Members ko aap ki financial reliability dikhata hai.",
                                },
                            ]}
                        />

                        <Callout tone="info" icon={FiInfo}>
                            <strong>Verified Blue Tick</strong> milne ke baad aap ki har committee aur
                            har announcement par tick automatically dikhega. Members aap ke committees
                            ko priority dete hain.
                        </Callout>
                    </Section>

                    {/* ───────── 3 — Create committee ───────── */}
                    <Section
                        id="create"
                        n="03"
                        en="Creating a committee"
                        ur="نئی کمیٹی بنانا"
                        lead="Har field ka kaam — kya likhna hai, kab kya effect hota hai."
                    >
                        <p>
                            <Link href="/admin/create" className="text-primary-700 underline">
                                /admin/create
                            </Link>{" "}
                            par jayein. Form bharne se pehle yeh tay kar lain:{" "}
                            <strong>kitne members</strong>, <strong>kitni monthly amount</strong>,{" "}
                            <strong>kitne mahine</strong>.
                        </p>

                        <FieldExplainer
                            items={[
                                {
                                    label: "Committee name",
                                    urdu: "کمیٹی کا نام",
                                    body: "Public — members ye naam Explore mein dekhte hain. Maslan 'Gulshan Mothers' Circle Q1 2026'.",
                                },
                                {
                                    label: "Description",
                                    urdu: "تفصیل",
                                    body: "2-3 sentences. Kis ke liye hai, koi special rules, kab shuru hogi. Members detail page par parhte hain.",
                                },
                                {
                                    label: "Monthly amount (PKR)",
                                    urdu: "ماہانہ رقم",
                                    body: "Har member har mahine itne paise dega. Total pool = monthly × members. Realistic rakhain — bahut ziada amount se members darrtay hain.",
                                },
                                {
                                    label: "Month duration",
                                    urdu: "کتنے مہینے",
                                    body: "Total length. Members count ke barabar hona standard hai (12 members = 12 mahine), lekin aap chhota ya bara rakh sakte hain.",
                                },
                                {
                                    label: "Max members",
                                    urdu: "زیادہ سے زیادہ اراکین",
                                    body: "Kitne log shamil ho sakte hain. Pool size = monthlyAmount × maxMembers. Filled hone par status auto-set hota hai 'full'.",
                                },
                                {
                                    label: "Organizer fee (PKR)",
                                    urdu: "آرگنائزر فیس",
                                    body: "Aap ki management fee. Total Due = monthly + fee. 0 rakh sakte hain. Members ko clearly visible hota hai.",
                                },
                                {
                                    label: "Is fee mandatory?",
                                    urdu: "کیا فیس لازمی ہے؟",
                                    body: "Agar Yes — har member ko deni hogi. No to optional — members marzi se de sakte hain.",
                                },
                                {
                                    label: "Bank details",
                                    urdu: "بینک کی تفصیل",
                                    body: "Account title, bank name, IBAN. Yahi par members payment bhejen ge. Sahi likhain — typo se payments fail hoti hain.",
                                },
                                {
                                    label: "Require documents",
                                    urdu: "دستاویزات لازمی",
                                    body: "Agar Yes — joining ke liye member ko specific documents upload karne honge. High-value committees mein recommended.",
                                },
                                {
                                    label: "Mandatory documents list",
                                    urdu: "لازمی دستاویزات",
                                    body: "Multi-select: CNIC, Salary slip, Utility bill, Bank statement, Reference letter. 'requireDocuments: yes' hone par enable hota hai.",
                                },
                                {
                                    label: "Start date / End date",
                                    urdu: "شروع اور اختتام",
                                    body: "Optional. Set karein to dashboard mein countdown dikhta hai aur announcements schedule kiye ja sakte hain.",
                                },
                            ]}
                        />

                        <Callout tone="success" icon={FiCheckCircle}>
                            <strong>Pro tip:</strong> Pehli committee chhoti rakhain — 6 members,
                            6 mahine, ₨ 5,000 monthly. Track record banane ke baad bara pool launch karain.
                        </Callout>
                    </Section>

                    {/* ───────── 4 — Members ───────── */}
                    <Section
                        id="members"
                        n="04"
                        en="Member management"
                        ur="اراکین کا انتظام"
                        lead="Join requests approve karain, members add karain, deactivate karain."
                    >
                        <h3 className="text-base font-black text-ink-900">Join requests</h3>
                        <p>
                            Jab koi member committee join ki request bhejta hai, aap ke{" "}
                            <Link href="/admin/members" className="text-primary-700 underline">
                                Members
                            </Link>{" "}
                            screen par <strong>Pending</strong> tab mein dikhta hai. Har request par:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>
                                • Member ka naam, city, verification status, CNIC last 4 (agar verified)
                            </li>
                            <li>
                                • Action buttons: <StatusPill tone="success">Approve</StatusPill>{" "}
                                ya <StatusPill tone="danger">Reject</StatusPill>
                            </li>
                            <li>• Reject karne par reason batana lazmi hai (member ko email jata hai)</li>
                        </ul>

                        <h3 className="text-base font-black text-ink-900 mt-6">Add members directly</h3>
                        <p>
                            <Link href="/admin/assign-member" className="text-primary-700 underline">
                                /admin/assign-member
                            </Link>{" "}
                            par jayein. Jo log already aap ke <em>member pool</em> mein hain (i.e. pehle
                            kabhi aap ki kisi committee mein the), unhe seedha kisi committee mein assign
                            kar sakte hain — request nahi bhejni padti.
                        </p>

                        <h3 className="text-base font-black text-ink-900 mt-6">Bulk upload (CSV)</h3>
                        <p>
                            Naye logon ke liye{" "}
                            <Link href="/admin/addmember" className="text-primary-700 underline">
                                /admin/addmember
                            </Link>{" "}
                            par CSV upload karain. Format: name, email, phone, city. System unhe auto-
                            register kar deta hai aur reset password link bhejta hai.
                        </p>

                        <Callout tone="warning" icon={FiAlertTriangle}>
                            <strong>Strict rule:</strong> jab committee <strong>full</strong> ho jaaye,
                            naye members add nahi ho sakte. Pehle kisi ko remove karna padega.
                        </Callout>
                    </Section>

                    {/* ───────── 5 — Verifying payments ───────── */}
                    <Section
                        id="payments"
                        n="05"
                        en="Verifying member payments"
                        ur="ادائیگیوں کی تصدیق"
                        lead="Har mahine — receipts review karain, verify ya reject."
                    >
                        <p>
                            Committee Manage page (
                            <Link href="/admin/manage" className="text-primary-700 underline">
                                /admin/manage?id=...
                            </Link>
                            ) par <strong>Payments</strong> tab kholain. Current month ke saare members ki
                            payment status table:
                        </p>

                        <Card>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between border-b border-border-100 pb-2">
                                    <span className="font-bold">Aliya Khan</span>
                                    <StatusPill tone="warning">Pending review</StatusPill>
                                </div>
                                <div className="flex items-center justify-between border-b border-border-100 pb-2">
                                    <span className="font-bold">Hassan Raza</span>
                                    <StatusPill tone="success">Verified</StatusPill>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Fatima Bilal</span>
                                    <StatusPill tone="neutral">Unpaid</StatusPill>
                                </div>
                            </div>
                        </Card>

                        <p>
                            <StatusPill tone="warning">Pending review</StatusPill> par click karein —
                            uploaded screenshot bara dikh jaata hai with transaction ID. Confirm karain:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>• Amount sahi hai (monthlyAmount + organizerFee agar mandatory)</li>
                            <li>• Date current month ke andar ki hai</li>
                            <li>• Recipient account aap ka registered account hai</li>
                            <li>• Transaction ID JazzCash/EasyPaisa/bank ki app par match kar raha hai</li>
                        </ul>
                        <p>
                            Phir <strong>Verify</strong> click karain — payment{" "}
                            <StatusPill tone="success">verified</StatusPill> ho jati hai aur member ko
                            PDF receipt bhejti hai. Galat ho to <strong>Reject</strong> + reason — member
                            ko re-upload karne ka mauqa milta hai.
                        </p>
                    </Section>

                    {/* ───────── 6 — Cycle ───────── */}
                    <Section
                        id="cycle"
                        n="06"
                        en="Advancing the monthly cycle"
                        ur="مہینہ آگے بڑھانا"
                        lead="100% verification ke baad hi 'Next Month' button enable hota hai."
                    >
                        <p>
                            Yeh humara <strong>strictest enforcement</strong> hai. Aap{" "}
                            <em>tab tak agla month start nahi kar sakte</em> jab tak:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>
                                • Current month ke <strong>100% non-beneficiary members</strong> ki
                                payment <StatusPill tone="success">verified</StatusPill> ho
                            </li>
                            <li>
                                • Current month ke beneficiary (jisko payout milna tha) ka payout
                                record ho with proof (next section)
                            </li>
                        </ul>

                        <p>
                            Dono ho jaayein to <strong>Next Month →</strong> button activate hota hai.
                            Click karte hi:
                        </p>
                        <ol className="space-y-2 text-sm text-muted-600">
                            <li>1. <code>currentMonth</code> +1 ho jata hai</li>
                            <li>2. Saare members ko email + notification: "Month X started"</li>
                            <li>3. Naya beneficiary mark hota hai (rotation order ke hisaab se)</li>
                            <li>4. Audit log entry ban jati hai</li>
                        </ol>

                        <Callout tone="danger" icon={FiAlertTriangle}>
                            <strong>Members ko skip nahi kar sakte:</strong> agar 1 member late hai aur
                            aap month advance kar dete to puri trust toot jaati hai. App is rule ko
                            server-side enforce karta hai — koi shortcut nahi.
                        </Callout>
                    </Section>

                    {/* ───────── 7 — Payout ───────── */}
                    <Section
                        id="payout"
                        n="07"
                        en="Recording the payout"
                        ur="ادائیگی ریکارڈ کرنا"
                        lead="Beneficiary ko transfer kar ke proof upload karain."
                    >
                        <p>
                            Manage page → <strong>Payouts</strong> tab. Current month ka beneficiary
                            top par highlighted hota hai with un ka payout account info.
                        </p>
                        <ol className="space-y-2 text-sm text-muted-600">
                            <li>
                                <strong>1.</strong> Apne bank / JazzCash / EasyPaisa se member ke account
                                par full pool transfer karain (totalAmount = monthlyAmount × members).
                            </li>
                            <li>
                                <strong>2.</strong> Transfer screenshot / receipt upload karain.
                            </li>
                            <li>
                                <strong>3.</strong> Transaction ID + amount fields bharein.
                            </li>
                            <li>
                                <strong>4.</strong> Submit — payout record ban jata hai aur member ko
                                email + notification jati hai.
                            </li>
                        </ol>

                        <Card className="border-accent-500/30 bg-accent-500/5">
                            <div className="space-y-2">
                                <p className="eyebrow">Example payout</p>
                                <Money amount={300000} size="xl" tone="primary" showUrduWords />
                                <p className="text-xs text-muted-500">
                                    12 members × ₨ 25,000 monthly = ₨ 3,00,000 lump sum
                                </p>
                            </div>
                        </Card>
                    </Section>

                    {/* ───────── 8 — Announcements ───────── */}
                    <Section
                        id="announce"
                        n="08"
                        en="Announcements / broadcasts"
                        ur="اعلانات"
                        lead="Pure committee ko ek baar mein bhej dein zaroori paighaam."
                    >
                        <p>
                            <Link href="/admin/announcement" className="text-primary-700 underline">
                                /admin/announcement
                            </Link>{" "}
                            par jayein. Specific committee select karain (ya 'All my committees').
                            Title + body + optional image. <strong>Send</strong> click karte hi har
                            member ke:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>• In-app notification feed</li>
                            <li>• Email inbox</li>
                            <li>• Dashboard banner (24 ghante ke liye)</li>
                        </ul>
                        <p>
                            Common use cases: Eid greeting + payout schedule change, payment deadline
                            reminder, account number change.
                        </p>
                    </Section>

                    {/* ───────── 9 — Fee ───────── */}
                    <Section
                        id="fee"
                        n="09"
                        en="Organizer fee — transparent monetization"
                        ur="آرگنائزر فیس"
                        lead="Aap ki management fee — clearly visible aur consent-based."
                    >
                        <p>
                            Committee create karte waqt 2 fee settings:
                        </p>
                        <FieldExplainer
                            items={[
                                {
                                    label: "Organizer fee (PKR)",
                                    urdu: "آرگنائزر فیس",
                                    body: "Har member har mahine ke saath extra deta hai. Maslan monthly ₨ 10,000 + fee ₨ 500 = total ₨ 10,500.",
                                },
                                {
                                    label: "Is fee mandatory?",
                                    urdu: "کیا لازمی ہے؟",
                                    body: "Yes — har member ko deni hogi, ya warna joining nahi ho sakti. No — optional, member khud decide karta hai. Mandatory mein zyada revenue, optional mein zyada acceptance.",
                                },
                            ]}
                        />

                        <Callout tone="info" icon={FiInfo}>
                            <strong>Transparency:</strong> fee committee detail page par members ko
                            join karne se pehle clearly dikhayi jaati hai. Hidden fees ki ijazat
                            nahi.
                        </Callout>
                    </Section>

                    {/* ───────── 10 — Referrals ───────── */}
                    <Section
                        id="referrals"
                        n="10"
                        en="Referral center"
                        ur="ریفرل سینٹر"
                        lead="Naye members aap ke link se aayein to credit milta hai."
                    >
                        <p>
                            <Link href="/admin/referrals" className="text-primary-700 underline">
                                /admin/referrals
                            </Link>{" "}
                            par jayein. Aap ka unique <code>referralCode</code> + sharable link milta hai.
                            Members link se sign-up karein to:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>• Aap ke <code>referralScore</code> mein +1</li>
                            <li>• Member auto-associated hota hai aap ke saath</li>
                            <li>• Future committees mein priority approval</li>
                        </ul>
                        <p>
                            Top referrers ko Super Admin se monthly bonus / featured organizer badge
                            mil sakta hai.
                        </p>
                    </Section>

                    {/* ───────── 11 — Super admin ───────── */}
                    <Section
                        id="super"
                        n="11"
                        en="Super admin powers (read-only for organizers)"
                        ur="سپر ایڈمن"
                        lead="Yeh sirf super admins ko milta hai — agar aap regular organizer hain, yeh skip karen."
                    >
                        <p>Super admin (i.e. <code>isSuperAdmin: true</code>) ko extra screens dikhte hain:</p>
                        <ul className="space-y-2 text-sm text-muted-600">
                            <li>
                                • <Link href="/admin/approvals" className="text-primary-700 underline">
                                    Approvals
                                </Link>{" "}
                                — naye organizers approve / reject
                            </li>
                            <li>
                                • <Link href="/admin/verify-identities" className="text-primary-700 underline">
                                    Verify identities
                                </Link>{" "}
                                — members aur organizers ke CNIC review karna
                            </li>
                            <li>
                                • <Link href="/admin/all-members" className="text-primary-700 underline">
                                    Global member pool
                                </Link>{" "}
                                — saare members ki list (cross-organizer)
                            </li>
                            <li>
                                • <Link href="/admin/logs" className="text-primary-700 underline">
                                    Audit logs
                                </Link>{" "}
                                — har action ka log (kab kis ne kya kiya)
                            </li>
                            <li>
                                • <Link href="/admin/theme" className="text-primary-700 underline">
                                    System control / Theme
                                </Link>{" "}
                                — platform-wide branding theme
                            </li>
                            <li>
                                • <Link href="/admin/add-admin" className="text-primary-700 underline">
                                    Create organizer
                                </Link>{" "}
                                — manually onboard a pre-approved organizer
                            </li>
                        </ul>
                    </Section>

                    {/* CTA */}
                    <Card className="border-accent-500/30 bg-accent-500/5 text-center">
                        <div className="space-y-4 py-4">
                            <FiAward className="mx-auto text-accent-700" size={32} />
                            <h3 className="text-2xl font-black text-ink-900">
                                Ready to lead your first committee?
                            </h3>
                            <p className="font-urdu text-muted-500" dir="rtl">
                                اپنی پہلی کمیٹی شروع کریں؟
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link href="/register?role=organizer">
                                    <Button variant="accent" size="lg">
                                        Apply as organizer <FiArrowRight />
                                    </Button>
                                </Link>
                                <Link href="/admin/login">
                                    <Button variant="secondary" size="lg">
                                        Already approved? Login
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
                    <li key={i} className="grid gap-2 p-4 md:grid-cols-[220px_1fr] md:gap-6">
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
