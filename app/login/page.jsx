"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiPhone, FiLock } from "react-icons/fi";
import PublicLayout from "../ui/PublicLayout";
import { Button, Card, Field, Bi } from "../ui";
import { W } from "../utils/words";
import { publicApi } from "../utils/api";
import { saveSession, getSession } from "../utils/session";
import { safeNext } from "../utils/safeNext";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [choose, setChoose] = useState(null);

  useEffect(() => {
    const wantsAdmin = next?.startsWith("/admin");
    const admin = getSession("admin");
    const member = getSession("member");
    if (wantsAdmin && admin) router.replace(safeNext(next, "admin"));
    else if (!wantsAdmin && member) router.replace(safeNext(next, "member"));
    else if (!next && admin) router.replace("/admin");
  }, [next, router]);

  const submit = async (role) => {
    setError("");
    setLoading(true);
    try {
      const data = await publicApi.post("/api/auth/login", { identifier, password, role });
      if (data.choose) {
        setChoose(data.choose);
        return;
      }
      const scope = data.account.role === "admin" ? "admin" : "member";
      saveSession(scope, data.token, data.account);
      router.replace(safeNext(next, scope));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout narrow>
      <h1 className="mb-1 text-2xl font-bold text-ink-900">
        <Bi {...W.login} stack />
      </h1>
      <p className="mb-6 text-ink-600">Welcome back. Use the phone number or email you signed up with.</p>

      <Card padding="p-5">
        {choose ? (
          <div className="space-y-3">
            <p className="font-semibold text-ink-900">You have two accounts. Which one?</p>
            <Button full size="lg" onClick={() => submit("admin")} loading={loading}>
              I am the organizer
            </Button>
            <Button full size="lg" variant="secondary" onClick={() => submit("member")} loading={loading}>
              I am a member
            </Button>
            <button type="button" className="w-full py-2 text-sm text-ink-500" onClick={() => setChoose(null)}>
              Back
            </button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Field
              label={W.emailOrPhone.en}
              urdu={W.emailOrPhone.ur}
              prefix={<FiPhone />}
              placeholder="0300 1234567"
              autoComplete="username"
              inputMode="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <Field
              label={W.password.en}
              urdu={W.password.ur}
              prefix={<FiLock />}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm font-medium text-danger-700">{error}</p>}
            <Button type="submit" full size="lg" loading={loading}>
              <Bi {...W.login} />
            </Button>
            <div className="text-center">
              <Link href="/forgot-password" className="text-sm font-semibold text-primary-700 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        )}
      </Card>

      <p className="mt-6 text-center text-ink-600">
        New here?{" "}
        <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-primary-700 hover:underline">
          Create an account
        </Link>
      </p>
    </PublicLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
