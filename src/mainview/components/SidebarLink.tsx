import { Link } from "react-router-dom";
import { FolderSearchIcon } from "./icons";

type CommonProps = {
  label: string;
  active?: boolean;
  hasDrift?: boolean;
};

type LinkProps = CommonProps & {
  to: string;
  onClick?: never;
  unlinked?: false;
};

type ButtonProps = CommonProps & {
  to?: never;
  onClick: () => void;
  unlinked?: boolean;
};

export function SidebarLink(props: LinkProps | ButtonProps) {
  const { label, active = false, hasDrift, unlinked } = props;

  const base =
    "flex items-center gap-2 w-full text-left px-2.5 py-1 rounded-md text-[13px] transition-colors";

  const linkedStyle = active
    ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-medium"
    : "text-gray-600 dark:text-gray-400 hover:bg-black/[0.03] dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200";

  const unlinkedStyle =
    "bg-amber-50/70 dark:bg-amber-500/[0.08] text-amber-700 dark:text-amber-300 border border-dashed border-amber-300/60 dark:border-amber-500/25 hover:bg-amber-100/70 dark:hover:bg-amber-500/[0.14]";

  const className = `${base} ${unlinked ? unlinkedStyle : linkedStyle}`;

  const children = (
    <>
      <span className="truncate">{label}</span>
      {unlinked && (
        <span className="ml-auto flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide">
          <FolderSearchIcon size={11} />
          Locate
        </span>
      )}
      {hasDrift && !unlinked && (
        <span
          className="ml-auto w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0"
          title="Files out of sync"
        />
      )}
    </>
  );

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={(props as ButtonProps).onClick}
      aria-label={unlinked ? `Locate ${label} on disk` : label}
      className={className}
    >
      {children}
    </button>
  );
}
