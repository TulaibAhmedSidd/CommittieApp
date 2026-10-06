"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiBell } from "react-icons/fi";
import { Button, Card, EmptyState, Loading, ErrorBox } from "../ui";
import { apiFor, memberApi } from "../utils/api";

const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

/** Alerts list. Marks all as read when opened. Members can answer organizer requests here. */
export default function NotificationList({ scope }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [answered, setAnswered] = useState({});
  const api = apiFor(scope);

  const load = useCallback(() => {
    api
      .get("/api/notification")
      .then((d) => {
        setItems(d.items);
        if (d.unread) api.patch("/api/notification", {}).catch(() => {});
      })
      .catch((e) => setError(e.message));
  }, [api]);

  useEffect(load, [load]);

  const respond = async (n, action) => {
    try {
      await memberApi.post("/api/member/respond-request", { adminId: n.details?.adminId, action });
      setAnswered({ ...answered, [n._id]: action });
      toast.success(action === "approve" ? "Done. You are now in their members list." : "Request declined.");
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!items) return <Loading rows={3} />;
  if (!items.length) return <EmptyState icon={FiBell} title="No alerts yet" urdu="ابھی کوئی اطلاع نہیں" />;

  return (
    <Card padding="p-0" className="divide-y divide-line overflow-hidden">
      {items.map((n) => {
        const body = (
          <div className={`flex gap-3 px-4 py-3.5 ${n.isRead ? "" : "bg-primary-50/50"}`}>
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isRead ? "bg-transparent" : "bg-primary-600"}`} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] text-ink-900">{n.message}</p>
              <p className="mt-0.5 text-[13px] text-ink-500">{timeAgo(n.createdAt)}</p>
              {scope === "member" && n.type === "connect_request" && n.details?.adminId && (
                <div className="mt-2 flex gap-2">
                  {answered[n._id] ? (
                    <span className="text-sm font-semibold text-ink-600">{answered[n._id] === "approve" ? "Accepted" : "Declined"}</span>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => respond(n, "approve")}>Accept</Button>
                      <Button size="sm" variant="secondary" onClick={() => respond(n, "reject")}>No thanks</Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
        return n.link && n.type !== "connect_request" ? (
          <Link key={n._id} href={n.link} className="block hover:bg-surface-100">
            {body}
          </Link>
        ) : (
          <div key={n._id}>{body}</div>
        );
      })}
    </Card>
  );
}
