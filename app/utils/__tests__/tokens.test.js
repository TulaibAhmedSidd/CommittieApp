import { describe, it, expect } from "vitest";
import { createPasswordLink, isLinkValid, LINK_TTL, randomCode } from "../tokens";

describe("password links", () => {
  it("stores only a hash and validates the raw token", () => {
    const doc = {};
    const raw = createPasswordLink(doc, "invite", 1000);
    expect(doc.passwordLink.hash).not.toBe(raw);
    expect(doc.passwordLink.purpose).toBe("invite");
    expect(isLinkValid(doc, raw, 2000)).toBe(true);
    expect(isLinkValid(doc, raw + "x", 2000)).toBe(false);
  });

  it("expires", () => {
    const doc = {};
    const raw = createPasswordLink(doc, "reset", 0);
    expect(isLinkValid(doc, raw, LINK_TTL.reset - 1)).toBe(true);
    expect(isLinkValid(doc, raw, LINK_TTL.reset + 1)).toBe(false);
  });

  it("rejects non-strings and missing links", () => {
    const doc = {};
    createPasswordLink(doc, "reset");
    expect(isLinkValid(doc, { $ne: null })).toBe(false);
    expect(isLinkValid({}, "a".repeat(43))).toBe(false);
  });

  it("makes readable codes", () => {
    expect(randomCode()).toMatch(/^REF-[A-Z2-9]{6}$/);
  });
});
