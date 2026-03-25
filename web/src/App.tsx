type TerminalLine = {
  type: 'command' | 'output' | 'comment' | 'empty'
  text?: string
}

const features = [
  {
    index: '01',
    title: 'ENCRYPTED BACKUP',
    description:
      'Every .env file across every project, backed up in a single encrypted .dotlock vault. Your files on disk stay as-is \u2014 dotlock just makes sure you never lose them.',
  },
  {
    index: '02',
    title: 'DRIFT DETECTION',
    description:
      "Real-time file watching via native FSEvents. If someone \u2014 or something \u2014 changes or deletes your .env files, you'll know instantly and can restore from your vault.",
  },
  {
    index: '03',
    title: 'BIOMETRIC UNLOCK',
    description:
      'Vault password stored in the macOS Keychain, guarded by Touch ID. No cloud auth. No OAuth dance. Just press your thumb on the thing.',
  },
]

const reasons = [
  {
    index: '001',
    title: 'ZERO NETWORK ACCESS',
    description:
      "Not 'minimal network.' Not 'only phones home for updates.' Zero. The macOS sandbox enforces it at the kernel level.",
  },
  {
    index: '002',
    title: 'YOUR CLOUD, YOUR CHOICE',
    description:
      'Your vault is just a file. Keep it local, or sync it with iCloud Drive, Google Drive, Dropbox — whatever you already use. No proprietary cloud required.',
  },
  {
    index: '003',
    title: 'NO TELEMETRY',
    description:
      "We don't know how many vaults you have. We don't want to know.",
  },
  {
    index: '004',
    title: 'NATIVE MACOS',
    description:
      'Electrobun, not Electron. Real native performance, not a browser in a trenchcoat.',
  },
]

const networkLines: TerminalLine[] = [
  { type: 'comment', text: 'check if dotlock has any network entitlements' },
  {
    type: 'command',
    text: 'codesign -d --entitlements :- /Applications/dotlock.app \\',
  },
  { type: 'output', text: '    | grep -c "network"' },
  { type: 'empty' },
  { type: 'output', text: '0' },
  { type: 'empty' },
  { type: 'comment', text: "zero. your secrets aren't going anywhere." },
]


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
  )
}

function Terminal({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className="border border-divider bg-jet font-mono text-sm leading-relaxed overflow-x-auto">
      <div className="p-5 lg:p-6">
        {lines.map((line, i) => (
          <div key={i} className={line.type === 'empty' ? 'h-5' : undefined}>
            {line.type === 'command' && (
              <>
                <span className="text-cobalt select-none">$ </span>
                <span className="text-cream">{line.text}</span>
              </>
            )}
            {line.type === 'output' && (
              <span className="text-cream/70">{line.text}</span>
            )}
            {line.type === 'comment' && (
              <span className="text-muted">
                {'# '}
                {line.text}
              </span>
            )}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-cream/60 cursor-blink mt-1" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function Nav() {
  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-divider bg-cream/95 backdrop-blur-sm">
      <div className="h-full flex items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 10.25 80 103.75" className="w-5 h-5">
              <defs>
                <mask id="m">
                  <rect width="80" height="56" x="20" y="58" fill="#fff" rx="12" />
                  <text x="60" y="80" fontFamily="'SF Mono','Menlo','Monaco','Courier New',monospace" fontSize="17" fontWeight="700" textAnchor="middle">$ENV</text>
                  <path stroke="#000" strokeWidth="1.2" d="M32 88h56" />
                  <text x="60" y="103" fontFamily="'SF Mono','Menlo','Monaco','Courier New',monospace" fontSize="11" letterSpacing="3" textAnchor="middle">&#x25CF;&#x25CF;&#x25CF;</text>
                </mask>
              </defs>
              <path fill="none" stroke="#FFF" strokeLinecap="round" strokeWidth="7.5" d="M34 62V40a26 26 0 0 1 52 0v22" />
              <rect width="80" height="56" x="20" y="58" fill="#FFF" mask="url(#m)" rx="12" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>dotlock</span>
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
            href="#access"
            className="bg-cobalt text-cream px-4 py-2 text-sm font-bold tracking-wider hover:bg-jet transition-colors duration-300 ease-linear"
          >
            DOWNLOAD
          </a>
        </div>
      </div>
    </nav>
  )
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
              dotlock backs up every .env file across all your projects into a
              single encrypted vault on your Mac. Your files on disk stay
              as-is&nbsp;&mdash; dotlock just makes sure you never lose them.
            </p>
            <p className="text-base text-deep-gray mt-4 flex items-start gap-2">
              <img src="/bun-logo.svg" className="w-5 h-5 mt-0.5 shrink-0" alt="Bun" />
              <span>
                Tip: use{' '}
                <span className="font-mono font-bold text-jet">bun</span>{' '}
                instead of npm. It skips postinstall scripts by default, so a
                compromised package can't exfiltrate your .env files off disk.
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="#access"
              className="inline-block w-fit bg-cobalt text-cream px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-jet transition-colors duration-300 ease-linear"
            >
              DOWNLOAD FOR MACOS
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Screenshots() {
  return (
    <section className="border-t border-divider">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:border-r border-divider px-6 py-8 lg:px-8 lg:py-16">
          <SidebarLabel>THE APP</SidebarLabel>
        </div>
        <div className="lg:col-span-9 px-6 py-8 lg:px-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted block mb-3">
                DASHBOARD
              </span>
              <img
                src="/screenshot-dashboard.png"
                className="w-full border border-divider"
                alt="dotlock dashboard showing project overview"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted block mb-3">
                PROJECT DETAIL
              </span>
              <img
                src="/screenshot-detail.png"
                className="w-full border border-divider"
                alt="dotlock project detail showing encrypted keys"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
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
            BACKED UP.
            <br />
            WATCHED.
            <br />
            RESTORED.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-divider">
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
  )
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
  )
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

          {/* Network entitlements */}
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted block mb-3">
              NETWORK ENTITLEMENTS
            </span>
            <Terminal lines={networkLines} />
            <p className="text-sm text-deep-gray mt-4 max-w-lg">
              dotlock ships with zero network entitlements. The macOS sandbox
              enforces this at the kernel level&nbsp;&mdash; even if the app
              wanted to phone home, the OS would block it.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
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
              href="#"
              className="bg-jet text-cream px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-cobalt transition-colors duration-300 ease-linear inline-block"
            >
              DOWNLOAD FOR MACOS
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-divider px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-muted">
          &copy; {new Date().getFullYear()} dotlock
        </span>
        <span className="text-sm text-muted">
          Your secrets, backed up and accounted for
        </span>
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
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
  )
}
