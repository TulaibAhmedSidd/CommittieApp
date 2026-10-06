"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FiMessageCircle, FiClock, FiCheckCircle, FiGift } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Page, Card, Section, Button, Progress, Money, StatusBadge, Avatar, Loading, ErrorBox, Bi } from "../../../ui";
import { W } from "../../../utils/words";
import { useApi } from "../../../utils/useApi";
import { memberApi } from "../../../utils/api";
import { getSession } from "../../../utils/session";
import { waLink } from "../../../utils/whatsapp";
import { beneficiaryFor, beneficiaryId, paymentFor, payoutFor, potAmount, monthLabel, whoMustPay } from "../../../utils/bcRules";
import ChatBox from "../../../Components/ChatBox";
import PaySheet from "./_components/PaySheet";
import RateOrganizer from "./_components/RateOrganizer";

export default function MemberBcPage({ params }) {
  const wantsPay = useSearchParams().get("pay") === "1";
  const { data, error, loading, reload } = useApi("member", `/api/committee/${params.id}`);
  const me = getSession("member")?.account?._id;
  const [payMonth, setPayMonth] = useState(null);
  const [chat, setChat] = useState(false);
  const c = data?.committee;

  useEffect(() => {
    if (wantsPay && c?.isMember && c.stage === "running") {
      const st = paymentFor(c, c.currentMonth, me)?.status || "unpaid";
      if ((st === "unpaid" || st === "rejected") && whoMustPay(c, c.currentMonth).includes(me)) setPayMonth(c.currentMonth);
    }
  }, [wantsPay, c, me]);

  if (loading && !c) return <Loading />;
  if (error && !c) return <div className="p-4"><ErrorBox message={error} onRetry={reload} /></div>;
  if (!c) return null;

  if (!c.isMember) return <NotMemberYet c={c} reload={reload} />;

  const month = c.currentMonth;
  const running = c.stage === "running";
  const myTurn = c.myTurnMonths?.[0];
  const isReceiverNow = running && beneficiaryId(c, month) === me;
  const myPay = paymentFor(c, month, me);
  const myStatus = myPay?.status || "unpaid";
  const months = Array.from({ length: running ? month : 0 }, (_, i) => month - i);

  return (
    <Page title={c.name} back="/userDash" subtitle={<span className="inline-flex flex-wrap items-center gap-2"><StatusBadge status={c.stage} /> <span>{c.organizer?.name}</span></span>}>
      {c.stage === "upcoming" && (
        <Card padding="p-5">
          <p className="text-lg font-bold text-ink-900">You are in. The BC has not started yet.</p>
          <p className="mt-1 text-ink-700">
            Starts {monthLabel(c, 1)} · {c.membersCount}/{c.maxMembers} members · <Money value={c.monthlyAmount} /> a month
          </p>
          <p className="mt-2 text-sm text-ink-500">You will be told your turn when the organizer starts the BC.</p>
        </Card>
      )}

      {running && (
        <Card padding="p-5" className="space-y-4">
          <Progress current={month} total={c.monthDuration} label={`Month ${month} of ${c.monthDuration} · ${monthLabel(c, month)}`} />
          {isReceiverNow ? (
            <div className="rounded-xl bg-primary-50 p-4">
              <p className="flex items-center gap-2 text-lg font-bold text-primary-800">
                <FiGift className="h-6 w-6" aria-hidden /> <Bi en="This month is your turn!" ur="اس ماہ آپ کی باری ہے" />
              </p>
              <p className="mt-1 text-ink-800">
                You get <Money value={potAmount(c, month)} />. You don't pay this month.
              </p>
              <p className="mt-2 text-sm">{payoutFor(c, month) ? <StatusBadge status="given" label="Organizer has given your payout" /> : "The organizer will give it after everyone pays."}</p>
            </div>
          ) : myStatus === "verified" ? (
            <p className="flex items-center gap-2 text-lg font-semibold text-success-700">
              <FiCheckCircle className="h-6 w-6" aria-hidden /> Paid for {monthLabel(c, month)}
            </p>
          ) : myStatus === "pending" ? (
            <p className="flex items-center gap-2 text-[17px] font-semibold text-warning-700">
              <FiClock className="h-6 w-6" aria-hidden /> Receipt sent. Waiting for the organizer to check.
            </p>
          ) : (
            <>
              {myStatus === "rejected" && (
                <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">Your receipt was sent back: {myPay?.rejectReason || "please send again"}.</p>
              )}
              <Button size="lg" full onClick={() => setPayMonth(month)}>
                {W.pay.en}: <Money value={c.monthlyAmount} />
              </Button>
            </>
          )}
          {myTurn && !isReceiverNow && (
            <p className="text-[15px] text-ink-700">
              <Bi {...W.yourTurn} />: <b>{monthLabel(c, myTurn)}</b> (month {myTurn}) · you get <Money value={potAmount(c, myTurn)} />
            </p>
          )}
        </Card>
      )}

      {c.stage === "finished" && (
        <Card padding="p-5">
          <p className="text-lg font-bold text-ink-900">This BC is complete.</p>
          {c.organizer && <RateOrganizer organizerId={c.organizer._id} organizerName={c.organizer.name} />}
        </Card>
      )}

      {months.length > 1 && (
        <Section title="My payments" urdu="میری ادائیگیاں">
          <Card padding="p-0" className="divide-y divide-line overflow-hidden">
            {months.map((m) => {
              const receiver = beneficiaryId(c, m) === me;
              const st = receiver ? "receiver" : paymentFor(c, m, me)?.status || "unpaid";
              return (
                <div key={m} className="flex min-h-[56px] items-center gap-3 px-4 py-2">
                  <span className="flex-1 text-[15px] text-ink-800">{monthLabel(c, m)}</span>
                  <StatusBadge status={st} label={receiver ? "Your turn" : undefined} />
                  {(st === "unpaid" || st === "rejected") && m !== month && (
                    <Button size="sm" onClick={() => setPayMonth(m)}>
                      Pay
                    </Button>
                  )}
                </div>
              );
            })}
          </Card>
        </Section>
      )}

      {c.result.length > 0 && (
        <Section title={W.turnOrder.en} urdu={W.turnOrder.ur}>
          <Card padding="p-0" className="divide-y divide-line overflow-hidden">
            {Array.from({ length: c.monthDuration }, (_, i) => i + 1).map((m) => {
              const b = beneficiaryFor(c, m);
              const given = payoutFor(c, m);
              const isMe = b?.member === me;
              return (
                <div key={m} className={`flex min-h-[52px] items-center gap-3 px-4 py-2 ${running && m === month ? "bg-primary-50/60" : ""}`}>
                  <span className="w-20 shrink-0 text-sm text-ink-500">{monthLabel(c, m)}</span>
                  <span className={`min-w-0 flex-1 truncate ${isMe ? "font-bold text-primary-800" : "text-ink-900"}`}>{isMe ? "You" : b?.name}</span>
                  {given ? <StatusBadge status="given" /> : running && m === month ? <StatusBadge status="receiver" label="This month" /> : null}
                </div>
              );
            })}
          </Card>
        </Section>
      )}

      {c.organizer && (
        <Section title="Organizer" urdu="منتظم">
          <Card padding="p-4" className="flex flex-wrap items-center gap-3">
            <Avatar name={c.organizer.name} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink-900">{c.organizer.name}</p>
              {c.organizer.verificationStatus === "verified" && <StatusBadge status="verifiedId" />}
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button variant="secondary" icon={FiMessageCircle} onClick={() => setChat(true)} className="flex-1 sm:flex-none">
                Message
              </Button>
              {c.organizer.phone && (
                <Button variant="secondary" icon={FaWhatsapp} href={waLink(c.organizer.phone, `Assalam o Alaikum, about ${c.name}:`)} className="flex-1 sm:flex-none">
                  WhatsApp
                </Button>
              )}
            </div>
          </Card>
        </Section>
      )}

      <Section title="Members" urdu="ممبرز" count={c.members.length}>
        <Card padding="p-4">
          <p className="text-[15px] leading-7 text-ink-800">{c.members.map((m) => (m._id === me ? "You" : m.name)).join(" · ")}</p>
        </Card>
      </Section>

      {c.description && (
        <Section title="Notes from organizer" urdu="منتظم کی ہدایات">
          <Card padding="p-4">
            <p className="whitespace-pre-wrap text-[15px] text-ink-800">{c.description}</p>
          </Card>
        </Section>
      )}

      <PaySheet open={!!payMonth} month={payMonth} onClose={() => setPayMonth(null)} c={c} onPaid={reload} />
      {c.organizer && <ChatBox open={chat} onClose={() => setChat(false)} scope="member" otherId={c.organizer._id} otherModel="Admin" otherName={c.organizer.name} committeeId={c._id} />}
    </Page>
  );
}

function NotMemberYet({ c, reload }) {
  const cancel = async () => {
    try {
      await memberApi.post(`/api/committee/${c._id}/request`, { action: "cancel" });
      toast.success("Request cancelled.");
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const ask = async () => {
    try {
      await memberApi.post(`/api/committee/${c._id}/request`, {});
      toast.success("Request sent.");
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <Page title={c.name} back="/userDash">
      <Card padding="p-5" className="space-y-3">
        <p className="text-ink-700">
          Organized by <b>{c.organizer?.name}</b> · <Money value={c.monthlyAmount} /> a month · {c.membersCount}/{c.maxMembers} members · starts {monthLabel(c, 1)}
        </p>
        {c.isPending ? (
          <>
            <StatusBadge status="pending" label="Request sent. Waiting for the organizer." />
            <Button variant="secondary" full onClick={cancel}>
              Cancel request
            </Button>
          </>
        ) : (
          <Button full size="lg" onClick={ask} disabled={c.spotsLeft === 0}>
            <Bi {...W.askToJoin} />
          </Button>
        )}
      </Card>
    </Page>
  );
}
