import { useEffect, useState } from "react";

export default function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(`/api/notification?userId=${userId}`);
      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
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
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Unread Notifications</h2>
      <div>
        {notifications
          .filter((n) => !n.isRead)
          .map((notification) => (
            <div
              key={notification._id}
              className="border p-4 mb-2 bg-yellow-100 cursor-pointer"
              onClick={() => markAsRead(notification._id)}
            >
              {notification.message}
            </div>
          ))}
      </div>

      <h2 className="text-lg font-bold mt-6 mb-4">Read Notifications</h2>
      <div>
        {notifications
          .filter((n) => n.isRead)
          .map((notification) => (
            <div
              key={notification._id}
              className="border p-4 mb-2 bg-gray-100"
            >
              {notification.message}
            </div>
          ))}
      </div>
    </div>
  );
}
