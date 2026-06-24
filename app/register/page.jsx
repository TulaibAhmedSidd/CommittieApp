"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
    FiUser,
    FiMail,
    FiLock,
    FiPhone,
    FiArrowRight,
    FiCheckCircle,
    FiShield,
    FiBriefcase,
    FiMapPin,
    FiNavigation,
    FiAlertTriangle,
    FiClock,
} from "react-icons/fi";

import Button from "../Components/Theme/Button";
import Card from "../Components/Theme/Card";
import BilingualLabel from "../Components/Theme/BilingualLabel";
import StatusPill from "../Components/Theme/StatusPill";

const PAKISTANI_CITIES = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan",
    "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Sukkur",
    "Bahawalpur", "Sargodha", "Mardan", "Larkana", "Sheikhupura",
    "Rahim Yar Khan", "Jhang", "Dera Ghazi Khan", "Abbottabad", "Mirpur",
];

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const referralCode = searchParams.get("ref");
    const initialRole = searchParams.get("role") === "organizer" ? "organizer" : "member";

    const [role, setRole] = useState(initialRole);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        county: "",
        location: { type: "Point", coordinates: [0, 0] },
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        // pre-redirect already-logged-in users
        if (typeof window === "undefined") return;
        if (role === "member" && localStorage.getItem("token")) router.replace("/userDash");
        if (role === "organizer" && localStorage.getItem("admin_token")) router.replace("/admin");
    }, [role, router]);

    const update = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const captureLocation = () => {
        if (!navigator.geolocation) return toast.error("Browser doesn't support geolocation");
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm((prev) => ({
                    ...prev,
                    location: {
                        type: "Point",
                        coordinates: [pos.coords.longitude, pos.coords.latitude],
                    },
                }));
                toast.success("Location captured");
                setLocating(false);
            },
            () => {
                toast.error("Couldn't read your location");
                setLocating(false);
            },
        );
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.phone) return toast.error("Phone number is required");
        if (!form.city) return toast.error("Please select your city");

        setLoading(true);
        try {
            const endpoint = role === "member" ? "/api/member" : "/api/admin";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, referralCode }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Sign-up failed");
            setSuccess(true);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        const isMember = role === "member";
        return (
            <main className="flex min-h-screen items-center justify-center px-4 py-16">
                <Card className="w-full max-w-lg text-center">
                    <div className="space-y-6">
                        <div
                            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] ${
                                isMember
                                    ? "bg-success-500/10 text-success-600"
                                    : "bg-accent-500/15 text-accent-700"
                            }`}
                        >
                            {isMember ? <FiCheckCircle size={36} /> : <FiClock size={36} />}
                        </div>

                        <div className="space-y-2">
                            <p className="eyebrow">{isMember ? "Welcome" : "Application sent"}</p>
                            <h2 className="text-3xl font-black tracking-tight text-ink-900">
                                {isMember ? "Aap ka account ready hai." : "Aap ki request mil gayi."}
                            </h2>
                            <p className="font-urdu text-lg text-muted-500" dir="rtl">
                                {isMember
                                    ? "آپ کا اکاؤنٹ تیار ہے۔"
                                    : "آپ کی درخواست موصول ہو گئی ہے۔"}
                            </p>
                        </div>

                        <p className="text-sm font-medium leading-6 text-muted-600">
                            {isMember
                                ? "Reset link aap ke email par bhej diya gaya hai. Login kar ke apna dashboard kholain, verification complete karain aur committee join karain."
                                : "Aap ki profile Super Admin ke paas review ke liye chali gayi hai. Approval ke baad aap committees create kar sakeingay. Ye 24 ghante mein ho jata hai."}
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link href={isMember ? "/login" : "/admin/login"}>
                                <Button variant="primary" className="w-full">
                                    <BilingualLabel
                                        en={isMember ? "Login now" : "Organizer login"}
                                        ur="لاگ ان"
                                    />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="secondary" className="w-full">
                                    Back to home
                                </Button>
                            </Link>
                        </div>

                        {isMember ? (
                            <Link
                                href="/guide/member"
                                className="block text-xs font-black uppercase tracking-[0.18em] text-primary-700 hover:text-primary-800"
                            >
                                Read the member guide →
                            </Link>
                        ) : (
                            <Link
                                href="/guide/organizer"
                                className="block text-xs font-black uppercase tracking-[0.18em] text-primary-700 hover:text-primary-800"
                            >
                                Read the organizer guide →
                            </Link>
                        )}
                    </div>
                </Card>
            </main>
        );
    }

    const isOrganizer = role === "organizer";

    return (
        <main className="min-h-screen">
            {/* top brand bar */}
            <header className="border-b border-border-100 bg-surface-50/85 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-600 text-white text-sm font-black">
                            BC
                        </div>
                        <span className="text-base font-black tracking-tighter text-ink-900">
                            Committie<span className="text-primary-600">App</span>
                        </span>
                    </Link>
                    <Link
                        href={isOrganizer ? "/admin/login" : "/login"}
                        className="text-xs font-black uppercase tracking-[0.18em] text-muted-500 hover:text-primary-600"
                    >
                        Already a {isOrganizer ? "organizer" : "member"}? <span className="text-primary-600">Login</span>
                    </Link>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-8 md:py-16">
                {/* Left rail — story + benefits */}
                <aside className="space-y-8 md:sticky md:top-24 md:self-start">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accent-700">
                                Sign up · رجسٹریشن
                            </span>
                        </div>
                        <h1 className="text-4xl font-black leading-[1.05] tracking-tighter text-ink-900 md:text-5xl">
                            {isOrganizer
                                ? "Apni committee chalayein."
                                : "Apni committee mein shamil hojayen."}
                        </h1>
                        <p className="font-urdu text-xl text-muted-500" dir="rtl">
                            {isOrganizer
                                ? "اپنی بی سی منظم طور پر چلائیں۔"
                                : "بھروسے کی بی سی، آپ کے فون پر۔"}
                        </p>
                    </div>

                    <ul className="space-y-3 text-sm font-medium text-muted-600">
                        {(isOrganizer
                            ? [
                                  { en: "Member CNIC + selfie verification", ur: "اراکین کی تصدیق" },
                                  { en: "Proof-based monthly cycle tracker", ur: "ماہانہ سائیکل" },
                                  { en: "Auto-receipts + audit trail", ur: "آڈٹ ٹریل" },
                                  { en: "Optional organizer fee, transparent", ur: "آرگنائزر فیس" },
                              ]
                            : [
                                  { en: "Find verified committees near you", ur: "قریبی کمیٹیاں" },
                                  { en: "Upload JazzCash / EasyPaisa receipts", ur: "ادائیگی کا ثبوت" },
                                  { en: "Track every paisa, every cycle", ur: "مکمل شفافیت" },
                                  { en: "Chat with organizers directly", ur: "براہ راست رابطہ" },
                              ]
                        ).map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <FiCheckCircle className="mt-0.5 flex-shrink-0 text-primary-600" />
                                <span>
                                    {item.en}
                                    <span className="ml-2 font-urdu text-muted-500" dir="rtl">
                                        / {item.ur}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>

                    {isOrganizer ? (
                        <div className="flex items-start gap-3 rounded-2xl border border-warning-500/30 bg-warning-500/10 p-4">
                            <FiAlertTriangle className="mt-0.5 flex-shrink-0 text-warning-700" />
                            <p className="text-xs font-semibold leading-5 text-warning-700">
                                <strong>Approval needed:</strong> organizer profiles are reviewed by
                                Super Admin before activation. Member sign-up is instant.
                            </p>
                        </div>
                    ) : null}

                    {referralCode ? (
                        <div className="rounded-2xl border border-accent-500/30 bg-accent-500/10 p-4">
                            <p className="eyebrow text-accent-700">Referral code</p>
                            <p className="mt-1 font-black text-ink-900">{referralCode}</p>
                            <p className="text-xs text-muted-500">
                                You'll be auto-associated with this organizer.
                            </p>
                        </div>
                    ) : null}

                    <Link
                        href={isOrganizer ? "/guide/organizer" : "/guide/member"}
                        className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary-700 hover:text-primary-800"
                    >
                        Read the full guide →
                    </Link>
                </aside>

                {/* Right — the form */}
                <Card className="p-0">
                    <div className="space-y-6 p-6 md:p-8">
                        {/* role toggle */}
                        <div>
                            <p className="eyebrow mb-2">I want to</p>
                            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border-100 bg-surface-100/60 p-1">
                                <button
                                    type="button"
                                    onClick={() => setRole("member")}
                                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                                        !isOrganizer
                                            ? "bg-primary-600 text-white shadow-glow"
                                            : "text-muted-500 hover:text-ink-700"
                                    }`}
                                >
                                    <FiUser size={14} /> Join as member
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("organizer")}
                                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition ${
                                        isOrganizer
                                            ? "bg-accent-500 text-ink-900 shadow-gold"
                                            : "text-muted-500 hover:text-ink-700"
                                    }`}
                                >
                                    <FiBriefcase size={14} /> Become organizer
                                </button>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <Section title="Identity" urdu="شناخت" step={1}>
                                <FieldGroup>
                                    <Field
                                        label={isOrganizer ? "Organizer / circle name" : "Full name"}
                                        urdu={isOrganizer ? "آرگنائزر کا نام" : "پورا نام"}
                                        icon={isOrganizer ? FiBriefcase : FiUser}
                                        name="name"
                                        value={form.name}
                                        onChange={update("name")}
                                        placeholder={isOrganizer ? "Karachi Mothers' Circle" : "Aliya Khan"}
                                        required
                                    />
                                </FieldGroup>
                            </Section>

                            <Section title="Contact" urdu="رابطہ" step={2}>
                                <FieldGroup>
                                    <Field
                                        label="Email"
                                        urdu="ای میل"
                                        icon={FiMail}
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={update("email")}
                                        placeholder="name@example.com"
                                        required
                                    />
                                    <Field
                                        label="Phone"
                                        urdu="فون نمبر"
                                        icon={FiPhone}
                                        name="phone"
                                        value={form.phone}
                                        onChange={update("phone")}
                                        placeholder="0300-1234567"
                                        required
                                    />
                                </FieldGroup>
                            </Section>

                            <Section title="Location" urdu="مقام" step={3}>
                                <FieldGroup>
                                    <div className="flex flex-col gap-1.5">
                                        <Label en="City" ur="شہر" required />
                                        <select
                                            value={form.city}
                                            onChange={update("city")}
                                            required
                                            className="input-field appearance-none"
                                        >
                                            <option value="">— select your city —</option>
                                            {PAKISTANI_CITIES.sort().map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <Field
                                        label="Area / colony"
                                        urdu="علاقہ"
                                        icon={FiMapPin}
                                        name="county"
                                        value={form.county}
                                        onChange={update("county")}
                                        placeholder="e.g. Gulshan-e-Iqbal, DHA Phase 5"
                                    />
                                </FieldGroup>

                                <button
                                    type="button"
                                    onClick={captureLocation}
                                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border-200 bg-surface-100/60 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-ink-700 hover:border-primary-500 hover:text-primary-600"
                                >
                                    <FiNavigation />
                                    {locating
                                        ? "Reading…"
                                        : form.location.coordinates[0] !== 0
                                          ? `Captured · ${form.location.coordinates[1].toFixed(3)}, ${form.location.coordinates[0].toFixed(3)}`
                                          : "Use my current location (optional)"}
                                </button>
                                <p className="text-[11px] text-muted-500">
                                    Exact coords stay private — used only for nearby discovery.
                                </p>
                            </Section>

                            <Section title="Security" urdu="پاس ورڈ" step={4}>
                                <Field
                                    label="Password"
                                    urdu="پاس ورڈ"
                                    icon={FiLock}
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={update("password")}
                                    placeholder="At least 6 characters"
                                    required
                                />
                            </Section>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    variant={isOrganizer ? "accent" : "primary"}
                                    size="lg"
                                    loading={loading}
                                    className="w-full"
                                >
                                    {isOrganizer
                                        ? "Submit organizer application"
                                        : "Create my account"}{" "}
                                    <FiArrowRight />
                                </Button>
                                <p className="mt-3 text-center text-[11px] text-muted-500">
                                    By signing up you agree to our{" "}
                                    <Link href="/terms" className="text-primary-700 hover:underline">
                                        terms
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-primary-700 hover:underline">
                                        privacy
                                    </Link>{" "}
                                    policy.
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="border-t border-border-100 bg-surface-100/60 px-6 py-4 text-center md:px-8">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-500">
                            {isOrganizer
                                ? "Want to join a committee instead?"
                                : "Run committees yourself?"}{" "}
                            <button
                                type="button"
                                onClick={() => setRole(isOrganizer ? "member" : "organizer")}
                                className="text-primary-700 hover:text-primary-800"
                            >
                                Switch to {isOrganizer ? "member" : "organizer"} →
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </main>
    );
}

/* ─────────── tiny local helpers (kept inline to avoid new primitives just
   for the register page; everything they render uses tokens) ─────────── */

function Section({ title, urdu, step, children }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/10 text-[11px] font-black text-primary-700">
                    {step}
                </span>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-ink-900">
                        {title}
                    </h3>
                    <span className="font-urdu text-xs text-muted-500" dir="rtl">
                        {urdu}
                    </span>
                </div>
            </div>
            {children}
        </div>
    );
}

function FieldGroup({ children }) {
    return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Label({ en, ur, required }) {
    return (
        <label className="flex items-baseline justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-500">
                {en} {required ? <span className="text-danger-500">*</span> : null}
            </span>
            {ur ? (
                <span className="font-urdu text-[11px] text-muted-500" dir="rtl">
                    {ur}
                </span>
            ) : null}
        </label>
    );
}

function Field({ label, urdu, icon: Icon, ...inputProps }) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label en={label} ur={urdu} required={inputProps.required} />
            <div className="relative">
                {Icon ? (
                    <Icon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-500"
                    />
                ) : null}
                <input
                    {...inputProps}
                    className={`input-field ${Icon ? "pl-10" : ""}`}
                />
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-2xl border-4 border-primary-500 border-t-transparent" />
                </div>
            }
        >
            <RegisterContent />
        </Suspense>
    );
}
