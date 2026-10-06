// Where to go after login/register. Only same-site paths are allowed (blocks open redirects
// like "//evil.com", "/\evil.com", "https://evil.com").

export function safeNext(next, scope = "member") {
  const home = scope === "admin" ? "/admin" : "/userDash";
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return home;
  if (/[\u0000-\u001f]/.test(next)) return home;
  try {
    const base = "https://app.invalid";
    const url = new URL(next, base);
    if (url.origin !== base) return home;
    const path = url.pathname + url.search + url.hash;
    if (scope === "admin" && path.startsWith("/userDash")) return home;
    if (scope === "member" && path.startsWith("/admin")) return home;
    return path;
  } catch {
    return home;
  }
}
