import { useEffect, useState } from "react";
import * as rpc from "../rpc";
import type { Theme, VaultMeta } from "../types";
import { timeAgo } from "../utils";
import {
  ClockIcon,
  FilePlusIcon,
  FolderOpenIcon,
  LockIcon,
  XIcon,
} from "./icons";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onOpenVault: (path: string, name: string) => void;
  onCreateVault: (path: string, name: string) => void;
};

export function VaultPicker({
  theme,
  onThemeChange,
  onOpenVault,
  onCreateVault,
}: Props) {
  const [recents, setRecents] = useState<VaultMeta[]>([]);
  const [creating, setCreating] = useState(false);
  const [vaultName, setVaultName] = useState("");
  const [folderPath, setFolderPath] = useState<string | null>(null);

  const sanitizeName = (name: string) =>
    name.trim().replace(/[^a-zA-Z0-9._-]/g, "-");

  useEffect(() => {
    rpc.getRecentVaults().then(setRecents);
  }, []);

  const handleOpenExisting = async () => {
    const path = await rpc.pickVaultFile();
    if (path) {
      const name =
        path
          .split("/")
          .pop()
          ?.replace(/\.dotlock$/, "") || "vault";
      onOpenVault(path, name);
    }
  };

  const handleChooseFolder = async () => {
    const path = await rpc.pickVaultFolder();
    if (path) {
      setFolderPath(path);
    }
  };

  const handleCreateContinue = () => {
    if (!vaultName.trim() || !folderPath) {
      return;
    }
    const safeName = sanitizeName(vaultName);
    const fullPath = `${folderPath}/${safeName}.dotlock`;
    onCreateVault(fullPath, safeName);
  };

  const handleRecentClick = (meta: VaultMeta) => {
    onOpenVault(meta.path, meta.name);
  };

  const handleRemoveRecent = async (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setRecents((prev) => prev.filter((r) => r.path !== path));
    await rpc.removeRecentVault(path);
  };

  const resolvedPath =
    folderPath && vaultName.trim()
      ? `${folderPath}/${sanitizeName(vaultName)}.dotlock`
      : null;

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100">
      {/* Drag region */}
      <div
        className="h-[72px] shrink-0"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      />

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-[72px]">
        <div className="w-full max-w-md">
          {/* Logo + title */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Logo />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              dotlock
            </h1>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
              Open or create an encrypted vault
            </p>
          </div>

          {creating ? (
            /* ── Create vault inline flow ───────────────────────────── */
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Vault Name
                </label>
                <input
                  type="text"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  placeholder="my-secrets"
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] font-mono bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateContinue();
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Location
                </label>
                <button
                  type="button"
                  onClick={handleChooseFolder}
                  className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors text-left"
                >
                  {folderPath || "Choose folder..."}
                </button>
                {resolvedPath && (
                  <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500 font-mono truncate">
                    {resolvedPath}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreateContinue}
                  disabled={!vaultName.trim() || !folderPath}
                  className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white shadow-sm transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "var(--system-accent)" }}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false);
                    setVaultName("");
                    setFolderPath(null);
                  }}
                  className="px-4 py-2.5 rounded-lg text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── Default: action buttons + recents ─────────────────── */
            <>
              <div className="flex items-center justify-center gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white shadow-sm transition-colors"
                  style={{ backgroundColor: "var(--system-accent)" }}
                >
                  <FilePlusIcon size={16} />
                  Create New Vault
                </button>
                <button
                  type="button"
                  onClick={handleOpenExisting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.08] shadow-sm transition-colors"
                >
                  <FolderOpenIcon size={16} />
                  Open Existing
                </button>
              </div>

              {recents.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-1 mb-2.5">
                    <ClockIcon
                      size={12}
                      className="text-gray-400 dark:text-gray-500"
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Recent Vaults
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recents.map((meta) => (
                      <button
                        type="button"
                        key={meta.path}
                        onClick={() => handleRecentClick(meta)}
                        className="group/item w-full px-4 py-3 rounded-lg border border-gray-200/60 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] hover:border-gray-300/80 dark:hover:border-white/[0.15] transition-colors cursor-pointer flex items-center gap-3 text-left"
                      >
                        <LockIcon
                          size={16}
                          className="text-gray-400 dark:text-gray-500 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                            {meta.name}
                          </div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate font-mono">
                            {meta.path}
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums shrink-0">
                          {timeAgo(meta.lastOpened)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecent(e, meta.path)}
                          className="p-1 rounded-md text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover/item:opacity-100 transition-all"
                          title="Remove from recents"
                        >
                          <XIcon size={14} />
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Theme toggle */}
          <div className="mt-8 flex justify-center">
            <div className="w-36">
              <ThemeToggle theme={theme} onChange={onThemeChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
