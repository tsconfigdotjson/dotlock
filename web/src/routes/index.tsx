import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "../components/Logo";
import { DOWNLOAD_URL } from "../lib/constants";

export const Route = createFileRoute("/")({
  component: Index,
});

type TerminalLine = {
  id: string;
  type: "command" | "output" | "comment" | "empty";
  text?: string;
};

const features = [
  {
    index: "01",
    title: "LIVE EDITOR",
    description:
      "Add, edit, and delete keys across every project from one place. No more hunting through directories or opening files in a text editor.",
  },
  {
    index: "02",
    title: "ENCRYPTED BACKUP",
    description:
      "Every .env file backed up in a single AES-256-GCM encrypted vault with scrypt key derivation. Your files on disk stay as-is - dotlock just makes sure you never lose them.",
  },
  {
    index: "03",
    title: "DRIFT DETECTION",
    description:
      "Real-time file watching via native FSEvents. If someone - or something - changes or deletes your .env files, you'll know instantly and can restore from your vault.",
  },
  {
    index: "04",
    title: "BIOMETRIC UNLOCK",
    description:
      "Vault password stored in the macOS Keychain, guarded by Touch ID. No cloud auth. No OAuth dance. Just press your thumb on the thing.",
  },
];

const reasons = [
  {
    index: "001",
    title: "ZERO NETWORK ACCESS",
    description:
      "Not 'minimal network.' Not 'only phones home for updates.' Zero. The macOS sandbox enforces it at the kernel level.",
  },
  {
    index: "002",
    title: "YOUR CLOUD, YOUR CHOICE",
    description:
      "Your vault is just a file. Keep it local, or sync it with iCloud Drive, Google Drive, Dropbox - whatever you already use. No proprietary cloud required.",
  },
  {
    index: "003",
    title: "NO TELEMETRY",
    description:
      "We don't know how many vaults you have. We don't want to know.",
  },
  {
    index: "004",
    title: "NATIVE MACOS",
    description:
      "Your vault password lives in the hardware-backed keychain, locked behind Touch ID and the Secure Enclave. Not the basic keychain most apps settle for.",
  },
];

const verifyLines: TerminalLine[] = [
  {
    id: "s1",
    type: "comment",
    text: "verify the app is sandboxed",
  },
  {
    id: "s2",
    type: "command",
    text: "codesign -d --entitlements :- /Applications/dotlock.app \\",
  },
  { id: "s3", type: "output", text: '    | grep "app-sandbox"' },
  { id: "s4", type: "empty" },
  {
    id: "s5",
    type: "output",
    text: "<key>com.apple.security.app-sandbox</key>",
  },
  { id: "s6", type: "output", text: "<true/>" },
  { id: "s7", type: "empty" },
  {
    id: "s8",
    type: "comment",
    text: "now check for network entitlements",
  },
  {
    id: "s9",
    type: "command",
    text: "codesign -d --entitlements :- /Applications/dotlock.app \\",
  },
  { id: "s10", type: "output", text: '    | grep -c "network"' },
  { id: "s11", type: "empty" },
  { id: "s12", type: "output", text: "0" },
  { id: "s13", type: "empty" },
  {
    id: "s14",
    type: "comment",
    text: "sandboxed. zero network. your secrets aren't going anywhere.",
  },
];

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:sticky lg:top-28">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
        {children}
      </span>
    </div>
  );
}

function Terminal({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className="border border-divider bg-jet font-mono text-sm leading-relaxed overflow-x-auto">
      <div className="p-5 lg:p-6">
        {lines.map((line) => (
          <div
            key={line.id}
            className={line.type === "empty" ? "h-5" : undefined}
          >
            {line.type === "command" && (
              <>
                <span className="text-cobalt select-none">$ </span>
                <span className="text-cream">{line.text}</span>
              </>
            )}
            {line.type === "output" && (
              <span className="text-cream/70">{line.text}</span>
            )}
            {line.type === "comment" && (
              <span className="text-muted">
                {"# "}
                {line.text}
              </span>
            )}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-cream/60 cursor-blink mt-1" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function Nav() {
  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-divider bg-cream/95 backdrop-blur-sm">
      <div className="h-full flex items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span
            className="text-base font-bold tracking-tight"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
          >
            dotlock
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#system"
            className="text-sm font-semibold hover:text-cobalt transition-colors duration-300 ease-linear hidden md:block"
          >
            SYSTEM
          </a>
          <a
            href="#verify"
            className="text-sm font-semibold hover:text-cobalt transition-colors duration-300 ease-linear hidden md:block"
          >
            VERIFY
          </a>
          <a
            href={DOWNLOAD_URL}
            className="bg-cobalt text-cream px-4 py-2 text-sm font-bold tracking-wider hover:bg-jet transition-colors duration-300 ease-linear"
          >
            DOWNLOAD
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-12">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:col-span-3 border-r border-divider px-8 py-16 flex-col gap-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
          MANIFESTO
        </span>
        <div className="w-4 h-4 bg-jet" />
      </div>

      {/* Content */}
      <div className="col-span-1 lg:col-span-9 px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
        <h1 className="text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.85] tracking-[-0.04em] mb-8 lg:mb-12">
          YOUR SECRETS
          <br />
          DESERVE A<br />
          <span className="text-cobalt">VAULT</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="max-w-[400px]">
            <p className="text-lg text-deep-gray leading-relaxed">
              dotlock manages and backs up every .env file across all your
              projects. Edit keys, track changes, and restore files&nbsp;&mdash;
              all from a single encrypted vault on your Mac.
            </p>
            <p className="text-base text-deep-gray mt-4 flex items-start gap-2">
              <img
                src="/bun-logo.svg"
                className="w-5 h-5 mt-0.5 shrink-0"
                alt="Bun"
              />
              <span>
                Tip: use{" "}
                <span className="font-mono font-bold text-jet">bun</span>{" "}
                instead of npm. It skips postinstall scripts by default, so a
                compromised package can't exfiltrate your .env files off disk.
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={DOWNLOAD_URL}
              className="inline-block w-fit bg-cobalt text-cream px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-jet transition-colors duration-300 ease-linear"
            >
              DOWNLOAD FOR MACOS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScreenshotCard({
  src,
  alt,
  label,
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
  onOpen: (src: string, label: string) => void;
}) {
  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted block mb-3">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onOpen(src, label)}
        className="w-full text-left cursor-pointer group"
      >
        <img
          src={src}
          className="w-full border border-divider group-hover:border-jet/40 transition-[border-color] duration-300 ease-linear"
          alt={alt}
        />
      </button>
    </div>
  );
}

function Lightbox({
  src,
  label,
  onClose,
}: {
  src: string;
  label: string;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer"
      onClick={onClose}
      style={{
        backgroundColor: visible ? "rgba(20, 20, 20, 0.92)" : "transparent",
        transition: "background-color 350ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span
        className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cream/50 mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition:
            "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1) 150ms, transform 400ms cubic-bezier(0.22, 1, 0.36, 1) 150ms",
        }}
      >
        {label}
      </span>
      <img
        src={src}
        alt={label}
        className="border border-cream/10"
        style={{
          maxWidth: "min(90vw, 1100px)",
          maxHeight: "80vh",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.92)",
          transition:
            "opacity 350ms cubic-bezier(0.22, 1, 0.36, 1), transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <span
        className="font-mono text-[11px] text-cream/30 mt-4"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
        }}
      >
        ESC / CLICK TO CLOSE
      </span>
    </div>
  );
}

const screenshots = [
  {
    src: "/screenshot-dashboard.png",
    alt: "dotlock dashboard showing project overview",
    label: "DASHBOARD",
  },
  {
    src: "/screenshot-detail.png",
    alt: "dotlock project detail showing key management",
    label: "MANAGE KEYS",
  },
  {
    src: "/screenshot-add.png",
    alt: "dotlock new key dialog",
    label: "ADD KEY",
  },
  {
    src: "/screenshot-edit.png",
    alt: "dotlock edit key dialog",
    label: "EDIT KEY",
  },
  {
    src: "/screenshot-drift.png",
    alt: "dotlock drift detection showing file changed on disk",
    label: "DRIFT DETECTION",
  },
];

function Screenshots() {
  const [lightbox, setLightbox] = useState<{
    src: string;
    label: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === "left" ? -cardWidth - 24 : cardWidth + 24,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="border-t border-divider">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-3 lg:border-r border-divider px-6 py-8 lg:px-8 lg:py-16">
            <SidebarLabel>THE APP</SidebarLabel>
          </div>
          <div className="lg:col-span-9 px-6 py-8 lg:px-12 lg:py-16">
            {/* Navigation arrows */}
            <div className="flex items-center justify-end gap-2 mb-4">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-9 h-9 flex items-center justify-center border border-divider text-jet hover:bg-jet hover:text-cream disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Previous screenshot"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-9 h-9 flex items-center justify-center border border-divider text-jet hover:bg-jet hover:text-cream disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Next screenshot"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
            </div>

            {/* Scrollable track */}
            <div
              ref={scrollRef}
              data-screenshot-track=""
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              <style>{`[data-screenshot-track]::-webkit-scrollbar { display: none; }`}</style>
              {screenshots.map((s, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[85%] md:w-[calc(50%-12px)]"
                >
                  <ScreenshotCard
                    src={s.src}
                    alt={s.alt}
                    label={s.label}
                    onOpen={(src, label) => setLightbox({ src, label })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          label={lightbox.label}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function System() {
  return (
    <section id="system" className="border-t border-divider">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:border-r border-divider px-6 py-8 lg:px-8 lg:py-16">
          <SidebarLabel>SYSTEM</SidebarLabel>
        </div>
        <div className="lg:col-span-9 px-6 py-12 lg:px-12 lg:py-16">
          <h2 className="text-[clamp(3rem,6vw,7rem)] font-bold leading-[0.9] tracking-[-0.03em] mb-12">
            MANAGED.
            <br />
            WATCHED.
            <br />
            BACKED UP.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-divider">
            {features.map((f) => (
              <div
                key={f.index}
                className="border-b border-r border-divider p-6 lg:p-8 hover:bg-white/20 transition-colors duration-300 ease-linear"
              >
                <span className="font-mono text-sm text-muted block mb-4">
                  {f.index}
                </span>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-deep-gray leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyDifferent() {
  return (
    <section className="border-t border-divider">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:border-r border-divider px-6 py-8 lg:px-8 lg:py-16">
          <SidebarLabel>WHY DIFFERENT</SidebarLabel>
        </div>
        <div className="lg:col-span-9 px-6 py-8 lg:px-12 lg:py-12">
          {reasons.map((r) => (
            <div
              key={r.index}
              className="group border-t border-divider flex items-start gap-6 lg:gap-8 py-6 lg:py-8 cursor-default"
            >
              <span className="font-mono text-sm text-muted mt-1 lg:mt-3 shrink-0">
                {r.index}
              </span>
              <div>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] leading-[0.95] group-hover:text-cobalt transition-colors duration-300 ease-linear">
                  {r.title}
                </h3>
                <p className="text-sm text-deep-gray mt-2 max-w-lg">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Verify() {
  return (
    <section id="verify" className="border-t border-divider">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:border-r border-divider px-6 py-8 lg:px-8 lg:py-16">
          <SidebarLabel>VERIFY</SidebarLabel>
        </div>
        <div className="lg:col-span-9 px-6 py-12 lg:px-12 lg:py-16">
          <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[0.9] tracking-[-0.03em] mb-6">
            DON'T TRUST US.
            <br />
            <span className="text-cobalt">VERIFY.</span>
          </h2>
          <p className="text-lg text-deep-gray leading-relaxed max-w-xl mb-12">
            We could tell you dotlock never touches the network. Or you could
            check yourself.
          </p>

          {/* Sandbox + network entitlements - coming soon */}
          <div className="relative mb-12">
            <div className="opacity-[0.12] select-none pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted block mb-3">
                SANDBOX &amp; NETWORK ENTITLEMENTS
              </span>
              <Terminal lines={verifyLines} />
              <p className="text-sm text-deep-gray mt-4 max-w-lg">
                dotlock ships with zero network entitlements. The macOS sandbox
                enforces this at the kernel level&nbsp;&mdash; even if the app
                wanted to phone home, the OS would block it.
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-jet/50 border border-jet/20 px-6 py-3">
                COMING SOON
              </span>
              <p className="text-sm text-deep-gray/70 mt-4 max-w-sm text-center">
                macOS App Sandbox requires a{" "}
                <a
                  href="https://github.com/oven-sh/bun/pull/27041"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-2 hover:text-cobalt transition-colors"
                >
                  Bun runtime fix
                </a>{" "}
                for sandbox-safe process initialization. Once it ships, dotlock
                gets kernel-level network enforcement for free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Access() {
  return (
    <section id="access" className="min-h-[50vh] border-t border-divider">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[50vh]">
        <div className="lg:col-span-3 lg:border-r border-divider px-6 py-8 lg:px-8 lg:py-16">
          <SidebarLabel>ACCESS</SidebarLabel>
        </div>
        <div className="lg:col-span-9 px-6 py-12 lg:px-12 lg:py-16 flex flex-col justify-between min-h-[40vh]">
          <div>
            <h2 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.03em] mb-8">
              START
              <br />
              EXPLORING
            </h2>
            <p className="text-lg text-deep-gray max-w-lg leading-relaxed">
              Free for up to 2 projects. One-time purchase for unlimited.
              <br />
              No subscription. No account. No cloud. Just a license key.
            </p>
          </div>
          <div className="mt-12 flex justify-start lg:justify-end">
            <a
              href={DOWNLOAD_URL}
              className="bg-jet text-cream px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-cobalt transition-colors duration-300 ease-linear inline-block"
            >
              DOWNLOAD FOR MACOS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-divider px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-muted">
          &copy; {new Date().getFullYear()} dotlock
        </span>
        <span className="text-sm text-muted">
          Manage, protect, and never lose your secrets
        </span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function Index() {
  return (
    <div className="bg-cream text-jet min-h-screen">
      <Nav />
      <Hero />
      <Screenshots />
      <System />
      <WhyDifferent />
      <Verify />
      <Access />
      <Footer />
    </div>
  );
}
