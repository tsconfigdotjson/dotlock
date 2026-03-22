import { Link } from "react-router-dom";
import type { Repo } from "../types";
import { MOCK_REPOS } from "../data/mockData";
import { getGreeting } from "../utils";
import { FolderIcon, FileIcon, LockIcon, PlusIcon } from "./icons";

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

  return (
    <Link
      to={`/repo/${repo.name}`}
      className="group flex flex-col justify-start text-left bg-white dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] rounded-xl p-0 overflow-hidden hover:border-gray-300/80 dark:hover:border-white/[0.15] hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all"
    >
      <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <FolderIcon />
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {repo.name}
          </span>
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
                <FileIcon />
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 font-mono">
                  {envFile.filename}
                </span>
              </div>
              <div className="space-y-1 pl-[18px]">
                {envFile.keys.map((key) => (
                  <div key={key.name} className="flex items-center gap-2">
                    <LockIcon className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0" />
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

export function Dashboard() {
  const totalKeys = MOCK_REPOS.reduce((sum, r) => sum + getTotalKeys(r), 0);

  return (
    <>
      <header
        className="h-[72px] shrink-0 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/[0.06]"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <div>
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {getGreeting()}, Lee!
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
            {MOCK_REPOS.length} projects, {totalKeys} tracked keys
          </p>
        </div>
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          title="New project"
        >
          <PlusIcon />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_REPOS.map((repo) => (
            <ProjectCard key={repo.name} repo={repo} />
          ))}
        </div>
      </div>
    </>
  );
}
