"use client";

import React, { useEffect, useState } from "react";
import { FiBell, FiUserPlus, FiInfo, FiCheck, FiMail, FiZap } from "react-icons/fi";
import Card from "../../Components/Theme/Card";
import Button from "../../Components/Theme/Button";
import { toast } from "react-toastify";

export default function AdminNotificationFeed() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const adminDetail = localStorage.getItem("admin_detail");
            const admin = adminDetail ? JSON.parse(adminDetail) : null;
            if (!admin) return;

            const res = await fetch(`/api/admin/notifications?adminId=${admin._id}`);
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch("/api/admin/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id })
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            toast.error("Failed to mark as read");
        }
    };

    if (loading) return <div className="p-8 text-center text-xs font-black uppercase tracking-widest animate-pulse">Scanning Transmission Frequencies...</div>;

    if (notifications.length === 0) return (
        <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <FiBell size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Operational Updates</p>
        </div>
    );

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            {notifications.map((n) => (
                <Card
                    key={n._id}
                    className={`p-6 transition-all border-l-4 ${n.isRead ? 'border-l-slate-200 dark:border-l-slate-800 opacity-60' : 'border-l-primary-600 shadow-premium'}`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${n.isRead ? 'bg-slate-100 text-slate-400' : 'bg-primary-600/10 text-primary-600'}`}>
                            {n.type === 'join_request' ? <FiUserPlus /> : <FiInfo />}
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className={`text-sm font-bold ${n.isRead ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                {n.message}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </div>
                        {!n.isRead && (
                            <button
                                onClick={() => markAsRead(n._id)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-green-600 transition-all"
                                title="Mark as Read"
                            >
                                <FiCheck />
                            </button>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}
