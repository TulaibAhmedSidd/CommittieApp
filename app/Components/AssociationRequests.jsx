"use client";

import React, { useState, useEffect } from "react";
import { FiUserPlus, FiCheck, FiX, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import Card from "./Theme/Card";
import Button from "./Theme/Button";

export default function AssociationRequests({ memberId }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (memberId) fetchRequests();
    }, [memberId]);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`/api/member/${memberId}`);
            const data = await res.json();
            // Data will have pendingOrganizers populated
            setRequests(data.pendingOrganizers || []);
        } catch (err) {
            console.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (adminId, action) => {
        try {
            const res = await fetch("/api/member/respond-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberId, adminId, action })
            });
            if (res.ok) {
                toast.success(action === 'approve' ? "Association established!" : "Request declined");
                fetchRequests();
            }
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    if (!loading && requests.length === 0) return null;
    if (loading) return null;

    return (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-primary-500/20" />
                <h3 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FiShield /> Link Protocols Detected
                </h3>
                <div className="h-px flex-1 bg-primary-500/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((admin) => (
                    <Card key={admin._id || admin} className="p-6 bg-primary-500/5 border-primary-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-black">
                                {(admin.name || "A").charAt(0)}
                            </div>
                            <div>
                                <button
                                    onClick={() => window.location.href = `/userDash/organizer?id=${admin._id}`}
                                    className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight hover:text-primary-600 transition-colors text-left"
                                >
                                    {admin.name || "Organizer"}
                                </button>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Wants to join your network</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button size="sm" onClick={() => handleAction(admin._id || admin, 'approve')} className="flex-1 sm:flex-none py-2 px-4 text-[9px]">
                                <FiCheck className="mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => handleAction(admin._id || admin, 'reject')} className="flex-1 sm:flex-none py-2 px-4 text-[9px] bg-red-500/10 text-red-500 border-none hover:bg-red-500/20">
                                <FiX className="mr-1" /> Decline
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
