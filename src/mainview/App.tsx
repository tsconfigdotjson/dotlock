import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { FolderIcon, KeyIcon, LockIcon } from "./components/icons";
import { Logo } from "./components/Logo";
import { PasswordPrompt } from "./components/PasswordPrompt";
import { ProviderDetail } from "./components/ProviderDetail";
import { RepoDetail } from "./components/RepoDetail";
import { SidebarLink } from "./components/SidebarLink";
import { ThemeToggle } from "./components/ThemeToggle";
import { VaultPicker } from "./components/VaultPicker";
import * as rpc from "./rpc";
import type { Repo, Theme, VaultState } from "./types";
import { applyTheme } from "./utils";

// ── App state machine ───────────────────────────────────────────────

type AppScreen =
  | { screen: "loading" }
  | { screen: "vault_picker" }
  | {
      screen: "password_prompt";
      mode: "open" | "create";
      vaultPath: string;
      vaultName: string;
      hasKeychain: boolean;
    }
  | { screen: "unlocked" };

// ── Repo context (shared with Dashboard + RepoDetail) ───────────────

type RepoContextType = {
  repos: Repo[];
  loading: boolean;
  addRepo: () => Promise<void>;
  addingRepo: boolean;
  updateRepo: (repo: Repo) => void;
};

const RepoContext = createContext<RepoContextType>({
  repos: [],
  loading: true,
  addRepo: async () => {},
  addingRepo: false,
  updateRepo: () => {},
});

export function useRepos() {
  return useContext(RepoContext);
}

/** Returns true if any env file in the repo has drift. */
export function repoHasDrift(repo: Repo): boolean {
  return repo.envFiles.some((f) => f.syncStatus !== "synced");
}

/** Count of drifted files in a repo. */
export function driftCount(repo: Repo): number {
  return repo.envFiles.filter((f) => f.syncStatus !== "synced").length;
}

// ── Unlocked App (sidebar + routes) ─────────────────────────────────

function UnlockedApp({
  theme,
  onThemeChange,
  onLock,
  vaultName,
}: {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onLock: () => void;
  vaultName: string;
}) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingRepo, setAddingRepo] = useState(false);
  const location = useLocation();

  // Initial load
  useEffect(() => {
    rpc.getRepos().then((r) => {
      setRepos(r);
      setLoading(false);
    });
  }, []);

  // Listen for push notifications from the watcher (no polling)
  useEffect(() => {
    rpc.onSyncChanged(async (_repoName) => {
      const fresh = await rpc.getRepos();
      setRepos(fresh);
    });
  }, []);

  const addRepo = async () => {
    setAddingRepo(true);
    try {
      const repo = await rpc.selectFolder();
      if (repo) {
        setRepos((prev) => {
          const filtered = prev.filter((r) => r.name !== repo.name);
          return [...filtered, repo];
        });
      }
    } finally {
      setAddingRepo(false);
    }
  };

  /** Immediately update a repo in local state (after import/restore). */
  const updateRepo = useCallback((repo: Repo) => {
    setRepos((prev) => prev.map((r) => (r.name === repo.name ? repo : r)));
  }, []);

  // Derive providers from actual repo data
  const providers = useMemo(() => {
    const map = new Map<string, number>();
    for (const repo of repos) {
      for (const envFile of repo.envFiles) {
        for (const key of envFile.keys) {
          if (key.provider) {
            const lower = key.provider.toLowerCase();
            map.set(lower, (map.get(lower) || 0) + 1);
          }
        }
      }
    }
    return Array.from(map.entries())
      .map(([name, keyCount]) => ({ name, keyCount }))
      .sort((a, b) => b.keyCount - a.keyCount);
  }, [repos]);

  // Derive active sidebar item from route
  const activeRepo = location.pathname.match(/^\/repo\/(.+)/)?.[1] || null;

  return (
    <RepoContext.Provider
      value={{ repos, loading, addRepo, addingRepo, updateRepo }}
    >
      <div className="h-screen flex border-t border-gray-200/60 dark:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 flex flex-col border-r border-gray-200/60 dark:border-white/[0.06] bg-gray-50/80 dark:bg-[#252525]/80 backdrop-blur-xl">
          {/* Drag region / Logo */}
          <div
            className="h-[72px] flex items-center px-4"
            style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
          >
            <Link
              to="/"
              className="flex items-center gap-2"
              style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
            >
              <Logo size="sm" />
              <span className="font-semibold text-sm tracking-tight text-gray-800 dark:text-gray-200">
                dotlock
              </span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
            <div>
              <div className="flex items-center gap-1.5 px-2.5 mb-2.5">
                <FolderIcon size={16} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Repos
                </span>
              </div>
              <div className="space-y-0.5">
                {repos.map((repo) => (
                  <SidebarLink
                    key={repo.name}
                    to={`/repo/${repo.name}`}
                    label={repo.name}
                    active={activeRepo === repo.name}
                    hasDrift={repoHasDrift(repo)}
                  />
                ))}
              </div>
            </div>

            {providers.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-2.5 mb-2.5">
                  <KeyIcon size={16} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Keys
                  </span>
                </div>
                <div className="space-y-0.5">
                  {providers.map((provider) => (
                    <SidebarLink
                      key={provider.name}
                      to={`/keys/${provider.name}`}
                      label={provider.name}
                      active={location.pathname === `/keys/${provider.name}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="px-3 py-3 border-t border-gray-200/50 dark:border-white/[0.06] space-y-2">
            {/* Lock Vault */}
            <button
              type="button"
              onClick={onLock}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <LockIcon size={14} />
              <span className="truncate">{vaultName}</span>
              <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500">
                Lock
              </span>
            </button>

            <ThemeToggle theme={theme} onChange={onThemeChange} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/repo/:name" element={<RepoDetail />} />
            <Route path="/keys/:provider" element={<ProviderDetail />} />
          </Routes>
        </main>
      </div>
    </RepoContext.Provider>
  );
}

// ── Root App ────────────────────────────────────────────────────────

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("dotlock-theme") as Theme | null;
    return saved || "system";
  });
  const [appState, setAppState] = useState<AppScreen>({ screen: "loading" });

  // Track current vault name for the sidebar lock button
  const [currentVaultName, setCurrentVaultName] = useState("");

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("dotlock-theme", theme);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  // Determine initial screen
  useEffect(() => {
    rpc.getVaultState().then((state) => {
      if (state === "unlocked") {
        setAppState({ screen: "unlocked" });
      } else {
        setAppState({ screen: "vault_picker" });
      }
    });
  }, []);

  // Listen for vault state changes from backend
  useEffect(() => {
    rpc.onVaultStateChanged((state: VaultState) => {
      if (state === "unlocked") {
        setAppState({ screen: "unlocked" });
      } else if (state === "locked") {
        setAppState({ screen: "vault_picker" });
      }
    });
  }, []);

  const handleOpenVault = async (path: string, name: string) => {
    setCurrentVaultName(name);
    const hasKc = await rpc.hasKeychainPassword(path);
    setAppState({
      screen: "password_prompt",
      mode: "open",
      vaultPath: path,
      vaultName: name,
      hasKeychain: hasKc,
    });
  };

  const handleCreateVault = (path: string, name: string) => {
    setCurrentVaultName(name);
    setAppState({
      screen: "password_prompt",
      mode: "create",
      vaultPath: path,
      vaultName: name,
      hasKeychain: false,
    });
  };

  const handleUnlocked = () => {
    setAppState({ screen: "unlocked" });
  };

  const handleBack = () => {
    setAppState({ screen: "vault_picker" });
  };

  const handleLock = async () => {
    await rpc.lockVault();
    setAppState({ screen: "vault_picker" });
  };

  // ── Render ──────────────────────────────────────────────────────

  if (appState.screen === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#1a1a1a]">
        <div
          className="h-[72px] w-full absolute top-0"
          style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
        />
      </div>
    );
  }

  if (appState.screen === "vault_picker") {
    return (
      <VaultPicker
        theme={theme}
        onThemeChange={setTheme}
        onOpenVault={handleOpenVault}
        onCreateVault={handleCreateVault}
      />
    );
  }

  if (appState.screen === "password_prompt") {
    return (
      <PasswordPrompt
        mode={appState.mode}
        vaultPath={appState.vaultPath}
        vaultName={appState.vaultName}
        hasKeychain={appState.hasKeychain}
        onBack={handleBack}
        onUnlocked={handleUnlocked}
      />
    );
  }

  // screen === "unlocked"
  return (
    <UnlockedApp
      theme={theme}
      onThemeChange={setTheme}
      onLock={handleLock}
      vaultName={currentVaultName || "Vault"}
    />
  );
}

export default App;
