"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import PublicLayout from "../ui/PublicLayout";
import { Button, Card, Field, Bi, Tabs } from "../ui";
import { W } from "../utils/words";
import { publicApi } from "../utils/api";
import { saveSession } from "../utils/session";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const referralCode = params.get("ref") || "";
  const next = params.get("next");
  const [role, setRole] = useState(params.get("role") === "organizer" ? "organizer" : "member");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await publicApi.post("/api/auth/register", { ...form, role, referralCode: role === "member" ? referralCode : undefined });
      if (data.pending) {
        setPending(true);
        return;
      }
      saveSession("member", data.token, data.account);
      router.replace(next && next.startsWith("/") && !next.startsWith("/admin") ? next : "/userDash");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (pending) {
    return (
      <PublicLayout narrow>
        <Card padding="p-6">
          <FiCheckCircle className="mb-3 h-10 w-10 text-primary-600" aria-hidden />
          <h1 className="text-xl font-bold text-ink-900">Request sent</h1>
          <p className="mt-2 text-ink-700">We will check your organizer account soon. You can log in after it is approved.</p>
          <p className="font-urdu mt-2 text-ink-600" dir="rtl">
            آپ کا اکاؤنٹ منظور ہونے کے بعد آپ لاگ ان کر سکیں گے۔
          </p>
          <Button href="/" variant="secondary" full className="mt-5">
            Back to home
          </Button>
        </Card>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout narrow>
      <h1 className="mb-1 text-2xl font-bold text-ink-900">
        <Bi {...W.register} stack />
      </h1>
      <p className="mb-5 text-ink-600">It takes one minute.</p>

      {referralCode && role === "member" && (
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800">You were invited by an organizer. You will be added to their members.</p>
      )}

      <Tabs
        className="mb-4"
        value={role}
        onChange={setRole}
        tabs={[
          { value: "member", en: "I want to join a BC", ur: "کمیٹی میں شامل ہوں" },
          { value: "organizer", en: "I run BCs", ur: "میں کمیٹی چلاتا ہوں" },
        ]}
      />

      <Card padding="p-5">
        <form className="space-y-4" onSubmit={submit}>
          <Field label={W.name.en} urdu={W.name.ur} autoComplete="name" value={form.name} onChange={set("name")} required />
          <Field label={W.phone.en} urdu={W.phone.ur} type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" value={form.phone} onChange={set("phone")} required />
          <Field label={W.email.en} urdu={W.email.ur} type="email" autoComplete="email" value={form.email} onChange={set("email")} hint="Helps if you forget your password." />
          <Field label={W.password.en} urdu={W.password.ur} type="password" autoComplete="new-password" value={form.password} onChange={set("password")} hint="At least 6 letters or numbers." required minLength={6} />
          {role === "organizer" && <p className="rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-700">Organizer accounts are checked by the admin before you can log in.</p>}
          {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm font-medium text-danger-700">{error}</p>}
          <Button type="submit" full size="lg" loading={loading}>
            <Bi {...W.register} />
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-ink-600">
        Already have an account?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-primary-700 hover:underline">
          Log in
        </Link>
      </p>
    </PublicLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
