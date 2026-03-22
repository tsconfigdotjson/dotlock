import { Link } from "react-router-dom";

export function SidebarLink({
  to,
  label,
  active,
  hasDrift,
}: {
  to: string;
  label: string;
  active: boolean;
  hasDrift?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 w-full text-left px-2.5 py-1 rounded-md text-[13px] transition-colors ${
        active
          ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-medium"
          : "text-gray-600 dark:text-gray-400 hover:bg-black/[0.03] dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <span className="truncate">{label}</span>
      {hasDrift && (
        <span
          className="ml-auto w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0"
          title="Files out of sync"
        />
      )}
    </Link>
  );
}
