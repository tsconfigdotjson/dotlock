import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import type { KeyEntry, Repo } from "../types";
import { PROVIDERS } from "../data/mockData";
import { useRepos } from "../App";
import { timeAgo } from "../utils";
import {
  LockIcon,
  ChevronLeftIcon,
  FileIcon,
  EyeIcon,
  EyeSlashIcon,
  CopyIcon,
  CheckIcon,
  PencilIcon,
} from "./icons";

function getTotalKeys(repo: Repo): number {
  return repo.envFiles.reduce((sum, f) => sum + f.keys.length, 0);
}

function EditKeyModal({
  entry,
  onClose,
}: {
  entry: KeyEntry;
  onClose: () => void;
}) {
  const [value, setValue] = useState(entry.value);
  const [provider, setProvider] = useState(entry.provider || "");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="absolute inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#2a2a2a] rounded-xl shadow-2xl dark:shadow-black/40 border border-gray-200/60 dark:border-white/[0.08] overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <LockIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-[15px] font-semibold font-mono text-gray-900 dark:text-gray-100">
              {entry.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-5">
          {/* Value field */}
          <div>
            <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Value
            </label>
            <div className="relative">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg text-[13px] font-mono bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors resize-none select-text"
                style={
                  !visible
                    ? ({
                        WebkitTextSecurity: "disc",
                      } as React.CSSProperties)
                    : undefined
                }
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute top-2.5 right-2.5 p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </div>
          </div>

          {/* Provider */}
          <div>
            <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-[13px] bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="">None</option>
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Metadata (read-only) */}
          {(entry.addedAt || entry.lastRotated) && (
            <div className="flex items-center gap-4 text-[12px] text-gray-400 dark:text-gray-500 pt-1">
              {entry.addedAt && <span>Added {timeAgo(entry.addedAt)}</span>}
              {entry.lastRotated && (
                <span>Last rotated {timeAgo(entry.lastRotated)}</span>
              )}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02]">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            Delete key
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-white transition-colors shadow-sm"
              style={{ backgroundColor: "var(--system-accent)" }}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyRow({ entry }: { entry: KeyEntry }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [provider, setProvider] = useState(entry.provider || "");
  const [showProviderMenu, setShowProviderMenu] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="group/row rounded-lg border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.1] transition-colors">
        {/* Key header */}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <LockIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
          <span className="text-[13px] font-medium font-mono text-gray-900 dark:text-gray-100">
            {entry.name}
          </span>

          <div className="ml-auto flex items-center gap-1.5">
            {/* Provider badge / selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProviderMenu(!showProviderMenu)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  provider
                    ? "bg-gray-100 dark:bg-white/[0.08] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/[0.12]"
                    : "border border-dashed border-gray-300 dark:border-white/[0.15] text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-white/[0.25] hover:text-gray-500 dark:hover:text-gray-400"
                }`}
              >
                {provider || "Provider"}
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {showProviderMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProviderMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-white/[0.1] rounded-lg shadow-lg dark:shadow-black/30 py-1 max-h-52 overflow-y-auto">
                    {provider && (
                      <button
                        type="button"
                        onClick={() => {
                          setProvider("");
                          setShowProviderMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[12px] text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                      >
                        None
                      </button>
                    )}
                    {PROVIDERS.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => {
                          setProvider(p);
                          setShowProviderMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors ${
                          provider === p
                            ? "font-medium text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Edit button */}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              title="Edit key"
            >
              <PencilIcon />
            </button>

            {/* Eye toggle */}
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              title={visible ? "Hide value" : "Reveal value"}
            >
              {visible ? <EyeIcon /> : <EyeSlashIcon />}
            </button>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>

        {/* Value input */}
        <div className="px-4 pb-2.5">
          <input
            type={visible ? "text" : "password"}
            value={entry.value}
            readOnly
            className="w-full px-3 py-2 rounded-md text-xs font-mono bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] text-gray-400 dark:text-gray-500 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors select-text"
          />
        </div>

        {/* Metadata */}
        {(entry.addedAt || entry.lastRotated) && (
          <div className="px-4 pb-2.5 flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
            {entry.addedAt && <span>Added {timeAgo(entry.addedAt)}</span>}
            {entry.lastRotated && (
              <span>Rotated {timeAgo(entry.lastRotated)}</span>
            )}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing &&
        createPortal(
          <EditKeyModal entry={entry} onClose={() => setEditing(false)} />,
          document.body,
        )}
    </>
  );
}

export function RepoDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { repos } = useRepos();
  const repo = repos.find((r) => r.name === name);

  if (!repo) {
    return (
      <>
        <header
          className="h-[72px] shrink-0 flex items-center px-6 border-b border-gray-100 dark:border-white/[0.06]"
          style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          >
            <ChevronLeftIcon />
            Back
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
          Repo not found
        </div>
      </>
    );
  }

  const totalKeys = getTotalKeys(repo);

  return (
    <>
      {/* Header */}
      <header
        className="h-[72px] shrink-0 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/[0.06]"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          >
            <ChevronLeftIcon />
          </button>
          <div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {repo.name}
            </h1>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              {totalKeys} keys &middot; {repo.envFiles.length}{" "}
              {repo.envFiles.length === 1 ? "file" : "files"}
            </p>
          </div>
        </div>
      </header>

      {/* Key list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {repo.envFiles.map((envFile) => (
            <section key={envFile.filename}>
              <div className="flex items-center gap-2 mb-3">
                <FileIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <h2 className="text-[13px] font-semibold font-mono text-gray-500 dark:text-gray-400">
                  {envFile.filename}
                </h2>
                <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
                  {envFile.keys.length}
                </span>
              </div>
              <div className="space-y-2">
                {envFile.keys.map((key) => (
                  <KeyRow key={key.name} entry={key} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
