"use client";

import React, { useState } from "react";
import { useTheme } from "../../Components/ThemeContext";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import { FiCheck, FiLayout, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";

const themes = [
    { id: 'midnight', name: 'Midnight', primary: 'var(--primary)', bg: 'var(--background)' },
    { id: 'forest', name: 'Forest', primary: '#10b981', bg: '#064e3b' },
    { id: 'solar', name: 'Solar', primary: '#f59e0b', bg: '#451a03' },
    { id: 'royal', name: 'Royal', primary: '#8b5cf6', bg: '#2e1065' },
    { id: 'crimson', name: 'Crimson', primary: '#ef4444', bg: '#450a0a' },
    { id: 'ocean', name: 'Ocean', primary: '#06b6d4', bg: '#083344' },
    { id: 'sunset', name: 'Sunset', primary: '#f97316', bg: '#431407' },
    { id: 'rose', name: 'Rose', primary: '#f43f5e', bg: '#4c0519' },
    { id: 'onyx', name: 'Onyx', primary: '#ffffff', bg: '#000000' },
    { id: 'steel', name: 'Steel', primary: '#94a3b8', bg: '#0f172a' },
    { id: 'cyber', name: 'Cyber', primary: '#6ee7b7', bg: '#1e1b4b' },
];

export default function ThemeManager() {
    const { theme: activeTheme, setTheme } = useTheme();
    const [saving, setSaving] = useState(false);

    const handleThemeChange = async (themeId) => {
        setSaving(true);
        try {
            const adminDetail = localStorage.getItem("admin_detail");
            const admin = adminDetail ? JSON.parse(adminDetail) : null;

            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    activeTheme: themeId,
                    adminId: admin?._id
                })
            });

            if (!res.ok) throw new Error("Failed to save theme");

            setTheme(themeId);
            toast.success(`${themeId.charAt(0).toUpperCase() + themeId.slice(1)} theme applied globally!`);
        } catch (err) {
            toast.error("Error applying theme");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 p-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl">
                    <FiLayout size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">System Aesthetics</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global theme control for all users</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {themes.map((t) => (
                    <Card
                        key={t.id}
                        className={`p-1 overflow-hidden cursor-pointer transition-all duration-300 border-2 ${activeTheme === t.id ? 'border-primary-500 scale-105 shadow-xl' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                    >
                        <div className="relative aspect-video rounded-xl overflow-hidden" style={{ backgroundColor: t.id === 'midnight' ? 'var(--background)' : t.bg }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full border-4 border-white/20 flex items-center justify-center" style={{ backgroundColor: t.id === 'midnight' ? 'var(--primary)' : t.primary }}>
                                    {activeTheme === t.id && <FiCheck className="text-white" />}
                                </div>
                            </div>
                            <div
                                onClick={() => handleThemeChange(t.id)}
                                className="absolute bottom-0 left-0 right-0 p-2 bg-black/20 backdrop-blur-md">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest text-center">{t.name}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="p-6 bg-primary-500/5 border border-primary-500/10 rounded-3xl flex items-center gap-4">
                <FiZap className="text-primary-500" size={24} />
                <p className="text-[11px] font-bold text-primary-700 dark:text-primary-400 uppercase tracking-widest leading-relaxed">
                    Security Protocol: Theme changes are global and visible to all members and organizers instantly. Always choose an accessible pairing.
                </p>
            </div>
        </div>
    );
}
