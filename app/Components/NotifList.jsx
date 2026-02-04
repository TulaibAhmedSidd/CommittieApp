"use client";

import { useEffect, useState } from "react";
import { FiBell, FiCheck, FiMail, FiClock } from "react-icons/fi";
import Card from "./Theme/Card";

export default function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notification?userId=${userId}`);
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notification/mark-as-read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8">
      {notifications.length === 0 ? (
        <Card className="py-12 border-dashed flex flex-col items-center justify-center text-secondary-400">
          <FiMail size={32} className="mb-2 opacity-20" />
          <p className="text-sm font-medium">No messages found for your account.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`
                relative p-5 rounded-2xl border transition-all duration-300
                ${n.isRead
                  ? "bg-white dark:bg-slate-900 border-secondary-100 dark:border-secondary-800 opacity-70"
                  : "bg-primary-50/30 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800/50 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                }
              `}
            >
              <div className="flex gap-4">
                <div className={`
                  shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${n.isRead ? "bg-secondary-100 dark:bg-secondary-800 text-secondary-400" : "bg-primary-100 dark:bg-primary-900 text-primary-600"}
                `}>
                  {n.isRead ? <FiCheck /> : <FiBell className="animate-bounce-slow" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={`text-sm leading-relaxed ${n.isRead ? "text-secondary-600 dark:text-secondary-400" : "text-secondary-900 dark:text-white font-semibold"}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-secondary-400 font-bold uppercase tracking-tighter">
                    <FiClock />
                    <span>Received Just Now</span>
                  </div>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
