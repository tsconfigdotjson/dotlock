import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { driftCount, useRepos } from "../App";
import type { EnvFile, KeyEntry, Repo, SyncStatus } from "../types";

const PROVIDERS = [
  "AWS",
  "Cloudflare",
  "DigitalOcean",
  "Hetzner",
  "Vercel",
  "Heroku",
  "Fly.io",
  "Railway",
  "Supabase",
  "PlanetScale",
  "Stripe",
  "SendGrid",
  "Datadog",
  "Sentry",
] as const;

import * as rpc from "../rpc";
import { timeAgo } from "../utils";
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  CopyIcon,
  EyeIcon,
  EyeSlashIcon,
  FileIcon,
  FileWarningIcon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  XIcon,
} from "./icons";

function getTotalKeys(repo: Repo): number {
  return repo.envFiles.reduce((sum, f) => sum + f.keys.length, 0);
}

// ---------------------------------------------------------------------------
// Drift banner (shown at top of repo when any file is out of sync)
// ---------------------------------------------------------------------------

function DriftBanner({ repo }: { repo: Repo }) {
  const drifted = driftCount(repo);
  if (drifted === 0) {
    return null;
  }

  const changedCount = repo.envFiles.filter(
    (f) => f.syncStatus === "disk_changed",
  ).length;
  const missingCount = repo.envFiles.filter(
    (f) => f.syncStatus === "missing",
  ).length;

  const parts: string[] = [];
  if (changedCount > 0) {
    parts.push(
      `${changedCount} ${changedCount === 1 ? "file" : "files"} changed on disk`,
    );
  }
  if (missingCount > 0) {
    parts.push(
      `${missingCount} ${missingCount === 1 ? "file" : "files"} missing from disk`,
    );
  }

  return (
    <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-500/[0.08] border border-amber-200/60 dark:border-amber-500/20">
      <div className="flex items-start gap-3">
        <AlertTriangleIcon
          size={16}
          className="text-amber-500 dark:text-amber-400 mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-amber-800 dark:text-amber-200">
            {parts.join(", ")}
          </p>
          <p className="text-[12px] text-amber-600/80 dark:text-amber-300/60 mt-0.5">
            Your vault may differ from what&rsquo;s on disk. Review each file to
            decide whether to import the disk version or restore your vault
            version.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-file sync status badge + inline actions
// ---------------------------------------------------------------------------

function SyncBadge({ status }: { status: SyncStatus }) {
  if (status === "synced") {
    return null;
  }

  const config = {
    disk_changed: {
      label: "Changed on disk",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200/60 dark:border-amber-500/20",
    },
    missing: {
      label: "Missing from disk",
      bg: "bg-red-50 dark:bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200/60 dark:border-red-500/20",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <FileWarningIcon size={10} />
      {config.label}
    </span>
  );
}

function SyncActions({
  repoName,
  envFile,
  onResolved,
}: {
  repoName: string;
  envFile: EnvFile;
  onResolved: (repo: Repo) => void;
}) {
  const [acting, setActing] = useState<"import" | "restore" | null>(null);

  if (envFile.syncStatus === "synced") {
    return null;
  }

  const handleImport = async () => {
    setActing("import");
    const updated = await rpc.importFile(repoName, envFile.absolutePath);
    if (updated) {
      onResolved(updated);
    }
    setActing(null);
  };

  const handleRestore = async () => {
    setActing("restore");
    const updated = await rpc.restoreFile(repoName, envFile.absolutePath);
    if (updated) {
      onResolved(updated);
    }
    setActing(null);
  };

  return (
    <div className="flex items-center gap-1.5">
      {envFile.syncStatus === "disk_changed" && (
        <button
          type="button"
          onClick={handleImport}
          disabled={acting !== null}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-500/25 disabled:opacity-50 transition-colors"
          title="Replace vault with what's on disk"
        >
          <ArrowDownIcon size={11} />
          {acting === "import" ? "Importing..." : "Import from disk"}
        </button>
      )}
      {envFile.syncStatus === "disk_changed" && (
        <button
          type="button"
          onClick={handleRestore}
          disabled={acting !== null}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.1] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.1] disabled:opacity-50 transition-colors"
          title="Write vault version back to disk"
        >
          <ArrowUpIcon size={11} />
          {acting === "restore" ? "Restoring..." : "Restore to disk"}
        </button>
      )}
      {envFile.syncStatus === "missing" && (
        <button
          type="button"
          onClick={handleRestore}
          disabled={acting !== null}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-500/25 disabled:opacity-50 transition-colors"
          title="Re-create the file on disk from vault"
        >
          <ArrowUpIcon size={11} />
          {acting === "restore" ? "Restoring..." : "Restore to disk"}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key modal (shared between edit and add)
// ---------------------------------------------------------------------------

function KeyModal({
  mode,
  entry,
  repoName,
  absolutePath,
  onSaved,
  onClose,
}: {
  mode: "edit" | "add";
  entry: KeyEntry;
  repoName: string;
  absolutePath: string;
  onSaved: (repo: Repo) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(entry.name);
  const [value, setValue] = useState(entry.value);
  const [provider, setProvider] = useState(entry.provider || "");
  const [visible, setVisible] = useState(true);
  const [saving, setSaving] = useState(false);

  const validName = /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
  const canSubmit =
    !saving && (mode === "edit" || (name.trim() !== "" && validName));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = async () => {
    if (!canSubmit) {
      return;
    }
    setSaving(true);
    const updated =
      mode === "edit"
        ? await rpc.editKey(repoName, absolutePath, entry.name, value, provider)
        : await rpc.addKey(
            repoName,
            absolutePath,
            name.trim(),
            value,
            provider,
          );
    setSaving(false);
    if (updated) {
      onSaved(updated);
      onClose();
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    const updated = await rpc.deleteKey(repoName, absolutePath, entry.name);
    setSaving(false);
    if (updated) {
      onSaved(updated);
      onClose();
    }
  };

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
            <LockIcon size={16} className="text-gray-400 dark:text-gray-500" />
            <h2 className="text-[15px] font-semibold font-mono text-gray-900 dark:text-gray-100">
              {mode === "edit" ? entry.name : "New key"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-5">
          {/* Key name field (add mode only) */}
          {mode === "add" && (
            <div>
              <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Key name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. API_KEY"
                className="w-full px-3 py-2.5 rounded-lg text-[13px] font-mono bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors"
              />
              {name.length > 0 && !validName && (
                <p className="mt-1 text-[11px] text-red-500 dark:text-red-400">
                  Must start with a letter or underscore, then letters, digits,
                  or underscores
                </p>
              )}
            </div>
          )}

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
                {visible ? <EyeIcon size={16} /> : <EyeSlashIcon size={16} />}
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

          {/* Metadata (read-only, edit mode only) */}
          {mode === "edit" && (entry.addedAt || entry.lastRotated) && (
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
          {mode === "edit" ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-colors"
            >
              Delete key
            </button>
          ) : (
            <div />
          )}
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
              onClick={handleSave}
              disabled={!canSubmit}
              className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-white transition-colors shadow-sm disabled:opacity-50"
              style={{ backgroundColor: "var(--system-accent)" }}
            >
              {mode === "edit" ? "Save changes" : "Add key"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key row
// ---------------------------------------------------------------------------

function KeyRow({
  entry,
  repoName,
  absolutePath,
  onSaved,
}: {
  entry: KeyEntry;
  repoName: string;
  absolutePath: string;
  onSaved: (repo: Repo) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [provider, setProvider] = useState(entry.provider || "");
  const [showProviderMenu, setShowProviderMenu] = useState(false);

  useEffect(() => {
    setProvider(entry.provider || "");
  }, [entry.provider]);

  const handleProviderChange = async (p: string) => {
    setProvider(p);
    setShowProviderMenu(false);
    const updated = await rpc.editKey(repoName, absolutePath, entry.name, entry.value, p);
    if (updated) {
      onSaved(updated);
    }
  };

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
          <LockIcon
            size={14}
            className="text-gray-400 dark:text-gray-500 shrink-0"
          />
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
                <ChevronDownIcon size={10} />
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
                        onClick={() => handleProviderChange("")}
                        className="w-full text-left px-3 py-1.5 text-[12px] text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                      >
                        None
                      </button>
                    )}
                    {PROVIDERS.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => handleProviderChange(p)}
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
              <PencilIcon size={16} />
            </button>

            {/* Eye toggle */}
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              title={visible ? "Hide value" : "Reveal value"}
            >
              {visible ? <EyeIcon size={16} /> : <EyeSlashIcon size={16} />}
            </button>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckIcon size={16} className="text-green-500" />
              ) : (
                <CopyIcon size={16} />
              )}
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
          <KeyModal
            mode="edit"
            entry={entry}
            repoName={repoName}
            absolutePath={absolutePath}
            onSaved={onSaved}
            onClose={() => setEditing(false)}
          />,
          document.body,
        )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Env file section (with sync status)
// ---------------------------------------------------------------------------

function EnvFileSection({
  repoName,
  envFile,
  defaultOpen,
  onResolved,
  onSaved,
}: {
  repoName: string;
  envFile: EnvFile;
  defaultOpen: boolean;
  onResolved: (repo: Repo) => void;
  onSaved: (repo: Repo) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [adding, setAdding] = useState(false);
  const hasDrift = envFile.syncStatus !== "synced";

  return (
    <section>
      {/* File header row */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 group"
        >
          <ChevronDownIcon
            size={14}
            className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
              open ? "" : "-rotate-90"
            }`}
          />
          <FileIcon size={16} className="text-gray-400 dark:text-gray-500" />
          <h2 className="text-[13px] font-semibold font-mono text-gray-500 dark:text-gray-400">
            {envFile.filename}
          </h2>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
            {envFile.keys.length}
          </span>
        </button>

        <SyncBadge status={envFile.syncStatus} />

        <div className="ml-auto flex items-center gap-1.5">
          {hasDrift && (
            <SyncActions
              repoName={repoName}
              envFile={envFile}
              onResolved={onResolved}
            />
          )}
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            title="Add key"
          >
            <PlusIcon size={14} />
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-2">
          {envFile.keys.map((key) => (
            <KeyRow
              key={key.name}
              entry={key}
              repoName={repoName}
              absolutePath={envFile.absolutePath}
              onSaved={onSaved}
            />
          ))}
        </div>
      )}

      {/* Add key modal */}
      {adding &&
        createPortal(
          <KeyModal
            mode="add"
            entry={{ name: "", value: "" }}
            repoName={repoName}
            absolutePath={envFile.absolutePath}
            onSaved={onSaved}
            onClose={() => setAdding(false)}
          />,
          document.body,
        )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Repo detail page
// ---------------------------------------------------------------------------

export function RepoDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { repos, updateRepo } = useRepos();
  const repo = repos.find((r) => r.name === name);

  const handleResolved = (updated: Repo) => {
    updateRepo(updated);
  };

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
            <ChevronLeftIcon size={16} />
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
            <ChevronLeftIcon size={16} />
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

      {/* Drift banner */}
      <DriftBanner repo={repo} />

      {/* Key list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {repo.envFiles.map((envFile) => (
            <EnvFileSection
              key={envFile.absolutePath}
              repoName={repo.name}
              envFile={envFile}
              defaultOpen={repo.envFiles.length === 1}
              onResolved={handleResolved}
              onSaved={handleResolved}
            />
          ))}
        </div>
      </div>
    </>
  );
}
