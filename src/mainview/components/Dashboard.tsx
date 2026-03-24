import { Link } from "react-router-dom";
import { driftCount, repoHasDrift, useRepos } from "../App";
import type { Repo } from "../types";
import { getGreeting } from "../utils";
import {
  AlertTriangleIcon,
  FileIcon,
  FolderIcon,
  LoaderIcon,
  LockIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from "./icons";

function GreetingIcon() {
  const hour = new Date().getHours();
  const Icon = hour < 17 ? SunIcon : MoonIcon;
  return <Icon size={16} className="text-gray-400 dark:text-gray-500" />;
}

function Greeting({ children }: { children?: React.ReactNode }) {
  return (
    <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
      <GreetingIcon />
      {getGreeting()}
      {children}
    </h1>
  );
}

function getTotalKeys(repo: Repo): number {
  return repo.envFiles.reduce((sum, f) => sum + f.keys.length, 0);
}

const CARD_MAX_HEIGHT = 160;

function ProjectCard({ repo }: { repo: Repo }) {
  const totalKeys = getTotalKeys(repo);
  const totalFiles = repo.envFiles.length;
  const estimatedHeight =
    repo.envFiles.reduce((sum, f) => sum + 24 + f.keys.length * 20, 0) + 12;
  const willOverflow = estimatedHeight > CARD_MAX_HEIGHT;
  const hasDrift = repoHasDrift(repo);
  const drifted = driftCount(repo);

  return (
    <Link
      to={`/repo/${repo.name}`}
      className={`group flex flex-col justify-start text-left bg-white dark:bg-white/[0.04] border rounded-xl p-0 overflow-hidden hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all ${
        hasDrift
          ? "border-amber-300/60 dark:border-amber-500/30 hover:border-amber-400/80 dark:hover:border-amber-500/50"
          : "border-gray-200/60 dark:border-white/[0.08] hover:border-gray-300/80 dark:hover:border-white/[0.15]"
      }`}
    >
      <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <FolderIcon size={16} />
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {repo.name}
          </span>
          {hasDrift && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
              <AlertTriangleIcon size={10} />
              {drifted} {drifted === 1 ? "file" : "files"}
            </span>
          )}
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {totalKeys} keys &middot; {totalFiles}{" "}
            {totalFiles === 1 ? "file" : "files"}
          </span>
        </div>
      </div>
      <div className="relative">
        <div
          className="px-4 py-3 space-y-3 overflow-hidden"
          style={{ maxHeight: CARD_MAX_HEIGHT }}
        >
          {repo.envFiles.map((envFile) => (
            <div key={envFile.filename}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileIcon size={12} />
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 font-mono">
                  {envFile.filename}
                </span>
                {envFile.syncStatus !== "synced" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-500" />
                )}
              </div>
              <div className="space-y-1 pl-[18px]">
                {envFile.keys.map((key) => (
                  <div key={key.name} className="flex items-center gap-2">
                    <LockIcon
                      size={12}
                      className="text-gray-300 dark:text-gray-600 shrink-0"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate">
                      {key.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {willOverflow && (
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent pointer-events-none" />
        )}
      </div>
      {willOverflow && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-white/[0.06]">
          <span
            className="text-[11px] font-medium transition-colors"
            style={{ color: "var(--system-accent)" }}
          >
            Show all {totalKeys} keys
          </span>
        </div>
      )}
    </Link>
  );
}

function EmptyState({
  onAdd,
  loading,
}: {
  onAdd: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center mb-4">
        <LockIcon size={28} className="text-gray-300 dark:text-gray-600" />
      </div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
        No projects yet
      </h2>
      <p className="text-[13px] text-gray-500 dark:text-gray-400 text-center max-w-xs mb-5">
        Add a folder to start tracking your environment files and secrets.
      </p>
      <button
        type="button"
        onClick={onAdd}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-colors shadow-sm"
        style={{ backgroundColor: "var(--system-accent)" }}
      >
        {loading ? (
          <LoaderIcon size={16} className="animate-spin" />
        ) : (
          <PlusIcon size={16} />
        )}
        Add folder
      </button>
    </div>
  );
}

export function Dashboard() {
  const { repos, loading, addRepo, addingRepo } = useRepos();
  const totalKeys = repos.reduce((sum, r) => sum + getTotalKeys(r), 0);
  const totalDrift = repos.reduce((sum, r) => sum + driftCount(r), 0);

  return (
    <>
      <header
        className="h-[72px] shrink-0 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/[0.06]"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        {!loading && (
          <>
            <div>
              <Greeting />
              {repos.length > 0 && (
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {repos.length} {repos.length === 1 ? "project" : "projects"},{" "}
                  {totalKeys} tracked keys
                  {totalDrift > 0 && (
                    <span className="text-amber-500 dark:text-amber-400">
                      {" "}
                      &middot; {totalDrift} out of sync
                    </span>
                  )}
                </p>
              )}
            </div>
            {repos.length > 0 && (
              <button
                type="button"
                onClick={addRepo}
                disabled={addingRepo}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
                style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
                title="New project"
              >
                {addingRepo ? (
                  <LoaderIcon size={16} className="animate-spin" />
                ) : (
                  <PlusIcon size={16} />
                )}
              </button>
            )}
          </>
        )}
      </header>
      {loading ? (
        <div className="flex-1" />
      ) : repos.length === 0 ? (
        <EmptyState onAdd={addRepo} loading={addingRepo} />
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <ProjectCard key={repo.name} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
