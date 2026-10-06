import Link from "next/link";
import Avatar from "./Avatar";

/** Row: avatar/icon, title, subtitle, right side. Use inside a Card with padding="p-0" and divide-y. */
export default function ListRow({ title, subtitle, right, avatar, icon: Icon, href, onClick, className = "" }) {
  const body = (
    <div className={`flex min-h-[60px] items-center gap-3 px-4 py-3 ${className}`}>
      {avatar !== undefined ? (
        <Avatar name={avatar} />
      ) : (
        Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-200 text-ink-600">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold text-ink-900">{title}</div>
        {subtitle && <div className="truncate text-[13px] text-ink-500">{subtitle}</div>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block hover:bg-surface-100">
        {body}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left hover:bg-surface-100">
        {body}
      </button>
    );
  }
  return body;
}
