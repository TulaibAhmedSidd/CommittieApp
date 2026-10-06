"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FiPlus, FiAlertCircle, FiLayers, FiChevronRight, FiLink } from "react-icons/fi";
import { Page, Section, Button, EmptyState, Loading, ErrorBox, Bi } from "../ui";
import BcCard from "../Components/BcCard";
import { W } from "../utils/words";
import { useApi } from "../utils/useApi";
import { getSession } from "../utils/session";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default function OrganizerHome() {
  const { data, error, loading, reload } = useApi("admin", "/api/committee");
  const name = (typeof window !== "undefined" && getSession("admin")?.account?.name?.split(" ")[0]) || "";

  const groups = useMemo(() => {
    const list = data?.committees || [];
    return {
      running: list.filter((c) => c.stage === "running"),
      upcoming: list.filter((c) => c.stage === "upcoming").sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
      finished: list.filter((c) => c.stage === "finished"),
    };
  }, [data]);

  const todo = useMemo(() => {
    const items = [];
    for (const c of [...groups.running, ...groups.upcoming]) {
      if (c.receiptsToCheck) items.push({ id: c._id + "r", href: `/admin/bc/${c._id}`, text: `${c.receiptsToCheck} receipt${c.receiptsToCheck > 1 ? "s" : ""} to check`, bc: c.name });
      if (c.joinRequests) items.push({ id: c._id + "j", href: `/admin/bc/${c._id}`, text: `${c.joinRequests} want${c.joinRequests > 1 ? "" : "s"} to join`, bc: c.name });
      if (c.stage === "running" && c.payersCount && c.paidCount === c.payersCount && !c.payoutGiven)
        items.push({ id: c._id + "p", href: `/admin/bc/${c._id}`, text: `Everyone paid. Give payout to ${c.receiverName}`, bc: c.name });
      if (c.stage === "upcoming" && c.membersCount === c.maxMembers) items.push({ id: c._id + "s", href: `/admin/bc/${c._id}`, text: "BC is full. Ready to start", bc: c.name });
    }
    return items;
  }, [groups]);

  if (loading && !data) return <Loading />;

  return (
    <Page title={`${greeting()}${name ? `, ${name}` : ""}`} subtitle="Here is what is happening in your BCs.">
      {error && <ErrorBox message={error} onRetry={reload} />}

      <Button href="/admin/create" size="lg" full icon={FiPlus} className="sm:w-auto">
        <Bi {...W.createBc} />
      </Button>

      {todo.length > 0 && (
        <Section title={W.toDo.en} urdu={W.toDo.ur}>
          <div className="overflow-hidden rounded-xl border border-warning-100 bg-warning-50">
            {todo.slice(0, 5).map((t) => (
              <Link key={t.id} href={t.href} className="flex min-h-[56px] items-center gap-3 border-b border-warning-100 px-4 py-3 last:border-0 hover:bg-warning-100/50">
                <FiAlertCircle className="h-5 w-5 shrink-0 text-warning-600" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink-900">{t.text}</span>
                  <span className="block truncate text-sm text-ink-600">{t.bc}</span>
                </span>
                <FiChevronRight className="h-5 w-5 text-ink-400" aria-hidden />
              </Link>
            ))}
          </div>
        </Section>
      )}

      {data && !data.committees.length ? (
        <EmptyState
          icon={FiLayers}
          title="No BCs yet"
          urdu="ابھی کوئی کمیٹی نہیں"
          text="Create your first BC. Then add your family members and send them the link on WhatsApp."
          action={
            <Button href="/admin/create" icon={FiPlus}>
              <Bi {...W.createBc} />
            </Button>
          }
        />
      ) : (
        <>
          <BcList title={W.running} items={groups.running} tab="running" empty="No BC is running right now." />
          <BcList title={W.comingUp} items={groups.upcoming} tab="upcoming" empty="No upcoming BC. Create one so members can join." />
          {groups.finished.length > 0 && <BcList title={W.finished} items={groups.finished} tab="finished" />}
          <Link href="/admin/invite" className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 hover:bg-surface-100">
            <FiLink className="h-5 w-5 text-primary-600" aria-hidden />
            <span className="flex-1 text-[15px] font-semibold text-ink-900">
              <Bi en="Send your invite link to family" ur="خاندان کو دعوت کا لنک بھیجیں" />
            </span>
            <FiChevronRight className="h-5 w-5 text-ink-400" aria-hidden />
          </Link>
        </>
      )}
    </Page>
  );
}

function BcList({ title, items, tab, empty }) {
  return (
    <Section title={title.en} urdu={title.ur} count={items.length} href={items.length > 3 ? `/admin/bcs?tab=${tab}` : undefined}>
      {items.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {items.slice(0, 3).map((c) => (
            <BcCard key={c._id} c={c} href={`/admin/bc/${c._id}`} />
          ))}
        </div>
      ) : (
        empty && <p className="rounded-xl border border-dashed border-line bg-white/60 px-4 py-4 text-sm text-ink-500">{empty}</p>
      )}
    </Section>
  );
}
