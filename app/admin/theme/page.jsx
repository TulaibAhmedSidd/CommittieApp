"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeManager from "../AdminComponents/ThemeManager";
import SystemControl from "../AdminComponents/SystemControl";

export default function ThemePage() {
    const router = useRouter();
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adminDetails, setAdminDetails] = useState(null);

    useEffect(() => {
        const adminDetail = localStorage.getItem("admin_detail");
        if (!adminDetail) {
            router.push("/admin/login");
            return;
        }
        const admin = JSON.parse(adminDetail);
        if (!admin.isSuperAdmin && !admin.isAdmin) {
            router.push("/admin");
            return;
        }
        setAdminDetails(admin);
        setIsSuperAdmin(admin.isSuperAdmin || false);
        setLoading(false);
    }, [router]);

    if (loading) return null;

    return (
        <div className="p-8 md:p-12 animate-in fade-in duration-700">
            <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic mb-8">
                System <span className="text-primary-500">Control</span>
            </h1>
            <ThemeManager />
            <SystemControl
                isAdmin={true}
                isSuperAdmin={isSuperAdmin}
                adminDetails={adminDetails}
            />
        </div>
    );
}
