"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FiGift, FiArrowRight, FiCheckCircle, FiBell, FiEye, FiDollarSign } from "react-icons/fi";
import { Card, Section, Button, Progress, Money, StatusBadge, Avatar, Bi, useConfirm } from "../../../../ui";
import { W } from "../../../../utils/words";
import { adminApi } from "../../../../utils/api";
import { beneficiaryId, canAdvance, isLastMonth, paymentFor, payoutFor, potAmount, monthLabel } from "../../../../utils/bcRules";
import ReceiptSheet from "./ReceiptSheet";
import PayoutSheet from "./PayoutSheet";
import MemberSheet from "./MemberSheet";

export default function RunningView({ c, reload }) {
  const confirm = useConfirm();
  const month = c.currentMonth;
  const receiverId = beneficiaryId(c, month);
  const receiver = c.members.find((m) => m._id === receiverId);
  const payout = payoutFor(c, month);
  const pot = potAmount(c, month);
  const check = canAdvance(c);
  const last = isLastMonth(c);
  const [receiptFor, setReceiptFor] = useState(null);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [person, setPerson] = useState(null);
  const [busy, setBusy] = useState("");

  const payers = c.members.filter((m) => m._id !== receiverId);
  const paidCount = payers.filter((m) => paymentFor(c, month, m._id)?.status === "verified").length;
  // Waiting for check first, then not paid, then paid.
  const order = { pending: 0, rejected: 1, unpaid: 1, verified: 2 };
  const rows = [...payers].sort((a, b) => order[paymentFor(c, month, a._id)?.status || "unpaid"] - order[paymentFor(c, month, b._id)?.status || "unpaid"]);

  const markCash = async (m) => {
    if (!(await confirm({ title: `Did ${m.name} pay in cash?`, text: `This marks Rs ${c.monthlyAmount.toLocaleString()} for ${monthLabel(c, month)} as paid.`, confirmText: "Yes, paid" }))) return;
    setBusy(m._id + "cash");
    try {
      await adminApi.patch(`/api/committee/${c._id}/payment`, { action: "mark_cash", memberId: m._id, month });
      toast.success(`${m.name} marked as paid.`);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  const remind = async (m) => {
    setBusy(m._id + "ping");
    try {
      const { waLink } = await adminApi.post(`/api/committee/${c._id}/ping`, { memberId: m._id });
      toast.success("Reminder sent in the app.");
      if (waLink && m.phone) window.open(waLink, "_blank", "noopener");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  const advance = async () => {
    const ok = await confirm(
      last
        ? { title: "Finish this BC?", text: "All turns are done. Members will be told the BC is complete.", confirmText: "Finish BC" }
        : { title: `Move to month ${month + 1}?`, text: `${monthLabel(c, month + 1)} starts. Members will be asked to pay.`, confirmText: "Next month" }
    );
    if (!ok) return;
    setBusy("advance");
    try {
      await adminApi.patch(`/api/committee/${c._id}/status`, { action: "advance_month" });
      toast.success(last ? "BC finished. Well done!" : `Month ${month + 1} started.`);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      {/* This month */}
      <Card padding="p-5" className="space-y-4">
        <Progress current={month} total={c.monthDuration} label={`Month ${month} of ${c.monthDuration} · ${monthLabel(c, month)}`} />
        {receiver && (
          <div className="flex items-center gap-3 rounded-xl bg-primary-50 p-3">
            <Avatar name={receiver.name} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-primary-800">
                <Bi {...W.getsThePot} />
              </p>
              <p className="truncate text-lg font-bold text-ink-900">{receiver.name}</p>
            </div>
            <Money value={payout?.amount || pot} size="lg" className="text-primary-800" />
          </div>
        )}
        <div className="flex items-center justify-between text-[15px]">
          <span className="text-ink-700">
            <b className="text-ink-900">{paidCount}</b> of {payers.length} paid
          </span>
          {payout ? <StatusBadge status="given" label="Payout given" tone="green" /> : null}
        </div>
        <NextStep c={c} check={check} payout={payout} receiver={receiver} last={last} busy={busy} onPayout={() => setPayoutOpen(true)} onAdvance={advance} />
      </Card>

      {/* Members */}
      <Section title="This month's payments" urdu="اس ماہ کی ادائیگیاں">
        <Card padding="p-0" className="divide-y divide-line overflow-hidden">
          {rows.map((m) => {
            const p = paymentFor(c, month, m._id);
            const status = p?.status || "unpaid";
            return (
              <div key={m._id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
                <button type="button" onClick={() => setPerson(m)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <Avatar name={m.name} />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink-900">{m.name}</span>
                    <StatusBadge status={status} label={status === "verified" && p?.method === "cash" ? "Paid (cash)" : undefined} tone={status === "verified" ? "green" : undefined} />
                  </span>
                </button>
                <div className="flex gap-2 pl-[52px] sm:pl-0">
                  {status === "pending" && (
                    <Button size="sm" icon={FiEye} onClick={() => setReceiptFor(m)}>
                      Check receipt
                    </Button>
                  )}
                  {(status === "unpaid" || status === "rejected") && (
                    <>
                      <Button size="sm" variant="secondary" icon={FiDollarSign} onClick={() => markCash(m)} loading={busy === m._id + "cash"}>
                        {W.markCash.en}
                      </Button>
                      <Button size="sm" variant="ghost" icon={FiBell} onClick={() => remind(m)} loading={busy === m._id + "ping"}>
                        {W.remind.en}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      </Section>

      <ReceiptSheet member={receiptFor} onClose={() => setReceiptFor(null)} c={c} month={month} onDone={reload} />
      <PayoutSheet open={payoutOpen} onClose={() => setPayoutOpen(false)} c={c} receiver={receiver} pot={pot} onDone={reload} />
      <MemberSheet member={person} onClose={() => setPerson(null)} c={c} onChanged={reload} />
    </>
  );
}

function NextStep({ check, payout, receiver, last, busy, onPayout, onAdvance }) {
  if (check.unpaid.length) {
    return (
      <div className="rounded-xl bg-surface-100 px-4 py-3 text-sm text-ink-700">
        Waiting for <b>{check.unpaid.length}</b> payment{check.unpaid.length > 1 ? "s" : ""}. Then give the payout to {receiver?.name || "the receiver"}.
      </div>
    );
  }
  if (!payout) {
    return (
      <Button size="lg" full icon={FiGift} onClick={onPayout}>
        <Bi en={`Give payout to ${receiver?.name || "receiver"}`} ur="رقم دیں" />
      </Button>
    );
  }
  return (
    <Button size="lg" full icon={last ? FiCheckCircle : FiArrowRight} onClick={onAdvance} loading={busy === "advance"}>
      <Bi {...(last ? W.finishBc : W.nextMonth)} />
    </Button>
  );
}
