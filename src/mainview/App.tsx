import { useState, useEffect } from "react";

// --- Mock Data ---
const MOCK_REPOS = [
	{
		name: "poppy",
		keys: [
			{ name: "OPENAPI_KEY", preview: "sk-proj-a8x...R4nQ" },
			{ name: "CLOUDFLARE_API_TOKEN", preview: "v1.0-8f3d...91ab" },
			{ name: "HARNESS_KEY", preview: "pat.harn...xK9z" },
			{ name: "DATABASE_URL", preview: "postgres://u...5432/db" },
			{ name: "REDIS_URL", preview: "redis://def...6379" },
		],
	},
	{
		name: "earlyco",
		keys: [
			{ name: "STRIPE_SECRET_KEY", preview: "sk_live_51...yZq" },
			{ name: "STRIPE_WEBHOOK_SECRET", preview: "whsec_Mj...8kL" },
			{ name: "SENDGRID_API_KEY", preview: "SG.xK9m...pQ3v" },
			{ name: "DATABASE_URL", preview: "postgres://u...5432/db" },
			{ name: "NEXT_PUBLIC_APP_URL", preview: "https://earl..." },
			{ name: "JWT_SECRET", preview: "eyJ0eXAiO...Rk9" },
		],
	},
	{
		name: "infractl",
		keys: [
			{ name: "AWS_ACCESS_KEY_ID", preview: "AKIA4...X7MQ" },
			{ name: "AWS_SECRET_ACCESS_KEY", preview: "wJalr...4ceP" },
			{ name: "TERRAFORM_TOKEN", preview: "tfe-at...9xZp" },
		],
	},
];

const MOCK_PROVIDERS = [
	{ name: "cloudflare", keyCount: 4 },
	{ name: "digitalocean", keyCount: 3 },
	{ name: "aws", keyCount: 8 },
];

type Theme = "light" | "dark" | "system";

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good Morning";
	if (hour < 17) return "Good Afternoon";
	return "Good Evening";
}

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	if (theme === "system") {
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		root.classList.toggle("dark", prefersDark);
	} else {
		root.classList.toggle("dark", theme === "dark");
	}
}

// --- Icons ---
function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
			/>
		</svg>
	);
}

function PlusIcon() {
	return (
		<svg
			className="w-4 h-4"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={2}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 4.5v15m7.5-7.5h-15"
			/>
		</svg>
	);
}

function FolderIcon() {
	return (
		<svg
			className="w-4 h-4"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
			/>
		</svg>
	);
}

function KeyIcon() {
	return (
		<svg
			className="w-4 h-4"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
			/>
		</svg>
	);
}

function SunIcon() {
	return (
		<svg
			className="w-3.5 h-3.5"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
			/>
		</svg>
	);
}

function MoonIcon() {
	return (
		<svg
			className="w-3.5 h-3.5"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
			/>
		</svg>
	);
}

function MonitorIcon() {
	return (
		<svg
			className="w-3.5 h-3.5"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z"
			/>
		</svg>
	);
}

// --- Components ---

function ThemeToggle({
	theme,
	onChange,
}: {
	theme: Theme;
	onChange: (t: Theme) => void;
}) {
	const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
		{ value: "light", icon: <SunIcon />, label: "Light" },
		{ value: "system", icon: <MonitorIcon />, label: "System" },
		{ value: "dark", icon: <MoonIcon />, label: "Dark" },
	];

	return (
		<div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-0.5">
			{options.map((opt) => (
				<button
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

function SidebarItem({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`w-full text-left px-2.5 py-1 rounded-md text-[13px] transition-colors ${
				active
					? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-medium"
					: "text-gray-600 dark:text-gray-400 hover:bg-black/[0.03] dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
			}`}
		>
			{label}
		</button>
	);
}

function ProjectCard({
	repo,
	onClick,
}: {
	repo: (typeof MOCK_REPOS)[0];
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="group text-left bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-xl p-0 overflow-hidden hover:border-gray-300 dark:hover:border-white/[0.15] hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all"
		>
			<div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
				<div className="flex items-center gap-2">
					<FolderIcon />
					<span className="font-medium text-sm text-gray-900 dark:text-gray-100">
						{repo.name}
					</span>
					<span className="ml-auto text-xs text-gray-400 dark:text-gray-500 tabular-nums">
						{repo.keys.length}
					</span>
				</div>
			</div>
			<div className="px-4 py-3 space-y-1.5">
				{repo.keys.slice(0, 4).map((key) => (
					<div key={key.name} className="flex items-center gap-2">
						<LockIcon className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0" />
						<span className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate">
							{key.name}
						</span>
					</div>
				))}
				{repo.keys.length > 4 && (
					<div className="text-xs text-gray-400 dark:text-gray-500 pl-5">
						+{repo.keys.length - 4} more
					</div>
				)}
			</div>
		</button>
	);
}

// --- App ---

function App() {
	const [theme, setTheme] = useState<Theme>(() => {
		const saved = localStorage.getItem("dotlock-theme") as Theme | null;
		return saved || "system";
	});
	const [activeItem, setActiveItem] = useState<string | null>(null);

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

	const totalKeys = MOCK_REPOS.reduce((sum, r) => sum + r.keys.length, 0);

	return (
		<div className="h-screen flex bg-gray-50/50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100">
			{/* Sidebar */}
			<aside className="w-52 shrink-0 flex flex-col border-r border-gray-200/70 dark:border-white/[0.06] bg-gray-100/60 dark:bg-[#252525]/80 backdrop-blur-xl">
				{/* Drag region / Logo */}
				<div
					className="h-[52px] flex items-center px-4 pt-1"
					style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
				>
					<div className="flex items-center gap-2">
						<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
							<LockIcon className="w-3.5 h-3.5 text-white" />
						</div>
						<span className="font-semibold text-sm tracking-tight text-gray-800 dark:text-gray-200">
							dotlock
						</span>
					</div>
				</div>

				{/* Nav */}
				<nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
					{/* Repos */}
					<div>
						<div className="flex items-center gap-1.5 px-2.5 mb-1">
							<FolderIcon />
							<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Repos
							</span>
						</div>
						<div className="space-y-0.5">
							{MOCK_REPOS.map((repo) => (
								<SidebarItem
									key={repo.name}
									label={repo.name}
									active={activeItem === `repo:${repo.name}`}
									onClick={() =>
										setActiveItem(`repo:${repo.name}`)
									}
								/>
							))}
						</div>
					</div>

					{/* Keys */}
					<div>
						<div className="flex items-center gap-1.5 px-2.5 mb-1">
							<KeyIcon />
							<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Keys
							</span>
						</div>
						<div className="space-y-0.5">
							{MOCK_PROVIDERS.map((provider) => (
								<SidebarItem
									key={provider.name}
									label={provider.name}
									active={
										activeItem ===
										`key:${provider.name}`
									}
									onClick={() =>
										setActiveItem(
											`key:${provider.name}`,
										)
									}
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
				{/* Top Bar */}
				<header
					className="h-[52px] shrink-0 flex items-center justify-between px-6 border-b border-gray-200/70 dark:border-white/[0.06]"
					style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
				>
					<div>
						<h1 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
							{getGreeting()}, Lee!
						</h1>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{MOCK_REPOS.length} projects, {totalKeys} tracked
							keys
						</p>
					</div>
					<button
						className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.08] text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
						style={
							{ WebkitAppRegion: "no-drag" } as React.CSSProperties
						}
						title="New project"
					>
						<PlusIcon />
					</button>
				</header>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{MOCK_REPOS.map((repo) => (
							<ProjectCard
								key={repo.name}
								repo={repo}
								onClick={() =>
									setActiveItem(`repo:${repo.name}`)
								}
							/>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}

export default App;
