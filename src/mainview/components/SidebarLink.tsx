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
  const activeStyle = active
    ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-medium"
    : "text-gray-600 dark:text-gray-400 hover:bg-black/[0.03] dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200";
  const unlinkedStyle = unlinked
    ? "text-gray-400 dark:text-gray-500 italic hover:text-gray-600 dark:hover:text-gray-300"
    : activeStyle;

  const children = (
    <>
      <span className="truncate">{label}</span>
      {unlinked && (
        <span
          className="ml-auto text-gray-400 dark:text-gray-500"
          title="Unlinked — click to locate on disk"
        >
          <FolderSearchIcon size={12} />
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
      <Link to={props.to} className={`${base} ${unlinkedStyle}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={(props as ButtonProps).onClick}
      className={`${base} ${unlinkedStyle}`}
    >
      {children}
    </button>
  );
}
