"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiLock, FiMail, FiArrowRight, FiUsers } from "react-icons/fi";
import Button from "../Components/Theme/Button";
import Input from "../Components/Theme/Input";
import Card from "../Components/Theme/Card";
import Logo from "../Components/Theme/Logo";
import { useLanguage } from "../Components/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT token to local storage
      localStorage.setItem("token", data?.token);
      localStorage.setItem("member", JSON.stringify(data?.member));
      router.push("/userDash");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/userDash");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center justify-center mb-8">
          <Logo size="xl" className="justify-center" />
          <span className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] mt-2">Member Portal · ممبر پورٹل</span>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-white/50 dark:border-slate-800/50 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-xs font-semibold p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<FiMail />}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<FiLock />}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/reset-password"
                className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              className="w-full py-4 font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary-500/20"
            >
              {loading ? "Signing In..." : "Sign In"} <FiArrowRight className="ml-2" />
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-[10px] text-slate-400 font-black uppercase tracking-widest">
          &copy; 2026 CommittieApp
        </p>
      </div>
    </div>
  );
}
