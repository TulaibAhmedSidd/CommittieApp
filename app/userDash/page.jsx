"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { FiAlertCircle, FiChevronRight, FiSearch, FiLayers } from "react-icons/fi";
import { Page, Section, Card, Button, EmptyState, Loading, ErrorBox, Money, Bi, StatusBadge } from "../ui";
import BcCard from "../Components/BcCard";
import { W } from "../utils/words";
import { useApi } from "../utils/useApi";
import { memberApi } from "../utils/api";
import { getSession } from "../utils/session";
import { monthLabel } from "../utils/bcRules";

const shortDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "");

export default function MemberHome() {
  const { data, error, loading, reload } = useApi("member", "/api/member/bcs");
  const name = getSession("member")?.account?.name?.split(" ")[0] || "";

  if (loading && !data) return <Loading />;

  const mine = data?.mine || [];
  const running = mine.filter((c) => c.stage === "running");
  const toPay = running.filter((c) => c.myStatus === "unpaid" || c.myStatus === "rejected");
  const others = mine.filter((c) => c.stage !== "running");

  const ask = async (c) => {
    try {
      await memberApi.post(`/api/committee/${c._id}/request`, {});
      toast.success("Request sent. The organizer will reply.");
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const cancel = async (c) => {
    try {
      await memberApi.post(`/api/committee/${c._id}/request`, { action: "cancel" });
      toast.success("Request cancelled.");
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Page title={`Assalam o Alaikum${name ? `, ${name}` : ""}`} urdu="السلام علیکم">
      {error && <ErrorBox message={error} onRetry={reload} />}

      {toPay.length > 0 && (
        <Section title={W.toDo.en} urdu={W.toDo.ur}>
          <div className="overflow-hidden rounded-xl border border-warning-100 bg-warning-50">
            {toPay.map((c) => (
              <Link key={c._id} href={`/userDash/bc/${c._id}?pay=1`} className="flex min-h-[60px] items-center gap-3 border-b border-warning-100 px-4 py-3 last:border-0 hover:bg-warning-100/50">
                <FiAlertCircle className="h-5 w-5 shrink-0 text-warning-600" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink-900">
                    Pay <Money value={c.monthlyAmount} /> for {monthLabel(c, c.currentMonth)}
                  </span>
                  <span className="block truncate text-sm text-ink-600">
                    {c.name}
                    {c.myStatus === "rejected" ? " · receipt sent back" : ""}
                  </span>
                </span>
                <span className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white">{W.pay.en}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {mine.length === 0 && !data?.requests?.length ? (
        <EmptyState
          icon={FiLayers}
          title="You are not in a BC yet"
          urdu="آپ ابھی کسی کمیٹی میں نہیں ہیں"
          text="Ask your organizer to add you, or open the BC link they send on WhatsApp."
          action={
            <Button href="/userDash/explore" icon={FiSearch}>
              <Bi {...W.explore} />
            </Button>
          }
        />
      ) : (
        <>
          {running.length > 0 && (
            <Section title={W.myBcs.en} urdu={W.myBcs.ur} count={running.length}>
              <div className="grid gap-3 md:grid-cols-2">
                {running.map((c) => (
                  <BcCard key={c._id} c={c} href={`/userDash/bc/${c._id}`} forMember />
                ))}
              </div>
            </Section>
          )}
          {others.length > 0 && (
            <Section title={running.length ? "Other BCs" : W.myBcs.en} urdu={running.length ? "دوسری کمیٹیاں" : W.myBcs.ur} count={others.length}>
              <div className="grid gap-3 md:grid-cols-2">
                {others.map((c) => (
                  <BcCard key={c._id} c={c} href={`/userDash/bc/${c._id}`} forMember />
                ))}
              </div>
            </Section>
          )}
        </>
      )}

      {data?.requests?.length > 0 && (
        <Section title="Waiting for approval" urdu="منظوری کا انتظار">
          <Card padding="p-0" className="divide-y divide-line overflow-hidden">
            {data.requests.map((c) => (
              <div key={c._id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-900">{c.name}</p>
                  <p className="text-sm text-ink-500">
                    {c.organizerName} · <Money value={c.monthlyAmount} size="sm" /> a month
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => cancel(c)}>
                  Cancel
                </Button>
              </div>
            ))}
          </Card>
        </Section>
      )}

      {data?.comingUp?.length > 0 && (
        <Section title="New BCs from your organizers" urdu="آپ کے منتظمین کی نئی کمیٹیاں">
          <div className="grid gap-3 md:grid-cols-2">
            {data.comingUp.map((c) => (
              <Card key={c._id} padding="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-bold text-ink-900">{c.name}</p>
                    <p className="text-sm text-ink-600">
                      {c.organizerName} · starts {shortDate(c.startDate)}
                    </p>
                  </div>
                  <StatusBadge status="upcoming" />
                </div>
                <p className="mt-2 text-[15px] text-ink-800">
                  <Money value={c.monthlyAmount} /> a month · {c.membersCount}/{c.maxMembers} members
                </p>
                <Button className="mt-3" full onClick={() => ask(c)} disabled={c.membersCount >= c.maxMembers}>
                  <Bi {...W.askToJoin} />
                </Button>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Link href="/userDash/explore" className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 hover:bg-surface-100">
        <FiSearch className="h-5 w-5 text-primary-600" aria-hidden />
        <span className="flex-1 text-[15px] font-semibold text-ink-900">
          <Bi en="Find more BCs" ur="مزید کمیٹیاں تلاش کریں" />
        </span>
        <FiChevronRight className="h-5 w-5 text-ink-400" aria-hidden />
      </Link>
    </Page>
  );
}
