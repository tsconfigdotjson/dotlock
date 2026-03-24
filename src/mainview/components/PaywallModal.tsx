import { useEffect, useState } from "react";
import * as rpc from "../rpc";
import {
  ChevronDownIcon,
  HeartIcon,
  InfinityIcon,
  LoaderIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XIcon,
  ZapIcon,
} from "./icons";

export function PaywallModal({
  onActivated,
  onClose,
}: {
  onActivated: () => void;
  onClose: () => void;
}) {
  const [key, setKey] = useState("");
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const handleKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    const formatted = raw.match(/.{1,5}/g)?.join("-") || raw;
    setKey(formatted);
    setError("");
  };

  const handleActivate = async () => {
    if (!key.trim()) {
      return;
    }
    setActivating(true);
    setError("");
    const result = await rpc.activateLicense(key.trim());
    setActivating(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(onActivated, 1400);
    } else {
      setError(result.error || "Invalid license key");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && key.trim() && !activating) {
      e.preventDefault();
      handleActivate();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ── Success state ──────────────────────────────────────────────

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
        <div className="absolute inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-sm" />
        <div className="relative w-full max-w-sm bg-white dark:bg-[#2a2a2a] rounded-xl shadow-2xl dark:shadow-black/40 border border-gray-200/60 dark:border-white/[0.08] overflow-hidden text-center py-10 px-8">
          <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon
              size={28}
              className="text-green-500 dark:text-green-400"
            />
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
            License Activated
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">
            Thank you for supporting dotlock!
          </p>
        </div>
      </div>
    );
  }

  // ── Main paywall ───────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="absolute inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#2a2a2a] rounded-xl shadow-2xl dark:shadow-black/40 border border-gray-200/60 dark:border-white/[0.08] overflow-hidden">
        {/* Header — compact inline layout */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <XIcon size={16} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-500/10 dark:to-violet-500/10 flex items-center justify-center shrink-0 shadow-sm shadow-blue-100/50 dark:shadow-none">
              <SparklesIcon
                size={20}
                className="text-blue-500 dark:text-blue-400"
              />
            </div>
            <div className="min-w-0 pt-0.5">
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                Unlock Unlimited Projects
              </h2>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                The free tier includes 2 projects. A license removes the limit —
                one-time purchase, yours forever.
              </p>
            </div>
          </div>

          {/* Inline primary feature */}
          <div className="flex items-center gap-2.5 mt-4 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-white/[0.04]">
            <InfinityIcon
              size={16}
              className="text-gray-500 dark:text-gray-400 shrink-0"
            />
            <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200">
              Unlimited projects per vault
            </span>
          </div>

          {/* Collapsible extras */}
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex items-center gap-1.5 mt-3 text-[12px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ChevronDownIcon
              size={12}
              className={`transition-transform ${moreOpen ? "rotate-180" : ""}`}
            />
            Why support dotlock?
          </button>

          {moreOpen && (
            <div className="mt-2.5 space-y-2 pl-0.5">
              <div className="flex items-center gap-2.5">
                <ZapIcon
                  size={13}
                  className="text-gray-400 dark:text-gray-500 shrink-0"
                />
                <span className="text-[12px] text-gray-500 dark:text-gray-400">
                  All future updates included
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <HeartIcon
                  size={13}
                  className="text-gray-400 dark:text-gray-500 shrink-0"
                />
                <span className="text-[12px] text-gray-500 dark:text-gray-400">
                  Built by an independent developer
                </span>
              </div>
            </div>
          )}
        </div>

        {/* License key input */}
        <div className="px-6 pb-5">
          <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
            License Key
          </label>
          <textarea
            value={key}
            onChange={handleKeyChange}
            onKeyDown={handleKeyDown}
            placeholder="XXXXX-XXXXX-XXXXX-XXXXX-..."
            rows={3}
            spellCheck={false}
            autoComplete="off"
            className="w-full px-3 py-2.5 rounded-lg text-[11px] font-mono leading-relaxed bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors resize-none"
          />
          {error && (
            <p className="mt-1.5 text-[11px] text-red-500 dark:text-red-400 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={handleActivate}
            disabled={!key.trim() || activating}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all shadow-sm disabled:opacity-40"
            style={{ backgroundColor: "var(--system-accent)" }}
          >
            {activating ? (
              <>
                <LoaderIcon size={13} className="animate-spin" />
                Activating...
              </>
            ) : (
              "Activate License"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
