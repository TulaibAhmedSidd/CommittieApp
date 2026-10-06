"use client";

import { useCallback, useEffect, useState } from "react";
import { FiLink, FiUserPlus, FiUsers } from "react-icons/fi";
import { Button, Card, EmptyState, ErrorBox, Loading, Page, ShareBox } from "../../ui";
import { W } from "../../utils/words";
import { adminApi } from "../../utils/api";

export default function AdminInvitePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    adminApi
      .get("/api/admin/referral")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  let body;
  if (error && !data) body = <ErrorBox message={error} onRetry={load} />;
  else if (!data) body = <Loading rows={2} />;
  else if (!data.link) body = <EmptyState icon={FiLink} title="No link yet" urdu="ابھی کوئی لنک نہیں" text="Please try again in a moment." />;
  else {
    const joined = data.joined || 0;
    body = (
      <>
        <Card padding="p-5">
          <p className="mb-4 text-[15px] text-ink-700">
            Send this link to family. They make an account and join your members.
          </p>
          <ShareBox link={data.link} text={data.text} waHref={data.waLink} />
        </Card>

        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              <FiUsers className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-[15px] text-ink-900">
              <span className="text-xl font-bold">{joined}</span> {joined === 1 ? "person" : "people"} joined with your link
            </p>
          </div>
        </Card>

        <Button variant="secondary" size="lg" full href="/admin/members" icon={FiUserPlus}>
          Add a member yourself
        </Button>
      </>
    );
  }

  return (
    <Page title={W.inviteLink.en} urdu={W.inviteLink.ur}>
      {body}
    </Page>
  );
}
