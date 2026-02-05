"use client";

import React, { useState } from "react";
import { FiTrash2, FiUserPlus, FiAlertTriangle, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import Card from "@/app/Components/Theme/Card";
import Button from "@/app/Components/Theme/Button";

export default function SystemControl({ isAdmin, isSuperAdmin, adminDetails }) {
    const [loading, setLoading] = useState(false);

    const handleWipeData = async () => {
        if (!confirm("CRITICAL WARNING: This will permanently delete ALL members, committees, and transaction data. This action cannot be undone. Are you absolutely sure?")) return;

        setLoading(true);
        try {
            const res = await fetch("/api/admin/system/wipe", {
                method: "DELETE",
                body: JSON.stringify({ adminId: adminDetails?._id })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                window.location.reload();
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error("System Purge Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkAdd = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/system/bulk-add", {
                method: "POST",
                body: JSON.stringify({ adminId: adminDetails?._id, adminName: adminDetails?.name })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                window.location.reload();
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error("Batch Onboarding Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">System <span className="text-primary-600">Utilities</span></h2>
                <p className="text-slate-500 text-sm font-medium italic">Advanced administrative protocols for environment management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isSuperAdmin && (
                    <Card className="p-8 border-red-500/20 bg-red-500/5 space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <FiAlertTriangle size={24} />
                            <h3 className="font-black uppercase tracking-tight">Nuclear Option</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic">
                            Wipe all collections (Members, Committees, etc.) to start fresh. This does not affect your Super Admin account.
                        </p>
                        <Button
                            onClick={handleWipeData}
                            loading={loading}
                            className="bg-red-600 hover:bg-red-700 text-white border-none w-full py-4 text-[10px] font-black uppercase tracking-widest"
                        >
                            <FiTrash2 className="mr-2" /> Purge System Data
                        </Button>
                    </Card>
                )}

                {isAdmin && (
                    <Card className="p-8 border-primary-500/20 bg-primary-500/5 space-y-4">
                        <div className="flex items-center gap-3 text-primary-600">
                            <FiZap size={24} />
                            <h3 className="font-black uppercase tracking-tight">Rapid Seeding</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic">
                            Instantly onboard 20 realistic members into your organization for testing or initial setup.
                        </p>
                        <Button
                            onClick={handleBulkAdd}
                            loading={loading}
                            className="w-full py-4 text-[10px] font-black uppercase tracking-widest"
                        >
                            <FiUserPlus className="mr-2" /> Bulk Add Participants
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}
