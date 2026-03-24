import { useEffect, useState } from "react";
import * as rpc from "../rpc";
import {
  HeartIcon,
  InfinityIcon,
  LoaderIcon,
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
      onActivated();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
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
      <div className="relative w-full max-w-lg bg-white dark:bg-[#2a2a2a] rounded-xl shadow-2xl dark:shadow-black/40 border border-gray-200/60 dark:border-white/[0.08] overflow-hidden">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-5">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <XIcon size={18} />
          </button>

          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--system-accent) 10%, transparent)",
            }}
          >
            <SparklesIcon size={26} style={{ color: "var(--system-accent)" }} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Unlock Unlimited Projects
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
            You're on the free tier, which includes up to 2 projects per vault.
            A license unlocks the full power of dotlock — one-time purchase,
            yours forever.
          </p>
        </div>

        {/* Features — compact single-line items */}
        <div className="px-8 pb-5 flex flex-col gap-2.5">
          {[
            { icon: InfinityIcon, text: "Unlimited projects per vault" },
            { icon: ZapIcon, text: "All future updates included" },
            {
              icon: HeartIcon,
              text: "Support independent software development",
            },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0">
                <Icon size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[13px] text-gray-700 dark:text-gray-300">
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-8 border-t border-gray-100 dark:border-white/[0.06]" />

        {/* License key input */}
        <div className="px-8 pt-5 pb-5">
          <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
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
            className="w-full px-3.5 py-3 rounded-lg text-[12px] font-mono leading-relaxed bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors resize-none"
          />
          {error && (
            <p className="mt-2 text-[12px] text-red-500 dark:text-red-400 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={handleActivate}
            disabled={!key.trim() || activating}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white transition-all shadow-sm disabled:opacity-40"
            style={{ backgroundColor: "var(--system-accent)" }}
          >
            {activating ? (
              <>
                <LoaderIcon size={14} className="animate-spin" />
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
