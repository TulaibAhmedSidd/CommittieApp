"use client";

import { useCallback, useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { Card, EmptyState, ListRow, Loading, ErrorBox } from "../ui";
import { apiFor } from "../utils/api";
import ChatBox from "./ChatBox";

/** Conversations list + chat. scope: "admin" | "member" */
export default function InboxList({ scope }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);
  const url = scope === "admin" ? "/api/admin/inbox" : "/api/member/inbox";

  const load = useCallback(() => {
    apiFor(scope)
      .get(url)
      .then((d) => {
        setRows(d);
        setError("");
      })
      .catch((e) => setError(e.message));
  }, [scope, url]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  if (error && !rows) return <ErrorBox message={error} onRetry={load} />;
  if (!rows) return <Loading rows={2} />;
  if (!rows.length) return <EmptyState icon={FiMessageCircle} title="No messages yet" urdu="ابھی کوئی پیغام نہیں" text="Messages with your organizer or members will show here." />;

  return (
    <>
      <Card padding="p-0" className="divide-y divide-line overflow-hidden">
        {rows.map((r) => (
          <ListRow
            key={`${r.otherId}-${r.committeeId || "direct"}`}
            avatar={r.otherName}
            title={r.otherName}
            subtitle={`${r.committeeName ? r.committeeName + " · " : ""}${r.lastMessage.fromMe ? "You: " : ""}${r.lastMessage.content}`}
            right={r.unreadCount > 0 ? <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-bold text-white">{r.unreadCount}</span> : null}
            onClick={() => setOpen(r)}
          />
        ))}
      </Card>
      <ChatBox
        open={!!open}
        onClose={() => {
          setOpen(null);
          load();
        }}
        scope={scope}
        otherId={open?.otherId}
        otherModel={open?.otherModel}
        otherName={open?.otherName}
        committeeId={open?.committeeId}
      />
    </>
  );
}
