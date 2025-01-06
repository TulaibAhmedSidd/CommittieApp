import { useEffect, useState } from "react";

export default function NotificationIcon({ userId }) {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try{
            const response = await fetch(`/api/notification?userId=${userId}`);
            const notifications = await response.json();
            const unread = Array.isArray(notifications) && notifications?.filter((n) => !n?.isRead).length;
            setUnreadCount(unread);

        }catch(e){
            console.log("ERRROR: ",e)
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUnreadCount();
        }

    }, [userId]);
    return (
        <div className="relative">
            <button className="relative">
                <i className="fas fa-bell text-orange-500 text-2xl"></i>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                        {unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}
