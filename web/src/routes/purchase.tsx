import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "../components/Logo";
import { db } from "../lib/db";

export const Route = createFileRoute("/purchase")({
  component: Purchase,
});

function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
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
      </div>
    </nav>
  );
}

function Purchase() {
  const { isLoading, user } = db.useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [isLoading, user, navigate]);

  if (isLoading || user) {
    return (
      <div className="bg-cream text-jet min-h-screen">
        <MinimalNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-6 h-6 border-2 border-cobalt border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const githubUrl = db.auth.createAuthorizationURL({
    clientName: "github-web",
    redirectURL: `${window.location.origin}/dashboard`,
  });

  const googleUrl = db.auth.createAuthorizationURL({
    clientName: "google-web",
    redirectURL: `${window.location.origin}/dashboard`,
  });

  return (
    <div className="bg-cream text-jet min-h-screen">
      <MinimalNav />

      <section className="min-h-[80vh] border-t border-divider">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh]">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:col-span-3 border-r border-divider px-8 py-16 flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              ACCESS
            </span>
            <div className="w-4 h-4 bg-jet" />
          </div>

          {/* Content */}
          <div className="col-span-1 lg:col-span-9 px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
            <h1 className="text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.03em] mb-6">
              GET YOUR
              <br />
              <span className="text-cobalt">LICENSE</span>
            </h1>

            <p className="text-lg text-deep-gray leading-relaxed max-w-lg mb-12">
              Sign in to purchase dotlock, recover your license key, or access
              your existing license. One-time purchase. No subscription.
            </p>

            <div className="flex flex-col gap-4 max-w-sm">
              <a
                href={githubUrl}
                className="flex items-center justify-center gap-3 bg-cobalt text-cream px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-jet transition-colors duration-300 ease-linear"
              >
                <GitHubIcon />
                SIGN IN WITH GITHUB
              </a>

              <a
                href={googleUrl}
                className="flex items-center justify-center gap-3 bg-jet text-cream px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-cobalt transition-colors duration-300 ease-linear"
              >
                <GoogleIcon />
                SIGN IN WITH GOOGLE
              </a>
            </div>

            <p className="text-sm text-muted mt-8 max-w-sm">
              We only use your account to identify your purchase. No data is
              stored beyond your email and license status.
            </p>
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
