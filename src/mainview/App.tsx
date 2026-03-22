import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Routes, Route, Link, useParams, useLocation, useNavigate } from "react-router-dom";

// --- Types ---
type KeyEntry = {
	name: string;
	value: string;
	provider?: string;
	addedAt?: string;
	lastRotated?: string;
};

type EnvFile = {
	filename: string;
	keys: KeyEntry[];
};

type Repo = {
	name: string;
	envFiles: EnvFile[];
};

const PROVIDERS = [
	"AWS",
	"Cloudflare",
	"DigitalOcean",
	"Hetzner",
	"Vercel",
	"Heroku",
	"Fly.io",
	"Railway",
	"Supabase",
	"PlanetScale",
	"Stripe",
	"SendGrid",
	"Datadog",
	"Sentry",
] as const;

// --- Mock Data ---
const MOCK_REPOS: Repo[] = [
	{
		name: "poppy",
		envFiles: [
			{
				filename: ".env",
				keys: [
					{
						name: "DATABASE_URL",
						value: "postgres://poppy_user:x8kM2pL9@db.hetzner.cloud:5432/poppy_prod",
						provider: "Hetzner",
						addedAt: "2025-12-10",
						lastRotated: "2026-03-01",
					},
					{
						name: "REDIS_URL",
						value: "redis://default:aB3kx9Lm@redis.hetzner.cloud:6379",
						provider: "Hetzner",
						addedAt: "2025-12-10",
					},
				],
			},
			{
				filename: ".env.local",
				keys: [
					{
						name: "OPENAPI_KEY",
						value: "sk-proj-a8xKm2pL9nR4vB7cD1eF3gH5iJ0kQ",
						addedAt: "2026-01-15",
						lastRotated: "2026-03-18",
					},
					{
						name: "CLOUDFLARE_API_TOKEN",
						value: "v1.0-8f3d91ab2c4e6a7b0d1f3e5c7a9b2d4f",
						provider: "Cloudflare",
						addedAt: "2026-01-15",
					},
					{
						name: "HARNESS_KEY",
						value: "pat.harn.kL9mN2pQ4rS6tU8vW0xK9z",
						addedAt: "2026-02-20",
					},
				],
			},
		],
	},
	{
		name: "earlyco",
		envFiles: [
			{
				filename: ".env",
				keys: [
					{
						name: "DATABASE_URL",
						value: "postgres://earlyco:pR4kx9Lm2n@db-prod.supabase.co:5432/earlyco",
						provider: "Supabase",
						addedAt: "2025-11-05",
						lastRotated: "2026-02-28",
					},
					{
						name: "NEXT_PUBLIC_APP_URL",
						value: "https://earlyco.app",
						addedAt: "2025-11-05",
					},
					{
						name: "NEXT_PUBLIC_POSTHOG_KEY",
						value: "phc_a8Kx3mN5pQ7rS9tU1vW3xY5zA7bC9dE",
						addedAt: "2026-01-20",
					},
				],
			},
			{
				filename: ".env.local",
				keys: [
					{
						name: "STRIPE_SECRET_KEY",
						value: "sk_live_51HxK9mN2pQ4rS6tU8vW0xK9zA7bCyZq",
						provider: "Stripe",
						addedAt: "2025-11-05",
						lastRotated: "2026-03-10",
					},
					{
						name: "STRIPE_WEBHOOK_SECRET",
						value: "whsec_MjA3NTk4ZmQtYjRiNy00MDg5",
						provider: "Stripe",
						addedAt: "2025-11-05",
					},
					{
						name: "SENDGRID_API_KEY",
						value: "SG.xK9mN2pQ4rS6tU8v.W0xK9zA7bC9dE1fG3hI5jK7lM9nO1pQ3v",
						provider: "SendGrid",
						addedAt: "2026-01-08",
					},
					{
						name: "JWT_SECRET",
						value: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9Rk9",
						addedAt: "2025-11-05",
					},
				],
			},
			{
				filename: ".env.production",
				keys: [
					{
						name: "SENTRY_DSN",
						value: "https://abc123def456@o789012.ingest.sentry.io/1234567",
						provider: "Sentry",
						addedAt: "2026-02-01",
					},
					{
						name: "LOGFLARE_API_KEY",
						value: "lf_k9xmN2pQ4rS6tU8vW0xK2mP",
						addedAt: "2026-02-01",
					},
					{
						name: "DATADOG_API_KEY",
						value: "dd-api-k9xmN2pQ4rS6tU8vW0x7xR",
						provider: "Datadog",
						addedAt: "2026-02-15",
					},
					{
						name: "LAUNCHDARKLY_SDK_KEY",
						value: "sdk-a4f8kL9mN2pQ4rS6tU8vpQ9",
						addedAt: "2026-03-01",
					},
					{
						name: "SEGMENT_WRITE_KEY",
						value: "wk_9xJmN2pQ4rS6tU8vW0xK3nL",
						addedAt: "2026-03-01",
					},
				],
			},
		],
	},
	{
		name: "infractl",
		envFiles: [
			{
				filename: ".env",
				keys: [
					{
						name: "AWS_ACCESS_KEY_ID",
						value: "AKIA4EXAMPLE7X7MQ",
						provider: "AWS",
						addedAt: "2025-10-20",
						lastRotated: "2026-03-15",
					},
					{
						name: "AWS_SECRET_ACCESS_KEY",
						value: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY4ceP",
						provider: "AWS",
						addedAt: "2025-10-20",
						lastRotated: "2026-03-15",
					},
					{
						name: "TERRAFORM_TOKEN",
						value: "tfe-at-k9xmN2pQ4rS6tU8vW0xK9xZp",
						addedAt: "2025-10-20",
					},
				],
			},
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

function timeAgo(dateStr: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const days = Math.floor(
		(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
	);
	if (days < 1) return "today";
	if (days === 1) return "yesterday";
	if (days < 7) return `${days}d ago`;
	if (days < 30) return `${Math.floor(days / 7)}w ago`;
	if (days < 365) return `${Math.floor(days / 30)}mo ago`;
	return `${Math.floor(days / 365)}y ago`;
}

// --- Icons ---
function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
		</svg>
	);
}

function PlusIcon() {
	return (
		<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
	);
}

function FolderIcon() {
	return (
		<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
		</svg>
	);
}

function KeyIcon() {
	return (
		<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
		</svg>
	);
}

function SunIcon() {
	return (
		<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
		</svg>
	);
}

function MoonIcon() {
	return (
		<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
		</svg>
	);
}

function MonitorIcon() {
	return (
		<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
		</svg>
	);
}

function ChevronLeftIcon() {
	return (
		<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
		</svg>
	);
}

function EyeIcon() {
	return (
		<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
		</svg>
	);
}

function EyeSlashIcon() {
	return (
		<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
		</svg>
	);
}

function CopyIcon() {
	return (
		<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
		</svg>
	);
}

function FileIcon({ className = "w-3 h-3" }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
		</svg>
	);
}

// --- Shared Components ---

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
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

function SidebarLink({ to, label, active }: { to: string; label: string; active: boolean }) {
	return (
		<Link
			to={to}
			className={`block w-full text-left px-2.5 py-1 rounded-md text-[13px] transition-colors ${
				active
					? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-medium"
					: "text-gray-600 dark:text-gray-400 hover:bg-black/[0.03] dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
			}`}
		>
			{label}
		</Link>
	);
}

// --- Dashboard ---

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

function Dashboard() {
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

// --- Repo Detail View ---

function PencilIcon() {
	return (
		<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
		</svg>
	);
}

function EditKeyModal({
	entry,
	onClose,
}: {
	entry: KeyEntry;
	onClose: () => void;
}) {
	const [value, setValue] = useState(entry.value);
	const [provider, setProvider] = useState(entry.provider || "");
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleEsc);
		return () => document.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Sheet */}
			<div className="relative w-full max-w-lg bg-white dark:bg-[#2a2a2a] rounded-xl shadow-2xl dark:shadow-black/40 border border-gray-200/60 dark:border-white/[0.08] overflow-hidden">
				{/* Modal header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
					<div className="flex items-center gap-2.5">
						<LockIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
						<h2 className="text-[15px] font-semibold font-mono text-gray-900 dark:text-gray-100">
							{entry.name}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
					>
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Modal body */}
				<div className="px-6 py-5 space-y-5">
					{/* Value field */}
					<div>
						<label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
							Value
						</label>
						<div className="relative">
							<textarea
								value={value}
								onChange={(e) => setValue(e.target.value)}
								rows={3}
								className="w-full px-3 py-2.5 rounded-lg text-[13px] font-mono bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors resize-none select-text"
								style={
									!visible
										? {
												WebkitTextSecurity: "disc",
											} as React.CSSProperties
										: undefined
								}
							/>
							<button
								onClick={() => setVisible(!visible)}
								className="absolute top-2.5 right-2.5 p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
							>
								{visible ? <EyeIcon /> : <EyeSlashIcon />}
							</button>
						</div>
					</div>

					{/* Provider */}
					<div>
						<label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
							Provider
						</label>
						<select
							value={provider}
							onChange={(e) => setProvider(e.target.value)}
							className="w-full px-3 py-2 rounded-lg text-[13px] bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors appearance-none"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "right 12px center",
							}}
						>
							<option value="">None</option>
							{PROVIDERS.map((p) => (
								<option key={p} value={p}>
									{p}
								</option>
							))}
						</select>
					</div>

					{/* Metadata (read-only) */}
					{(entry.addedAt || entry.lastRotated) && (
						<div className="flex items-center gap-4 text-[12px] text-gray-400 dark:text-gray-500 pt-1">
							{entry.addedAt && (
								<span>Added {timeAgo(entry.addedAt)}</span>
							)}
							{entry.lastRotated && (
								<span>Last rotated {timeAgo(entry.lastRotated)}</span>
							)}
						</div>
					)}
				</div>

				{/* Modal footer */}
				<div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02]">
					<button
						className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
					>
						Delete key
					</button>
					<div className="flex items-center gap-2">
						<button
							onClick={onClose}
							className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={onClose}
							className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-white transition-colors shadow-sm"
							style={{ backgroundColor: "var(--system-accent)" }}
						>
							Save changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function KeyRow({ entry }: { entry: KeyEntry }) {
	const [visible, setVisible] = useState(false);
	const [copied, setCopied] = useState(false);
	const [editing, setEditing] = useState(false);
	const [provider, setProvider] = useState(entry.provider || "");
	const [showProviderMenu, setShowProviderMenu] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(entry.value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<>
			<div className="group/row rounded-lg border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.1] transition-colors">
				{/* Key header */}
				<div className="flex items-center gap-2 px-4 py-2.5">
					<LockIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
					<span className="text-[13px] font-medium font-mono text-gray-900 dark:text-gray-100">
						{entry.name}
					</span>

					<div className="ml-auto flex items-center gap-1.5">
						{/* Provider badge / selector */}
						<div className="relative">
							<button
								onClick={() => setShowProviderMenu(!showProviderMenu)}
								className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
									provider
										? "bg-gray-100 dark:bg-white/[0.08] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/[0.12]"
										: "border border-dashed border-gray-300 dark:border-white/[0.15] text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-white/[0.25] hover:text-gray-500 dark:hover:text-gray-400"
								}`}
							>
								{provider || "Provider"}
								<svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
								</svg>
							</button>

							{showProviderMenu && (
								<>
									<div className="fixed inset-0 z-10" onClick={() => setShowProviderMenu(false)} />
									<div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-white/[0.1] rounded-lg shadow-lg dark:shadow-black/30 py-1 max-h-52 overflow-y-auto">
										{provider && (
											<button
												onClick={() => { setProvider(""); setShowProviderMenu(false); }}
												className="w-full text-left px-3 py-1.5 text-[12px] text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
											>
												None
											</button>
										)}
										{PROVIDERS.map((p) => (
											<button
												key={p}
												onClick={() => { setProvider(p); setShowProviderMenu(false); }}
												className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors ${
													provider === p
														? "font-medium text-gray-900 dark:text-white"
														: "text-gray-700 dark:text-gray-300"
												}`}
											>
												{p}
											</button>
										))}
									</div>
								</>
							)}
						</div>

						{/* Edit button */}
						<button
							onClick={() => setEditing(true)}
							className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
							title="Edit key"
						>
							<PencilIcon />
						</button>

						{/* Eye toggle */}
						<button
							onClick={() => setVisible(!visible)}
							className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
							title={visible ? "Hide value" : "Reveal value"}
						>
							{visible ? <EyeIcon /> : <EyeSlashIcon />}
						</button>

						{/* Copy button */}
						<button
							onClick={handleCopy}
							className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
							title="Copy to clipboard"
						>
							{copied ? <CheckIcon /> : <CopyIcon />}
						</button>
					</div>
				</div>

				{/* Value input */}
				<div className="px-4 pb-2.5">
					<input
						type={visible ? "text" : "password"}
						value={entry.value}
						readOnly
						className="w-full px-3 py-2 rounded-md text-xs font-mono bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] text-gray-400 dark:text-gray-500 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors select-text"
					/>
				</div>

				{/* Metadata */}
				{(entry.addedAt || entry.lastRotated) && (
					<div className="px-4 pb-2.5 flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
						{entry.addedAt && <span>Added {timeAgo(entry.addedAt)}</span>}
						{entry.lastRotated && (
							<span>Rotated {timeAgo(entry.lastRotated)}</span>
						)}
					</div>
				)}
			</div>

			{/* Edit modal */}
			{editing &&
				createPortal(
					<EditKeyModal entry={entry} onClose={() => setEditing(false)} />,
					document.body,
				)}
		</>
	);
}

function RepoDetail() {
	const { name } = useParams<{ name: string }>();
	const navigate = useNavigate();
	const repo = MOCK_REPOS.find((r) => r.name === name);

	if (!repo) {
		return (
			<>
				<header
					className="h-[72px] shrink-0 flex items-center px-6 border-b border-gray-100 dark:border-white/[0.06]"
					style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
				>
					<button
						onClick={() => navigate("/")}
						className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
					>
						<ChevronLeftIcon />
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
						onClick={() => navigate("/")}
						className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
						style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
					>
						<ChevronLeftIcon />
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

			{/* Key list */}
			<div className="flex-1 overflow-y-auto p-6">
				<div className="space-y-6">
					{repo.envFiles.map((envFile) => (
						<section key={envFile.filename}>
							<div className="flex items-center gap-2 mb-3">
								<FileIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
								<h2 className="text-[13px] font-semibold font-mono text-gray-500 dark:text-gray-400">
									{envFile.filename}
								</h2>
								<span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
									{envFile.keys.length}
								</span>
							</div>
							<div className="space-y-2">
								{envFile.keys.map((key) => (
									<KeyRow key={key.name} entry={key} />
								))}
							</div>
						</section>
					))}
				</div>
			</div>
		</>
	);
}

// --- App Shell ---

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
					<Link to="/" className="flex items-center gap-2" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
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
