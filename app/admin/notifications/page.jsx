"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNotificationFeed from "../AdminComponents/AdminNotificationFeed";

export default function AdminNotificationsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminDetail = localStorage.getItem("admin_detail");
        if (!adminDetail) {
            router.push("/admin/login");
            return;
        }
        setLoading(false);
    }, [router]);

    if (loading) return null;

    return (
        <div className="p-8 md:p-12 animate-in fade-in duration-700">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-8">
                Command <span className="text-primary-600">Transmission</span>
            </h1>
            <AdminNotificationFeed />
        </div>
    );
}
