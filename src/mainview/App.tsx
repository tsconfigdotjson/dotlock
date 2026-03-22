import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import type { Theme } from "./types";
import { MOCK_REPOS, MOCK_PROVIDERS } from "./data/mockData";
import { applyTheme } from "./utils";
import { LockIcon, FolderIcon, KeyIcon } from "./components/icons";
import { ThemeToggle } from "./components/ThemeToggle";
import { SidebarLink } from "./components/SidebarLink";
import { Dashboard } from "./components/Dashboard";
import { RepoDetail } from "./components/RepoDetail";

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("dotlock-theme") as Theme | null;
    return saved || "system";
  });
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

  // Derive active sidebar item from route
  const activeRepo = location.pathname.match(/^\/repo\/(.+)/)?.[1] || null;

  return (
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
              <LockIcon className="w-3.5 h-3.5 text-white" />
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
              <FolderIcon />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Repos
              </span>
            </div>
            <div className="space-y-0.5">
              {MOCK_REPOS.map((repo) => (
                <SidebarLink
                  key={repo.name}
                  to={`/repo/${repo.name}`}
                  label={repo.name}
                  active={activeRepo === repo.name}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 px-2.5 mb-2.5">
              <KeyIcon />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Keys
              </span>
            </div>
            <div className="space-y-0.5">
              {MOCK_PROVIDERS.map((provider) => (
                <SidebarLink
                  key={provider.name}
                  to={`/keys/${provider.name}`}
                  label={provider.name}
                  active={location.pathname === `/keys/${provider.name}`}
                />
              ))}
            </div>
          </div>
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
  );
}

export default App;
