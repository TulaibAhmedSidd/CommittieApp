"use client";

import { FiUsers, FiCalendar } from "react-icons/fi";
import { Card, Money, Progress, StatusBadge, Bi } from "../ui";
import { monthLabel } from "../utils/bcRules";

const shortDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "");

/**
 * One BC in a list. c = card from cardSummary() (API).
 * For organizers: shows what needs doing. For members (c.myStatus set): shows "Pay" / "Paid" / "Your turn".
 */
export default function BcCard({ c, href, forMember = false }) {
  return (
    <Card href={href} padding="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-bold text-ink-900">{c.name}</h3>
          <p className="mt-0.5 text-sm text-ink-600">
            <Money value={c.monthlyAmount} size="sm" className="font-semibold text-ink-800" /> / month
            {forMember && c.organizerName ? ` · ${c.organizerName}` : ""}
          </p>
        </div>
        <StatusBadge status={c.stage} />
      </div>

      {c.stage === "upcoming" && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
          <span className="inline-flex items-center gap-1.5">
            <FiUsers className="h-4 w-4" aria-hidden /> {c.membersCount}/{c.maxMembers} members
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiCalendar className="h-4 w-4" aria-hidden /> Starts {shortDate(c.startDate)}
          </span>
          {!forMember && c.joinRequests > 0 && <StatusBadge status="request" label={`${c.joinRequests} want to join`} tone="amber" />}
        </div>
      )}

      {c.stage === "running" && (
        <div className="mt-3 space-y-2.5">
          <Progress current={c.currentMonth} total={c.monthDuration} label={`Month ${c.currentMonth} of ${c.monthDuration} · ${monthLabel(c, c.currentMonth)}`} />
          {forMember ? <MemberLine c={c} /> : <OrganizerLine c={c} />}
        </div>
      )}

      {c.stage === "finished" && (
        <p className="mt-3 text-sm text-ink-600">
          {c.monthDuration} months · {c.membersCount} members{c.endedEarly ? " · ended early" : ""}
        </p>
      )}
    </Card>
  );
}

function OrganizerLine({ c }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {c.receiverName && (
        <span className="text-ink-700">
          <Bi en="Gets the pot:" ur="باری:" /> <b>{c.receiverName}</b>
        </span>
      )}
      <span className="text-ink-600">
        · {c.paidCount}/{c.payersCount} paid
      </span>
      {c.receiptsToCheck > 0 && <StatusBadge status="pending" label={`${c.receiptsToCheck} to check`} tone="amber" />}
      {c.paidCount === c.payersCount && !c.payoutGiven && <StatusBadge status="pending" label="Give payout" tone="amber" />}
    </div>
  );
}

function MemberLine({ c }) {
  const turn = c.myTurnMonths?.[0];
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="text-sm">
        {c.myStatus === "receiver" ? (
          <StatusBadge status="receiver" label="Your turn this month" tone="primary" />
        ) : c.myStatus === "verified" ? (
          <StatusBadge status="verified" />
        ) : c.myStatus === "pending" ? (
          <StatusBadge status="pending" />
        ) : (
          <span className="font-semibold text-warning-700">
            Pay <Money value={c.monthlyAmount} size="sm" /> this month
          </span>
        )}
      </div>
      {turn && c.myStatus !== "receiver" && (
        <span className="text-[13px] text-ink-600">
          <Bi en="Your turn:" ur="آپ کی باری:" /> {monthLabel(c, turn)}
        </span>
      )}
    </div>
  );
}
