"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../Components/Theme/Button";
import Card from "../Components/Theme/Card";
import Input from "../Components/Theme/Input";
import { FiLock, FiMail, FiShield } from "react-icons/fi";

export default function AdminLogin() {
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
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to log in");
            }

            const { token, data } = await res.json();
            localStorage.setItem("admin_token", token);
            localStorage.setItem("admin_detail", JSON.stringify(data));
            router.push("/admin");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
            <Card className="w-full max-w-md p-8 md:p-10 shadow-2xl border-slate-200/80 dark:border-slate-800 backdrop-blur-xl">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-500/20 mb-4">
                        <FiShield size={28} />
                    </div>
                    <span className="eyebrow mb-2">Organizer Portal</span>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Admin Login</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Enter your credentials to access your committee command center.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <Input
                        label="Email Address"
                        icon={FiMail}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="space-y-2">
                        <Input
                            label="Password"
                            icon={FiLock}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="flex justify-end pt-1">
                            <a href="/admin/forgot-password" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                Forgot Password?
                            </a>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full mt-4"
                        variant="primary"
                        size="lg"
                    >
                        {loading ? "Logging in..." : "Sign In to Admin Dashboard"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
