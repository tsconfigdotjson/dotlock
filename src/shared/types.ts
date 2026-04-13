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
  relativePath: string;
  rawContent: string;
  keys: KeyEntry[];
  syncStatus: SyncStatus;
};

export type Repo = {
  name: string;
  envFiles: EnvFile[];
};

/**
 * A Repo enriched with the current machine's local root path. `rootPath` is
 * derived at response time from the repo-roots mapping, never persisted in
 * the vault. `null` means the repo is unlinked on this machine.
 */
export type RepoView = Repo & {
  rootPath: string | null;
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
      selectFolder: {
        params: Record<string, never>;
        response: RepoView | null;
      };
      getRepos: { params: Record<string, never>; response: RepoView[] };
      getRepo: { params: { name: string }; response: RepoView | null };
      removeRepo: { params: { name: string }; response: boolean };
      linkRepo: {
        params: { repoName: string; rootPath: string };
        response: RepoView | null;
      };
      pickRepoFolder: {
        params: Record<string, never>;
        response: string | null;
      };
      importFile: {
        params: { repoName: string; relativePath: string };
        response: RepoView | null;
      };
      restoreFile: {
        params: { repoName: string; relativePath: string };
        response: RepoView | null;
      };
      editKey: {
        params: {
          repoName: string;
          relativePath: string;
          keyName: string;
          value: string;
          provider: string;
        };
        response: RepoView | null;
      };
      deleteKey: {
        params: {
          repoName: string;
          relativePath: string;
          keyName: string;
        };
        response: RepoView | null;
      };
      addKey: {
        params: {
          repoName: string;
          relativePath: string;
          keyName: string;
          value: string;
          provider: string;
        };
        response: RepoView | null;
      };

      // Shell
      openExternal: { params: { url: string }; response: boolean };
    };
  }>;
  webview: RPCSchema<{
    messages: {
      syncChanged: { repoName: string };
      vaultStateChanged: { state: VaultState };
    };
  }>;
};
