import { describe, it, expect } from "vitest";
import {
  stage, beneficiaryId, whoMustPay, potAmount, canStart, canAdvance, isLastMonth,
  myTurnMonths, plannedPot, shuffle, todoCounts,
} from "../bcRules";

const bc = (over = {}) => ({
  status: "ongoing",
  maxMembers: 3,
  monthDuration: 3,
  monthlyAmount: 10000,
  currentMonth: 1,
  members: ["a", "b", "c"],
  result: [{ member: "b", position: 1 }, { member: "c", position: 2 }, { member: "a", position: 3 }],
  payments: [],
  payouts: [],
  pendingMembers: [],
  ...over,
});

describe("stage", () => {
  it("maps statuses", () => {
    expect(stage({ status: "open" })).toBe("upcoming");
    expect(stage({ status: "full" })).toBe("upcoming");
    expect(stage({ status: "full", result: [{}] })).toBe("running");
    expect(stage({ status: "ongoing" })).toBe("running");
    expect(stage({ status: "finished" })).toBe("finished");
  });
});

describe("receiver and payers", () => {
  it("receiver skips paying", () => {
    expect(beneficiaryId(bc(), 1)).toBe("b");
    expect(whoMustPay(bc(), 1)).toEqual(["a", "c"]);
    expect(potAmount(bc(), 1)).toBe(20000);
    expect(plannedPot(10000, 10)).toBe(90000);
  });

  it("wraps around for old BCs with more months than members", () => {
    const old = bc({ monthDuration: 6 });
    expect(beneficiaryId(old, 4)).toBe("b");
    expect(myTurnMonths(old, "a")).toEqual([3, 6]);
  });
});

describe("canStart", () => {
  it("needs a full BC", () => {
    expect(canStart(bc({ status: "open", result: [], members: ["a", "b"] })).ok).toBe(false);
    expect(canStart(bc({ status: "open", result: [] })).ok).toBe(true);
    expect(canStart(bc()).ok).toBe(false);
  });
});

describe("canAdvance", () => {
  it("blocks until payers are verified and payout is given", () => {
    let c = bc();
    expect(canAdvance(c).unpaid).toEqual(["a", "c"]);
    c = bc({ payments: [{ month: 1, member: "a", status: "verified" }, { month: 1, member: "c", status: "pending" }] });
    expect(canAdvance(c).unpaid).toEqual(["c"]);
    c = bc({ payments: [{ month: 1, member: "a", status: "verified" }, { month: 1, member: "c", status: "verified" }] });
    expect(canAdvance(c)).toMatchObject({ ok: false, needsPayout: true });
    c.payouts = [{ month: 1, member: "b" }];
    expect(canAdvance(c).ok).toBe(true);
  });

  it("knows the last month", () => {
    expect(isLastMonth(bc({ currentMonth: 3 }))).toBe(true);
    expect(isLastMonth(bc({ currentMonth: 2 }))).toBe(false);
  });
});

describe("misc", () => {
  it("shuffle keeps all items", () => {
    expect(shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
  it("todo counts", () => {
    expect(todoCounts(bc({ payments: [{ month: 1, member: "a", status: "pending" }] })).receiptsToCheck).toBe(1);
    expect(todoCounts({ status: "open", pendingMembers: ["x", "y"] }).joinRequests).toBe(2);
  });
});
