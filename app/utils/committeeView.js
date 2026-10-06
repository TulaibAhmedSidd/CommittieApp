import Committee from "../api/models/Committee";
import { MEMBER_FOR_OWNER, ADMIN_FOR_MEMBER } from "./fields";
import {
  stage, idOf, beneficiaryFor, whoMustPay, paymentStatus, potAmount, todoCounts,
  myTurnMonths, totalMonths, payoutFor, plannedPot,
} from "./bcRules";

// What each kind of viewer gets back for a BC. Never sends password hashes or KYC data.

export async function loadCommitteeFull(id) {
  return Committee.findById(id)
    .populate({ path: "members", select: MEMBER_FOR_OWNER, model: "Member" })
    .populate({ path: "pendingMembers", select: MEMBER_FOR_OWNER, model: "Member" })
    .populate({ path: "result.member", select: "name", model: "Member" })
    .populate({ path: "createdBy", select: ADMIN_FOR_MEMBER + " referralCode", model: "Admin" })
    .lean();
}

function basics(c) {
  return {
    _id: String(c._id),
    name: c.name,
    description: c.description || "",
    status: c.status,
    stage: stage(c),
    monthlyAmount: c.monthlyAmount,
    maxMembers: c.maxMembers,
    monthDuration: totalMonths(c),
    currentMonth: c.currentMonth || 1,
    startDate: c.startDate,
    endDate: c.endDate,
    organizerFee: c.organizerFee || 0,
    isFeeMandatory: !!c.isFeeMandatory,
    requireDocuments: !!c.requireDocuments,
    mandatoryDocuments: c.mandatoryDocuments || [],
    rulesVersion: c.rulesVersion || 1,
    payoutOrderMode: c.payoutOrderMode || null,
    startedAt: c.startedAt,
    finishedAt: c.finishedAt,
    endedEarly: !!c.endedEarly,
    membersCount: c.members?.length || 0,
    pot: c.result?.length ? potAmount(c) : plannedPot(c.monthlyAmount, c.maxMembers),
  };
}

function organizerOf(c) {
  const o = c.createdBy;
  if (!o || !o._id) return null;
  return { _id: String(o._id), name: o.name, phone: o.phone ? String(o.phone) : "", city: o.city || "", verificationStatus: o.verificationStatus };
}

const resultList = (c) =>
  (c.result || [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((r) => ({ position: r.position, member: idOf(r.member), memberId: idOf(r.member), name: r.member?.name || "" }));

const memberRow = (m) => ({
  _id: String(m._id),
  name: m.name,
  phone: m.phone ? String(m.phone) : "",
  email: m.email || "",
  city: m.city || "",
  verificationStatus: m.verificationStatus,
  payoutDetails: m.payoutDetails || null,
});

/** Organizer who owns the BC. */
export function ownerView(c) {
  return {
    ...basics(c),
    bankDetails: c.bankDetails || {},
    members: (c.members || []).filter((m) => m && m._id).map(memberRow),
    // People who only asked to join: no phone, email or bank details until approved.
    pendingMembers: (c.pendingMembers || []).filter((m) => m && m._id).map((m) => ({ _id: String(m._id), name: m.name, city: m.city || "", verificationStatus: m.verificationStatus })),
    result: resultList(c),
    payments: (c.payments || []).map((p) => ({
      _id: String(p._id),
      month: p.month,
      member: idOf(p.member),
      status: p.status,
      method: p.method || "online",
      submission: p.submission || {},
      rejectReason: p.rejectReason || "",
      reviewedAt: p.reviewedAt,
    })),
    payouts: (c.payouts || []).map((p) => ({ month: p.month, member: idOf(p.member), amount: p.amount, method: p.method || "online", transactionId: p.transactionId || "", screenshot: p.screenshot || "", paidAt: p.paidAt })),
    organizer: organizerOf(c),
    isOwner: true,
  };
}

/** A member of this BC. Sees everyone's paid/unpaid status but only their own receipts. */
export function memberView(c, memberId) {
  const me = String(memberId);
  return {
    ...basics(c),
    bankDetails: c.bankDetails || {},
    members: (c.members || []).filter((m) => m && m._id).map((m) => ({ _id: String(m._id), name: m.name, verificationStatus: m.verificationStatus })),
    result: resultList(c),
    payments: (c.payments || []).map((p) => {
      const mine = idOf(p.member) === me;
      return {
        month: p.month,
        member: idOf(p.member),
        status: p.status,
        method: p.method || "online",
        ...(mine ? { submission: p.submission || {}, rejectReason: p.rejectReason || "" } : {}),
      };
    }),
    payouts: (c.payouts || []).map((p) => ({
      month: p.month,
      member: idOf(p.member),
      amount: p.amount,
      method: p.method || "online",
      paidAt: p.paidAt,
      ...(idOf(p.member) === me ? { screenshot: p.screenshot || "", transactionId: p.transactionId || "" } : {}),
    })),
    organizer: organizerOf(c),
    myTurnMonths: myTurnMonths(c, me),
    isMember: true,
  };
}

/** Anyone (public link). Only for BCs that are coming up. */
export function publicView(c, viewerId) {
  const v = viewerId ? String(viewerId) : null;
  return {
    ...basics(c),
    organizer: organizerOf(c) ? { ...organizerOf(c), phone: undefined } : null,
    referralCode: c.createdBy?.referralCode || null,
    isPending: v ? (c.pendingMembers || []).some((m) => idOf(m) === v) : false,
    isMember: v ? (c.members || []).some((m) => idOf(m) === v) : false,
    spotsLeft: Math.max((c.maxMembers || 0) - (c.members?.length || 0) - (c.pendingMembers?.length || 0), 0),
  };
}

/** Small card for lists (organizer home, member home). c is a lean doc with result.member populated (name). */
export function cardSummary(c, memberId) {
  const month = c.currentMonth || 1;
  const s = stage(c);
  const receiver = s === "running" ? beneficiaryFor(c, month) : null;
  const payers = s === "running" ? whoMustPay(c, month) : [];
  const paid = payers.filter((id) => paymentStatus(c, month, id) === "verified").length;
  const card = {
    ...basics(c),
    pendingCount: c.pendingMembers?.length || 0,
    receiverName: receiver?.member?.name || null,
    receiverId: receiver ? idOf(receiver.member) : null,
    paidCount: paid,
    payersCount: payers.length,
    payoutGiven: s === "running" ? !!payoutFor(c, month) : false,
    ...todoCounts(c),
    organizerName: c.createdBy?.name || null,
  };
  if (memberId) {
    const me = String(memberId);
    card.myStatus = s === "running" ? (receiver && idOf(receiver.member) === me ? "receiver" : paymentStatus(c, month, me)) : null;
    card.myTurnMonths = myTurnMonths(c, me);
  }
  return card;
}
