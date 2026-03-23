import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { driftCount, useRepos } from "../App";
import type { EnvFile, Repo, SyncStatus } from "../types";
import * as rpc from "../rpc";
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  FileIcon,
  FileWarningIcon,
  PlusIcon,
} from "./icons";
import { KeyModal, KeyRow } from "./KeyComponents";

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
