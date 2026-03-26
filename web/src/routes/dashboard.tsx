import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "../components/Logo";
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

function MinimalNav() {
  return (
    <nav className="h-20 border-b border-divider bg-cream/95 backdrop-blur-sm">
      <div className="h-full flex items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
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
  const { user } = db.useAuth();
  const { data, isLoading } = db.useQuery({
    licenses: { $: { where: { userId: user?.id ?? "" } } },
  });

  if (isLoading) {
    return (
      <div className="bg-cream text-jet min-h-screen">
        <MinimalNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-6 h-6 border-2 border-cobalt border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const license = data?.licenses?.[0];

  if (!license) {
    return <PurchasePrompt />;
  }

  return <LicenseDisplay licenseKey={license.licenseKey} />;
}

function PurchasePrompt() {
  const { user } = db.useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePurchase() {
    if (!user?.refresh_token) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        headers: { Authorization: `Bearer ${user.refresh_token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError("Failed to start checkout");
      setLoading(false);
    }
  }

  return (
    <div className="bg-cream text-jet min-h-screen">
      <MinimalNav />

      <section className="min-h-[80vh] border-t border-divider">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh]">
          <div className="hidden lg:flex lg:col-span-3 border-r border-divider px-8 py-16 flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              PURCHASE
            </span>
            <div className="w-4 h-4 bg-jet" />
          </div>

          <div className="col-span-1 lg:col-span-9 px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
            <h1 className="text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.03em] mb-6">
              GET
              <br />
              <span className="text-cobalt">DOTLOCK</span>
            </h1>

            <p className="text-lg text-deep-gray leading-relaxed max-w-lg mb-12">
              One-time purchase. No subscription. Unlock unlimited projects
              forever.
            </p>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button
              type="button"
              onClick={handlePurchase}
              disabled={loading}
              className="inline-block w-fit bg-cobalt text-cream px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-jet transition-colors duration-300 ease-linear cursor-pointer disabled:opacity-50"
            >
              {loading ? "LOADING..." : "PURCHASE LICENSE"}
            </button>
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

function LicenseDisplay({ licenseKey }: { licenseKey: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-cream text-jet min-h-screen">
      <MinimalNav />

      <section className="min-h-[80vh] border-t border-divider">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh]">
          <div className="hidden lg:flex lg:col-span-3 border-r border-divider px-8 py-16 flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              LICENSE
            </span>
            <div className="w-4 h-4 bg-jet" />
          </div>

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

            <div className="border border-divider max-w-lg mb-8">
              <div className="px-6 py-3 border-b border-divider">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  LICENSE KEY
                </span>
              </div>
              <div className="px-6 py-6 flex items-center justify-between gap-4">
                <code className="font-mono text-lg font-bold tracking-wide select-all break-all">
                  {licenseKey}
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
