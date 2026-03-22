import type { Theme } from "../types";
import { SunIcon, MonitorIcon, MoonIcon } from "./icons";

export function ThemeToggle({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (t: Theme) => void;
}) {
  const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <SunIcon size={14} />, label: "Light" },
    { value: "system", icon: <MonitorIcon size={14} />, label: "System" },
    { value: "dark", icon: <MoonIcon size={14} />, label: "Dark" },
  ];

  return (
    <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-0.5">
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            theme === opt.value
              ? "bg-white dark:bg-white/15 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          title={opt.label}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
