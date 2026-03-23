import { useState } from "react";
import * as rpc from "../rpc";
import { EyeIcon, EyeSlashIcon, FingerprintIcon, LockIcon } from "./icons";

type Props = {
  mode: "open" | "create";
  vaultPath: string;
  vaultName: string;
  hasKeychain: boolean;
  onBack: () => void;
  onUnlocked: () => void;
};

export function PasswordPrompt({
  mode,
  vaultPath,
  vaultName,
  hasKeychain,
  onBack,
  onUnlocked,
}: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saveToKeychain, setSaveToKeychain] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (mode === "create" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    setLoading(true);

    try {
      let success: boolean;
      if (mode === "create") {
        success = await rpc.createVault(vaultPath, password);
      } else {
        success = await rpc.openVault(vaultPath, password);
      }

      if (success) {
        if (saveToKeychain) {
          await rpc.storeInKeychain(vaultPath, password);
        }
        onUnlocked();
      } else {
        setError(
          mode === "create"
            ? "Failed to create vault."
            : "Incorrect password. Please try again.",
        );
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleTouchID = async () => {
    setError(null);
    setLoading(true);

    try {
      const keychainPassword = await rpc.retrieveFromKeychain(vaultPath);
      if (!keychainPassword) {
        setError("Touch ID failed or was cancelled.");
        setLoading(false);
        return;
      }

      const success = await rpc.openVault(vaultPath, keychainPassword);
      if (success) {
        onUnlocked();
      } else {
        setError("Stored password is incorrect. Please enter it manually.");
      }
    } catch {
      setError("Touch ID failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100">
      {/* Drag region */}
      <div
        className="h-[72px] shrink-0"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      />

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-[72px]">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
              <LockIcon size={28} className="text-white" />
            </div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {vaultName}
            </h1>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono truncate max-w-full mt-1">
              {vaultPath}
            </p>
          </div>

          {/* Touch ID button (open mode with keychain only) */}
          {hasKeychain && mode === "open" && (
            <>
              <button
                type="button"
                onClick={handleTouchID}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg text-[13px] font-medium border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FingerprintIcon
                  size={20}
                  className="text-gray-500 dark:text-gray-400"
                />
                Unlock with Touch ID
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.08]" />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  or enter password
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.08]" />
              </div>
            </>
          )}

          {/* Password field */}
          <div>
            <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2.5 pr-10 rounded-lg text-[13px] font-mono bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-2.5 p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeIcon size={16} />
                ) : (
                  <EyeSlashIcon size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm password (create mode) */}
          {mode === "create" && (
            <div className="mt-4">
              <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2.5 rounded-lg text-[13px] font-mono bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[var(--system-accent)] focus:ring-1 focus:ring-[var(--system-accent)]/30 transition-colors"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/[0.08] border border-red-200/60 dark:border-red-500/20">
              <p className="text-[12px] text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Save to keychain checkbox (open mode) */}
          {mode === "open" && !hasKeychain && (
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={saveToKeychain}
                onChange={(e) => setSaveToKeychain(e.target.checked)}
                className="w-4 h-4 rounded border border-gray-300 dark:border-white/[0.15]"
                style={{ accentColor: "var(--system-accent)" }}
              />
              <span className="text-[12px] text-gray-500 dark:text-gray-400">
                Save password to Keychain (Touch ID)
              </span>
            </label>
          )}

          {/* Submit button */}
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-[13px] font-medium text-white shadow-sm transition-colors disabled:opacity-50"
              style={{ backgroundColor: "var(--system-accent)" }}
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Unlocking..."
                : mode === "create"
                  ? "Create Vault"
                  : "Unlock"}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="text-center text-[12px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-1"
            >
              Back to vault picker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
