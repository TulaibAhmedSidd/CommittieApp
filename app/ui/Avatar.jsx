const COLORS = ["bg-primary-100 text-primary-800", "bg-info-100 text-info-700", "bg-warning-100 text-warning-700", "bg-surface-300 text-ink-700"];

export default function Avatar({ name = "", size = "md" }) {
  const initials = String(name).trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "?";
  const color = COLORS[(String(name).charCodeAt(0) || 0) % COLORS.length];
  const dim = size === "lg" ? "h-14 w-14 text-lg" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return <span className={`flex shrink-0 items-center justify-center rounded-full font-bold ${dim} ${color}`} aria-hidden>{initials}</span>;
}
