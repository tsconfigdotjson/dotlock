import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRepos } from "../App";
import type { KeyEntry, Repo } from "../types";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  FileIcon,
  FolderIcon,
  KeyIcon,
} from "./icons";
import { KeyRow } from "./KeyComponents";

type ProviderKey = {
  entry: KeyEntry;
  repoName: string;
  absolutePath: string;
  envFilename: string;
};

export function ProviderDetail() {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const { repos, updateRepo } = useRepos();

  // Collect all keys matching this provider, grouped by repo > env file
  const grouped = useMemo(() => {
    const result: Map<string, Map<string, ProviderKey[]>> = new Map();

    for (const repo of repos) {
      for (const envFile of repo.envFiles) {
        for (const key of envFile.keys) {
          if (
            key.provider &&
            key.provider.toLowerCase() === provider?.toLowerCase()
          ) {
            if (!result.has(repo.name)) {
              result.set(repo.name, new Map());
            }
            const repoMap = result.get(repo.name) as Map<string, ProviderKey[]>;
            if (!repoMap.has(envFile.absolutePath)) {
              repoMap.set(envFile.absolutePath, []);
            }
            (repoMap.get(envFile.absolutePath) as ProviderKey[]).push({
              entry: key,
              repoName: repo.name,
              absolutePath: envFile.absolutePath,
              envFilename: envFile.filename,
            });
          }
        }
      }
    }

    return result;
  }, [repos, provider]);

  const totalKeys = useMemo(() => {
    let count = 0;
    for (const repoMap of grouped.values()) {
      for (const keys of repoMap.values()) {
        count += keys.length;
      }
    }
    return count;
  }, [grouped]);

  // Display name: capitalize first letter
  const displayName = provider
    ? provider.charAt(0).toUpperCase() + provider.slice(1)
    : "";

  const handleSaved = (repo: Repo) => {
    updateRepo(repo);
  };

  if (!provider) {
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
          Provider not found
        </div>
      </>
    );
  }

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
              {displayName}
            </h1>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              {totalKeys} {totalKeys === 1 ? "key" : "keys"} across{" "}
              {grouped.size} {grouped.size === 1 ? "repo" : "repos"}
            </p>
          </div>
        </div>
      </header>

      {/* Key list grouped by repo > env file */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([repoName, envFileMap]) => (
            <div key={repoName}>
              {Array.from(envFileMap.entries()).map(([absolutePath, keys]) => (
                <ProviderEnvSection
                  key={absolutePath}
                  repoName={repoName}
                  envFilename={keys[0].envFilename}
                  keys={keys}
                  onSaved={handleSaved}
                />
              ))}
            </div>
          ))}
        </div>

        {totalKeys === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
            <KeyIcon size={32} className="mb-3 opacity-50" />
            <p className="text-sm">No keys for this provider</p>
          </div>
        )}
      </div>
    </>
  );
}

function ProviderEnvSection({
  repoName,
  envFilename,
  keys,
  onSaved,
}: {
  repoName: string;
  envFilename: string;
  keys: ProviderKey[];
  onSaved: (repo: Repo) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-3 group"
      >
        <ChevronDownIcon
          size={14}
          className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            open ? "" : "-rotate-90"
          }`}
        />
        <FolderIcon size={14} className="text-gray-400 dark:text-gray-500" />
        <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
          {repoName}
        </span>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <FileIcon size={14} className="text-gray-400 dark:text-gray-500" />
        <span className="text-[13px] font-semibold font-mono text-gray-500 dark:text-gray-400">
          {envFilename}
        </span>
        <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
          {keys.length}
        </span>
      </button>

      {open && (
        <div className="space-y-2">
          {keys.map((k) => (
            <KeyRow
              key={k.entry.name}
              entry={k.entry}
              repoName={k.repoName}
              absolutePath={k.absolutePath}
              onSaved={onSaved}
            />
          ))}
        </div>
      )}
    </section>
  );
}
