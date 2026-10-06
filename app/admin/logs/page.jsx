"use client";

import { useCallback, useEffect, useState } from "react";
import { FiActivity, FiChevronLeft, FiChevronRight, FiLock } from "react-icons/fi";
import { Button, Card, EmptyState, ErrorBox, ListRow, Loading, Page } from "../../ui";
import { adminApi } from "../../utils/api";
import { getSession } from "../../utils/session";

const ACTIONS = {
  CREATE_COMMITTEE: "Created a BC",
  START_COMMITTEE: "Started a BC",
  ADVANCE_MONTH: "Moved to next month",
  RECORD_PAYOUT: "Gave a payout",
  VERIFY_PAYMENT: "Approved a payment",
  REJECT_PAYMENT: "Sent back a receipt",
  SUBMIT_PAYMENT: "Sent a receipt",
  REQUEST_JOIN_COMMITTEE: "Asked to join",
  APPROVE_COMMITTEE_REQUEST: "Approved a join request",
  ADD_MEMBER: "Added a member",
  CREATE_PASSWORD_LINK: "Made a password link",
  VERIFY_IDENTITY: "Verified an identity",
  REJECT_IDENTITY: "Sent back identity papers",
  CREATE_ORGANIZER: "Added an organizer",
  APPROVE_ORGANIZER: "Approved an organizer",
  REJECT_ORGANIZER: "Rejected an organizer",
};

const friendly = (action) => {
  if (ACTIONS[action]) return ACTIONS[action];
  const text = String(action || "Something changed").toLowerCase().replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const when = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${day} ${time}`;
};

export default function ActivityLogPage() {
  const [isSuper, setIsSuper] = useState(null);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => setIsSuper(!!getSession("admin")?.account?.isSuperAdmin), []);

  const load = useCallback(() => {
    setError("");
    setData(null);
    adminApi
      .get(`/api/logs?page=${page}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [page]);

  useEffect(() => {
    if (isSuper) load();
  }, [isSuper, load]);

  if (isSuper === null) return <Loading rows={2} />;
  if (!isSuper) {
    return (
      <Page title="Activity log" urdu="سرگرمی">
        <EmptyState icon={FiLock} title="Only the super admin can see this." urdu="یہ صرف سپر ایڈمن دیکھ سکتے ہیں" />
      </Page>
    );
  }

  const logs = data?.logs || [];
  const pages = data?.pages || 1;

  let body;
  if (error) body = <ErrorBox message={error} onRetry={load} />;
  else if (!data) body = <Loading rows={4} />;
  else if (!logs.length) body = <EmptyState icon={FiActivity} title="Nothing yet" urdu="ابھی کچھ نہیں" />;
  else
    body = (
      <Card padding="p-0" className="divide-y divide-line overflow-hidden">
        {logs.map((l) => (
          <ListRow key={l._id} icon={FiActivity} title={friendly(l.action)} subtitle={`by ${l.by || "Unknown"} · ${when(l.timestamp)}`} />
        ))}
      </Card>
    );

  return (
    <Page title="Activity log" urdu="سرگرمی">
      {body}
      {data && pages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" icon={FiChevronLeft} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-ink-600">
            Page {page} of {pages}
          </span>
          <Button variant="secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
            <FiChevronRight className="h-[1.15em] w-[1.15em]" aria-hidden />
          </Button>
        </div>
      )}
    </Page>
  );
}
