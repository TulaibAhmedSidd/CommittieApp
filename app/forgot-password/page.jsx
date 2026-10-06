"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail } from "react-icons/fi";
import PublicLayout from "../ui/PublicLayout";
import { Button, Card, Field, Bi } from "../ui";
import { W } from "../utils/words";
import { publicApi } from "../utils/api";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      setResult(await publicApi.post("/api/auth/forgot", { identifier }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout narrow>
      <h1 className="mb-1 text-2xl font-bold text-ink-900">
        <Bi en="Forgot password" ur="پاس ورڈ بھول گئے" stack />
      </h1>
      <p className="mb-6 text-ink-600">Enter your phone or email.</p>
      <Card padding="p-5">
        {result ? (
          <div className="space-y-3">
            <FiMail className="h-8 w-8 text-primary-600" aria-hidden />
            <p className="text-ink-800">{result.message}</p>
            {result.phoneOnly && (
              <p className="font-urdu text-ink-600" dir="rtl">
                اپنے منتظم سے کہیں کہ وہ واٹس ایپ پر نیا لنک بھیجیں۔
              </p>
            )}
            <Button href="/login" variant="secondary" full>
              Back to log in
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <Field label={W.emailOrPhone.en} urdu={W.emailOrPhone.ur} value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="0300 1234567" required />
            {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm font-medium text-danger-700">{error}</p>}
            <Button type="submit" full size="lg" loading={loading}>
              Continue
            </Button>
          </form>
        )}
      </Card>
      <p className="mt-6 text-center">
        <Link href="/login" className="font-semibold text-primary-700 hover:underline">
          Back to log in
        </Link>
      </p>
    </PublicLayout>
  );
}
