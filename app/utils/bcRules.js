// BC (committee) rules. Pure functions: no database, safe on server and client.
//
// Rules:
// - Each month one member (the "receiver") gets the pot. Order is in committee.result.
// - The receiver does NOT pay in their own month. Everyone else pays monthlyAmount.
// - Pot = monthlyAmount x (number of payers).
// - Next month needs: every payer verified AND this month's payout recorded.
// - New BCs (rulesVersion 2): months = members. Old BCs may have more months than
//   members; then the order wraps around.

export const idOf = (x) => (x && x._id ? String(x._id) : x ? String(x) : "");

export function totalMonths(c) {
  return Number(c?.monthDuration) || Number(c?.maxMembers) || 0;
}

/** "upcoming" (Coming up), "running" (Running now) or "finished". */
export function stage(c) {
  if (!c) return "upcoming";
  if (c.status === "finished") return "finished";
  if (c.status === "ongoing") return "running";
  if (c.status === "full" && ((c.result?.length || 0) > 0 || (c.payments?.length || 0) > 0)) return "running";
  return "upcoming";
}

/** The result entry (receiver) for a month, or null if no order yet. */
export function beneficiaryFor(c, month) {
  const result = c?.result || [];
  if (!result.length || !month) return null;
  const position = ((Number(month) - 1) % result.length) + 1;
  return result.find((r) => Number(r.position) === position) || null;
}

export function beneficiaryId(c, month) {
  const b = beneficiaryFor(c, month);
  return b ? idOf(b.member) : null;
}

/** Member ids that must pay for this month (everyone except the receiver). */
export function whoMustPay(c, month) {
  const receiver = beneficiaryId(c, month);
  return (c?.members || []).map(idOf).filter((id) => id && id !== receiver);
}

export function potAmount(c, month) {
  const m = month || c?.currentMonth || 1;
  const payers = c?.result?.length ? whoMustPay(c, m).length : Math.max((c?.members?.length || c?.maxMembers || 0) - 1, 0);
  return (Number(c?.monthlyAmount) || 0) * payers;
}

/** Planned pot for a BC that has not started (members - 1 payers). */
export function plannedPot(monthlyAmount, members) {
  return (Number(monthlyAmount) || 0) * Math.max((Number(members) || 0) - 1, 0);
}

/** Best payment entry for a member+month (verified wins over pending over others). */
export function paymentFor(c, month, memberId) {
  const mid = idOf(memberId);
  const list = (c?.payments || []).filter((p) => Number(p.month) === Number(month) && idOf(p.member) === mid);
  const rank = { verified: 3, pending: 2, rejected: 1, unpaid: 0 };
  return list.sort((a, b) => (rank[b.status] || 0) - (rank[a.status] || 0))[0] || null;
}

export function paymentStatus(c, month, memberId) {
  return paymentFor(c, month, memberId)?.status || "unpaid";
}

export function payoutFor(c, month) {
  return (c?.payouts || []).find((p) => Number(p.month) === Number(month)) || null;
}

export function isLastMonth(c) {
  return (Number(c?.currentMonth) || 1) >= totalMonths(c);
}

export function canStart(c) {
  if (stage(c) !== "upcoming") return { ok: false, reason: "This BC has already started." };
  const n = c?.members?.length || 0;
  if (n < 2) return { ok: false, reason: "Add at least 2 members first." };
  if (n !== Number(c.maxMembers)) return { ok: false, reason: `Need ${c.maxMembers} members. Now ${n}.` };
  return { ok: true };
}

/** Can the organizer move to the next month (or finish on the last month)? */
export function canAdvance(c) {
  if (stage(c) !== "running") return { ok: false, unpaid: [], needsPayout: false, reason: "BC is not running." };
  const month = Number(c.currentMonth) || 1;
  const unpaid = whoMustPay(c, month).filter((id) => paymentStatus(c, month, id) !== "verified");
  const needsPayout = !!beneficiaryFor(c, month) && !payoutFor(c, month);
  let reason = "";
  if (unpaid.length) reason = `${unpaid.length} member(s) have not paid yet.`;
  else if (needsPayout) reason = "Give this month's payout first.";
  return { ok: !unpaid.length && !needsPayout, unpaid, needsPayout, reason };
}

/** Months (1-based) in which this member receives the pot. */
export function myTurnMonths(c, memberId) {
  const mid = idOf(memberId);
  const result = c?.result || [];
  if (!result.length) return [];
  const months = [];
  for (let m = 1; m <= totalMonths(c); m++) {
    if (beneficiaryId(c, m) === mid) months.push(m);
  }
  return months;
}

/** Calendar date of a BC month (month 1 = startDate). */
export function monthDate(c, month) {
  if (!c?.startDate) return null;
  const d = new Date(c.startDate);
  d.setMonth(d.getMonth() + (Number(month) - 1));
  return d;
}

export function monthLabel(c, month) {
  const d = monthDate(c, month);
  return d ? d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : `Month ${month}`;
}

/** Counts for the organizer's to-do strip. */
export function todoCounts(c) {
  const month = Number(c?.currentMonth) || 1;
  const receiptsToCheck = stage(c) === "running" ? (c.payments || []).filter((p) => Number(p.month) === month && p.status === "pending").length : 0;
  const joinRequests = stage(c) === "upcoming" ? c?.pendingMembers?.length || 0 : 0;
  return { receiptsToCheck, joinRequests };
}

/** Fisher-Yates shuffle with an injectable random int (crypto on server). */
export function shuffle(list, randomInt = (n) => Math.floor(Math.random() * n)) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
