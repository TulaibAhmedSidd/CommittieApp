'use client'
import { useEffect, useState } from "react";
import Modal from "../Components/Modal";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [userLoggedData, setUserLoggedData] = useState(null);
    const router = useRouter();

    let userData = null;
    if (typeof window !== "undefined") {
        userData = localStorage.getItem("member");
    }
    useEffect(() => {
        if (userData) {
            setUserLoggedData(JSON.parse(userData));
        }
    }, [userData]);
    const userId = userLoggedData?._id
    const fetchNotifications = async () => {
        const response = await fetch(`/api/notification?userId=${userId}`);
        const data = await response.json();
        setNotifications(data);
        setLoading(false);
    };
    useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);
    const markAsRead = async (id) => {
        try {

            await fetch(`/api/notification/mark-as-read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationIds: [id] }),
            });
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id ? { ...n, isRead: true } : n
                )
            );
            fetchNotifications();

        } catch (err) {
            console.log(err)
        }
    };
    if (loading) return <p>Loading notifications...</p>;

    return (
        <div className="p-4 mt-10">
            <h1 className="text-2xl font-bold mb-4">All Notifications</h1>
            <div>
                {
                    Array.isArray(notifications) &&
                    notifications?.map((notification) => (
                        <div
                            key={notification?._id}
                            className={` relative border p-4 mb-4 ${notification?.isRead ? "bg-gray-100" : "bg-yellow-100"
                                } cursor-pointer`}
                            onClick={() => {
                                setSelectedNotification(notification);
                                markAsRead(notification?._id)
                            }}
                        >
                            {notification?.message}
                            <div className={`absolute right-0 bottom-[-17px] text-sm ${notification?.isRead ? "text-gray-700" : "text-yellow-700"}`}>
                                <p>{notification?.isRead ? 'Read' : 'unread'}</p>
                            </div>
                        </div>
                    ))}
            </div>

            {selectedNotification && (
                <Modal onClose={() => setSelectedNotification(null)}>
                    <h2 className="text-xl font-bold mb-2">
                        {selectedNotification?.message}
                    </h2>
                    <p>{selectedNotification?.details}</p>
                </Modal>
            )}
        </div>
    );
}
