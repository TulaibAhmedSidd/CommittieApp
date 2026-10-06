import { describe, it, expect } from "vitest";
import { normalizePkPhone, parseIdentifier, phoneLookupVariants, formatPkPhone, normalizeEmail } from "../phone";
import { waLink } from "../whatsapp";

describe("normalizePkPhone", () => {
  it.each([
    ["03001234567", "+923001234567"],
    ["0300-1234567", "+923001234567"],
    ["0300 123 4567", "+923001234567"],
    ["3001234567", "+923001234567"],
    [3001234567, "+923001234567"],
    ["923001234567", "+923001234567"],
    ["+923001234567", "+923001234567"],
    ["00923001234567", "+923001234567"],
  ])("%s -> %s", (input, out) => {
    expect(normalizePkPhone(input)).toBe(out);
  });

  it.each(["", null, undefined, "12345", "0421234567", "04212345678", "abc", "+14155550100"])("rejects %s", (input) => {
    expect(normalizePkPhone(input)).toBeNull();
  });
});

describe("parseIdentifier", () => {
  it("detects email", () => expect(parseIdentifier("  Ali@Mail.com ")).toEqual({ email: "ali@mail.com" }));
  it("detects phone", () => expect(parseIdentifier("0300 1234567")).toEqual({ phone: "+923001234567" }));
  it("rejects junk", () => {
    expect(parseIdentifier("hello")).toBeNull();
    expect(parseIdentifier({ $ne: null })).toBeNull();
  });
});

describe("helpers", () => {
  it("lookup variants include the old numeric form", () => {
    expect(phoneLookupVariants("03001234567")).toContain(3001234567);
  });
  it("formats for display", () => expect(formatPkPhone("+923001234567")).toBe("0300 1234567"));
  it("email must be a string", () => expect(normalizeEmail({ $gt: "" })).toBeNull());
});

describe("waLink", () => {
  it("opens chat with a phone", () => {
    expect(waLink("03001234567", "Hi there")).toBe("https://wa.me/923001234567?text=Hi%20there");
  });
  it("opens share picker without a phone", () => {
    expect(waLink(null, "Join")).toBe("https://wa.me/?text=Join");
  });
});
