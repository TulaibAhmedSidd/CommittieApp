"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PublicLayout from "../../ui/PublicLayout";
import { Button, Card, Field, Bi, Loading } from "../../ui";
import { publicApi } from "../../utils/api";
import { saveSession, homeFor } from "../../utils/session";

/** Used by /invite/[token] and /reset-password?token= */
export default function SetPasswordForm({ token }) {
  const router = useRouter();
  const [info, setInfo] = useState(null);
  const [linkError, setLinkError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState("");

  useEffect(() => {
    if (!token) {
      setLinkError("This link is not complete. Ask for a new one.");
      return;
    }
    publicApi
      .get(`/api/auth/password-link/${encodeURIComponent(token)}`)
      .then(setInfo)
      .catch((e) => setLinkError(e.message));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("The two passwords are not the same.");
      return;
    }
    setLoading(true);
    try {
      const data = await publicApi.post("/api/auth/set-password", { token, password });
      if (data.pending) {
        setDone(data.message);
        return;
      }
      const scope = data.account.role === "admin" ? "admin" : "member";
      saveSession(scope, data.token, data.account);
      router.replace(homeFor(scope));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!info && !linkError) return <Loading rows={1} />;

  return (
    <PublicLayout narrow>
      {linkError ? (
        <Card padding="p-6">
          <h1 className="text-xl font-bold text-ink-900">Link not working</h1>
          <p className="mt-2 text-ink-700">{linkError}</p>
          <p className="font-urdu mt-2 text-ink-600" dir="rtl">
            یہ لنک پرانا ہو گیا ہے۔ اپنے منتظم سے نیا لنک مانگیں۔
          </p>
          <Button href="/login" variant="secondary" full className="mt-5">
            Go to log in
          </Button>
        </Card>
      ) : done ? (
        <Card padding="p-6">
          <p className="text-ink-800">{done}</p>
          <Button href="/login" full className="mt-4">
            Go to log in
          </Button>
        </Card>
      ) : (
        <>
          <h1 className="mb-1 text-2xl font-bold text-ink-900">
            {info.purpose === "invite" ? <Bi en={`Welcome, ${info.firstName}`} ur="خوش آمدید" stack /> : <Bi en="Set a new password" ur="نیا پاس ورڈ" stack />}
          </h1>
          <p className="mb-6 text-ink-600">{info.purpose === "invite" ? "Make a password to open your account." : "Choose a new password."}</p>
          <Card padding="p-5">
            <form className="space-y-4" onSubmit={submit}>
              <Field label="New password" urdu="نیا پاس ورڈ" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 6 letters or numbers." required minLength={6} />
              <Field label="Type it again" urdu="دوبارہ لکھیں" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
              {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm font-medium text-danger-700">{error}</p>}
              <Button type="submit" full size="lg" loading={loading}>
                Save and continue
              </Button>
            </form>
          </Card>
        </>
      )}
    </PublicLayout>
  );
}
