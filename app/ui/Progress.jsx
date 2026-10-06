/** "Month 3 of 10" bar. */
export default function Progress({ current = 0, total = 1, label, className = "" }) {
  const pct = Math.min(100, Math.max(0, total ? (current / total) * 100 : 0));
  return (
    <div className={className}>
      {label !== false && (
        <div className="mb-1 flex justify-between text-[13px] text-ink-600">
          <span>{label || `Month ${current} of ${total}`}</span>
          <span className="tabular-nums">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-surface-200" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
        <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
