import type { RPCSchema } from "electrobun/bun";

export type KeyEntry = {
  name: string;
  value: string;
  provider?: string;
  addedAt?: string;
  lastRotated?: string;
};

export type SyncStatus = "synced" | "disk_changed" | "missing";

export type EnvFile = {
  filename: string;
  absolutePath: string;
  rawContent: string;
  keys: KeyEntry[];
  syncStatus: SyncStatus;
};

export type Repo = {
  name: string;
  path: string;
  envFiles: EnvFile[];
};

// ── Vault types ─────────────────────────────────────────────────────

export type VaultState = "no_vault" | "locked" | "unlocked";

export type VaultMeta = {
  path: string;
  name: string;
  lastOpened: string; // ISO date
  keychainEnabled?: boolean;
};

export type VaultData = {
  version: number;
  repos: Repo[];
  createdAt: string;
  lastModified: string;
};

// ── License types ───────────────────────────────────────────────────

export type LicenseInfo = {
  licensed: boolean;
};

export type ActivationResult = {
  success: boolean;
  error?: string;
};

// ── Update types ────────────────────────────────────────────────────

export type UpdateStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "no-update"; version: string }
  | { state: "available"; version: string }
  | { state: "downloading"; progress?: number }
  | { state: "ready"; version: string }
  | { state: "error"; message: string };

// ── RPC schema ──────────────────────────────────────────────────────

export type DotlockRPC = {
  bun: RPCSchema<{
    requests: {
      // Vault lifecycle
      getVaultState: {
        params: Record<string, never>;
        response: VaultState;
      };
      getRecentVaults: {
        params: Record<string, never>;
        response: VaultMeta[];
      };
      createVault: {
        params: { path: string; password: string };
        response: boolean;
      };
      openVault: {
        params: { path: string; password: string };
        response: boolean;
      };
      lockVault: {
        params: Record<string, never>;
        response: boolean;
      };
      pickVaultFile: {
        params: Record<string, never>;
        response: string | null;
      };
      pickVaultFolder: {
        params: Record<string, never>;
        response: string | null;
      };
      removeRecentVault: {
        params: { path: string };
        response: boolean;
      };

      // Keychain / Touch ID
      hasKeychainPassword: {
        params: { vaultPath: string };
        response: boolean;
      };
      storeInKeychain: {
        params: { vaultPath: string; password: string };
        response: boolean;
      };
      retrieveFromKeychain: {
        params: { vaultPath: string };
        response: string | null;
      };
      removeFromKeychain: {
        params: { vaultPath: string };
        response: boolean;
      };

      // Appearance
      getAccentColor: {
        params: Record<string, never>;
        response: string | null;
      };

      // Existing repo operations
      selectFolder: { params: Record<string, never>; response: Repo | null };
      getRepos: { params: Record<string, never>; response: Repo[] };
      getRepo: { params: { name: string }; response: Repo | null };
      removeRepo: { params: { name: string }; response: boolean };
      importFile: {
        params: { repoName: string; absolutePath: string };
        response: Repo | null;
      };
      restoreFile: {
        params: { repoName: string; absolutePath: string };
        response: Repo | null;
      };
      editKey: {
        params: {
          repoName: string;
          absolutePath: string;
          keyName: string;
          value: string;
          provider: string;
        };
        response: Repo | null;
      };
      deleteKey: {
        params: {
          repoName: string;
          absolutePath: string;
          keyName: string;
        };
        response: Repo | null;
      };
      addKey: {
        params: {
          repoName: string;
          absolutePath: string;
          keyName: string;
          value: string;
          provider: string;
        };
        response: Repo | null;
      };

      // License
      activateLicense: {
        params: { key: string };
        response: ActivationResult;
      };
      getLicenseStatus: {
        params: Record<string, never>;
        response: LicenseInfo;
      };

      // Update
      checkForUpdate: {
        params: Record<string, never>;
        response: UpdateStatus;
      };
      applyUpdate: {
        params: Record<string, never>;
        response: boolean;
      };
    };
  }>;
  webview: RPCSchema<{
    messages: {
      syncChanged: { repoName: string };
      vaultStateChanged: { state: VaultState };
      updateStatusChanged: { status: UpdateStatus };
    };
  }>;
};
