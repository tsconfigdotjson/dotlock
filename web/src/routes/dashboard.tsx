import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db } from "../lib/db";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <>
      <db.SignedIn>
        <DashboardContent />
      </db.SignedIn>
      <db.SignedOut>
        <RedirectToPurchase />
      </db.SignedOut>
    </>
  );
}

function RedirectToPurchase() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/purchase" });
  }, [navigate]);
  return null;
}

const DUMMY_LICENSE_KEY = "DOTLOCK-7F3A-K9X2-M4PL-W8BN";

function MinimalNav() {
  return (
    <nav className="h-20 border-b border-divider bg-cream/95 backdrop-blur-sm">
      <div className="h-full flex items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="20 10.25 80 103.75"
              className="w-5 h-5"
            >
              <defs>
                <mask id="m-dashboard">
                  <rect
                    width="80"
                    height="56"
                    x="20"
                    y="58"
                    fill="#fff"
                    rx="12"
                  />
                  <text
                    x="60"
                    y="80"
                    fontFamily="'SF Mono','Menlo','Monaco','Courier New',monospace"
                    fontSize="17"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    $ENV
                  </text>
                  <path stroke="#000" strokeWidth="1.2" d="M32 88h56" />
                  <text
                    x="60"
                    y="103"
                    fontFamily="'SF Mono','Menlo','Monaco','Courier New',monospace"
                    fontSize="11"
                    letterSpacing="3"
                    textAnchor="middle"
                  >
                    &#x25CF;&#x25CF;&#x25CF;
                  </text>
                </mask>
              </defs>
              <path
                fill="none"
                stroke="#FFF"
                strokeLinecap="round"
                strokeWidth="7.5"
                d="M34 62V40a26 26 0 0 1 52 0v22"
              />
              <rect
                width="80"
                height="56"
                x="20"
                y="58"
                fill="#FFF"
                mask="url(#m-dashboard)"
                rx="12"
              />
            </svg>
          </div>
          <span
            className="text-base font-bold tracking-tight"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            }}
          >
            dotlock
          </span>
        </Link>

        <button
          type="button"
          onClick={() => db.auth.signOut()}
          className="text-sm font-semibold text-muted hover:text-cobalt transition-colors duration-300 ease-linear cursor-pointer"
        >
          SIGN OUT
        </button>
      </div>
    </nav>
  );
}

function DashboardContent() {
  const [copied, setCopied] = useState(false);

  // TODO: Check purchase status here. If not purchased, redirect to Stripe:
  // window.location.href = "https://stripe.com";
  // For now, assume everyone has purchased.

  function handleCopy() {
    navigator.clipboard.writeText(DUMMY_LICENSE_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-cream text-jet min-h-screen">
      <MinimalNav />

      <section className="min-h-[80vh] border-t border-divider">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh]">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:col-span-3 border-r border-divider px-8 py-16 flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              LICENSE
            </span>
            <div className="w-4 h-4 bg-jet" />
          </div>

          {/* Content */}
          <div className="col-span-1 lg:col-span-9 px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
            <h1 className="text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.03em] mb-6">
              YOUR
              <br />
              <span className="text-cobalt">LICENSE</span>
            </h1>

            <p className="text-lg text-deep-gray leading-relaxed max-w-lg mb-12">
              Copy this key and paste it into dotlock to unlock unlimited
              projects.
            </p>

            {/* License key display */}
            <div className="border border-divider max-w-lg mb-8">
              <div className="px-6 py-3 border-b border-divider">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  LICENSE KEY
                </span>
              </div>
              <div className="px-6 py-6 flex items-center justify-between gap-4">
                <code className="font-mono text-lg font-bold tracking-wide select-all">
                  {DUMMY_LICENSE_KEY}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-jet text-cream px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-cobalt transition-colors duration-300 ease-linear shrink-0 cursor-pointer"
                >
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#access"
                className="inline-block w-fit bg-cobalt text-cream px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-jet transition-colors duration-300 ease-linear"
              >
                DOWNLOAD DOTLOCK
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-divider px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted">
            &copy; {new Date().getFullYear()} dotlock
          </span>
          <Link
            to="/"
            className="text-sm text-muted hover:text-cobalt transition-colors duration-300 ease-linear"
          >
            Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
