import { describe, it, expect } from "vitest";
import { safeNext } from "../safeNext";

describe("safeNext", () => {
  it("keeps same-site paths", () => {
    expect(safeNext("/bc/abc", "member")).toBe("/bc/abc");
    expect(safeNext("/userDash/bc/1?pay=1", "member")).toBe("/userDash/bc/1?pay=1");
    expect(safeNext("/admin/bc/1", "admin")).toBe("/admin/bc/1");
  });

  it.each(["//evil.com", "/\\evil.com", "https://evil.com", "javascript:alert(1)", "evil.com", "/%0d//evil.com\\", null, undefined, 42])("blocks %s", (bad) => {
    expect(safeNext(bad, "member")).toBe("/userDash");
  });

  it("keeps people in their own area", () => {
    expect(safeNext("/admin", "member")).toBe("/userDash");
    expect(safeNext("/userDash", "admin")).toBe("/admin");
  });
});
