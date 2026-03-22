import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { FolderIcon, KeyIcon, LockIcon } from "./components/icons";
import { RepoDetail } from "./components/RepoDetail";
import { SidebarLink } from "./components/SidebarLink";
import { ThemeToggle } from "./components/ThemeToggle";
import * as rpc from "./rpc";
import type { Repo, Theme } from "./types";
import { applyTheme } from "./utils";

type RepoContextType = {
  repos: Repo[];
  loading: boolean;
  addRepo: () => Promise<void>;
};

const RepoContext = createContext<RepoContextType>({
  repos: [],
  loading: true,
  addRepo: async () => {},
});

export function useRepos() {
  return useContext(RepoContext);
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("dotlock-theme") as Theme | null;
    return saved || "system";
  });
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  useEffect(() => {
    rpc.getRepos().then((r) => {
      setRepos(r);
      setLoading(false);
    });
  }, []);

  const addRepo = async () => {
    const repo = await rpc.selectFolder();
    if (repo) {
      setRepos((prev) => {
        const filtered = prev.filter((r) => r.name !== repo.name);
        return [...filtered, repo];
      });
    }
  };

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
    <RepoContext.Provider value={{ repos, loading, addRepo }}>
      <div className="h-screen flex bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100">
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
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <LockIcon size={14} className="text-white" />
              </div>
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

          {/* Theme Toggle */}
          <div className="px-3 py-3 border-t border-gray-200/50 dark:border-white/[0.06]">
            <ThemeToggle theme={theme} onChange={setTheme} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/repo/:name" element={<RepoDetail />} />
          </Routes>
        </main>
      </div>
    </RepoContext.Provider>
  );
}

export default App;
