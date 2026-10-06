"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiUsers, FiCalendar, FiFileText } from "react-icons/fi";
import { Bi, Button, Card, Money, StatusBadge } from "@/app/ui";
import { W } from "@/app/utils/words";
import { memberApi } from "@/app/utils/api";

/** "Jan 2027" */
export const monthYear = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "");

/**
 * Join action for an open BC: Open / Request sent / Full / Ask to join.
 * bc: { _id, isMember, isPending, spotsLeft }. onJoined(bcId) is called after a request is sent.
 */
export function JoinButton({ bc, onJoined }) {
  const [busy, setBusy] = useState(false);
  const [needDocs, setNeedDocs] = useState(false);

  if (bc.isMember) {
    return (
      <Button variant="secondary" full href={`/userDash/bc/${bc._id}`}>
        Open
      </Button>
    );
  }
  if (bc.isPending) {
    return (
      <div className="flex min-h-[44px] items-center">
        <StatusBadge status="pending" label="Request sent" tone="amber" />
      </div>
    );
  }
  if (bc.spotsLeft === 0) {
    return (
      <Button variant="secondary" full disabled>
        Full
      </Button>
    );
  }

  const ask = async () => {
    setBusy(true);
    setNeedDocs(false);
    try {
      await memberApi.post(`/api/committee/${bc._id}/request`, {});
      toast.success("Request sent. The organizer will reply.");
      onJoined?.(bc._id);
    } catch (e) {
      toast.error(e.message);
      if (/document/i.test(e.message)) setNeedDocs(true);
      else if (/already asked/i.test(e.message)) onJoined?.(bc._id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button full loading={busy} onClick={ask}>
        <Bi {...W.askToJoin} />
      </Button>
      {needDocs && (
        <Link
          href="/userDash/profile"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          <FiFileText className="h-4 w-4" aria-hidden />
          Add documents in your profile
        </Link>
      )}
    </div>
  );
}

/** One open BC in Find BCs / Near me / organizer page. Hides the organizer line when bc.organizer is missing. */
export default function OpenBcCard({ bc, onJoined }) {
  const org = bc.organizer;
  return (
    <Card padding="p-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-[17px] font-bold text-ink-900">{bc.name}</h3>
          <p className="mt-0.5 text-sm text-ink-600">
            <Money value={bc.monthlyAmount} size="lg" className="text-ink-900" /> / month
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
          <span className="inline-flex items-center gap-1.5">
            <FiUsers className="h-4 w-4" aria-hidden />
            {bc.membersCount}/{bc.maxMembers} members
          </span>
          {bc.startDate && (
            <span className="inline-flex items-center gap-1.5">
              <FiCalendar className="h-4 w-4" aria-hidden />
              Starts {monthYear(bc.startDate)}
            </span>
          )}
          {bc.requireDocuments && <span className="text-[13px] text-ink-500">Asks for documents</span>}
        </div>

        {org && (
          <Link
            href={`/userDash/organizer/${org._id}`}
            className="flex min-h-[44px] flex-wrap items-center gap-x-2 gap-y-1 rounded-lg text-[15px] hover:bg-surface-100"
          >
            <span className="text-ink-600">Organizer:</span>
            <span className="font-semibold text-primary-700 underline-offset-2 hover:underline">{org.name}</span>
            {org.verificationStatus === "verified" && <StatusBadge status="verifiedId" />}
            {(org.distanceKm != null || org.city) && (
              <span className="text-[13px] text-ink-500">
                {[org.distanceKm != null ? `${org.distanceKm} km away` : "", org.city].filter(Boolean).join(" · ")}
              </span>
            )}
          </Link>
        )}

        <JoinButton bc={bc} onJoined={onJoined} />
      </div>
    </Card>
  );
}
