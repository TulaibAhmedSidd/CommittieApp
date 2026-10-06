export function appOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || "";
}

export const shortMonth = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "");
export const displayPhone = (p) => (p ? String(p).replace(/^\+92/, "0") : "");
