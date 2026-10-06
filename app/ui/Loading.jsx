export function Skeleton({ className = "h-20" }) {
  return <div className={`animate-pulse rounded-xl bg-surface-200 ${className}`} />;
}

/** Full-page loading placeholder: a few grey blocks, no text. */
export default function Loading({ rows = 3 }) {
  return (
    <div className="mx-auto w-full max-w-page space-y-4 px-4 pt-6 sm:px-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-1/2" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-danger-100 bg-danger-50 p-4 text-danger-700">
      <p className="font-medium">{message || "Something went wrong."}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-2 text-sm font-semibold underline">
          Try again
        </button>
      )}
    </div>
  );
}
