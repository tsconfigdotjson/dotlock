import type { DotlockRPC, Repo, VaultMeta, VaultState } from "../shared/types";

// Derive the webview→bun request proxy from the DotlockRPC schema.
// electrobun doesn't export RPCRequestsProxy, so we map it ourselves.
type BunRequests = DotlockRPC["bun"]["requests"];
type DotlockRPCClient = {
  request: {
    [K in keyof BunRequests]: (
      params: BunRequests[K]["params"],
    ) => Promise<BunRequests[K]["response"]>;
  };
};

// The RPC instance is set up by initRPC() after the Electroview module loads.
// We store the rpc object here so the typed wrapper functions can use it.
let rpc: DotlockRPCClient | null = null;

// Callback for when the backend pushes a sync change notification.
type SyncChangedCallback = (repoName: string) => void;
let syncChangedCallback: SyncChangedCallback | null = null;

// Callback for when vault state changes.
type VaultStateCallback = (state: VaultState) => void;
let vaultStateCallback: VaultStateCallback | null = null;

/** Register a callback to be notified when the watcher detects file drift. */
export function onSyncChanged(cb: SyncChangedCallback): void {
  syncChangedCallback = cb;
}

/** Register a callback to be notified when vault state changes. */
export function onVaultStateChanged(cb: VaultStateCallback): void {
  vaultStateCallback = cb;
}

export async function initRPC(): Promise<void> {
  console.log("[dotlock] initRPC: __electrobun =", !!window.__electrobun);
  if (!window.__electrobun) {
    return;
  }

  try {
    const { Electroview } = await import("electrobun/view");
    console.log("[dotlock] Electroview loaded");
    const rpcInstance = Electroview.defineRPC<DotlockRPC>({
      maxRequestTime: 120_000,
      handlers: {
        requests: {},
        messages: {},
      },
    });
    new Electroview({ rpc: rpcInstance });
    rpc = rpcInstance;

    // Listen for push messages from the bun watcher
    rpcInstance.addMessageListener(
      "syncChanged",
      ({ repoName }: { repoName: string }) => {
        console.log("[dotlock] syncChanged push for:", repoName);
        if (syncChangedCallback) {
          syncChangedCallback(repoName);
        }
      },
    );

    // Listen for vault state changes
    rpcInstance.addMessageListener(
      "vaultStateChanged",
      ({ state }: { state: VaultState }) => {
        console.log("[dotlock] vaultStateChanged push:", state);
        if (vaultStateCallback) {
          vaultStateCallback(state);
        }
      },
    );

    console.log("[dotlock] RPC initialized successfully");
  } catch (e) {
    console.warn("[dotlock] Electrobun RPC not available:", e);
  }
}

// ── Vault lifecycle ─────────────────────────────────────────────────

export async function getVaultState(): Promise<VaultState> {
  if (!rpc) return "no_vault";
  try {
    return await rpc.request.getVaultState({});
  } catch (e) {
    console.error("[dotlock] getVaultState error:", e);
    return "no_vault";
  }
}

export async function getRecentVaults(): Promise<VaultMeta[]> {
  if (!rpc) return [];
  try {
    return await rpc.request.getRecentVaults({});
  } catch (e) {
    console.error("[dotlock] getRecentVaults error:", e);
    return [];
  }
}

export async function createVault(
  path: string,
  password: string,
): Promise<boolean> {
  if (!rpc) return false;
  try {
    return await rpc.request.createVault({ path, password });
  } catch (e) {
    console.error("[dotlock] createVault error:", e);
    return false;
  }
}

export async function openVault(
  path: string,
  password: string,
): Promise<boolean> {
  if (!rpc) return false;
  try {
    return await rpc.request.openVault({ path, password });
  } catch (e) {
    console.error("[dotlock] openVault error:", e);
    return false;
  }
}

export async function lockVault(): Promise<boolean> {
  if (!rpc) return false;
  try {
    return await rpc.request.lockVault({});
  } catch (e) {
    console.error("[dotlock] lockVault error:", e);
    return false;
  }
}

export async function pickVaultFile(): Promise<string | null> {
  if (!rpc) return null;
  try {
    return await rpc.request.pickVaultFile({});
  } catch (e) {
    console.error("[dotlock] pickVaultFile error:", e);
    return null;
  }
}

export async function pickVaultFolder(): Promise<string | null> {
  if (!rpc) return null;
  try {
    return await rpc.request.pickVaultFolder({});
  } catch (e) {
    console.error("[dotlock] pickVaultFolder error:", e);
    return null;
  }
}

// ── Keychain / Touch ID ─────────────────────────────────────────────

export async function hasKeychainPassword(
  vaultPath: string,
): Promise<boolean> {
  if (!rpc) return false;
  try {
    return await rpc.request.hasKeychainPassword({ vaultPath });
  } catch (e) {
    console.error("[dotlock] hasKeychainPassword error:", e);
    return false;
  }
}

export async function storeInKeychain(
  vaultPath: string,
  password: string,
): Promise<boolean> {
  if (!rpc) return false;
  try {
    return await rpc.request.storeInKeychain({ vaultPath, password });
  } catch (e) {
    console.error("[dotlock] storeInKeychain error:", e);
    return false;
  }
}

export async function retrieveFromKeychain(
  vaultPath: string,
): Promise<string | null> {
  if (!rpc) return null;
  try {
    return await rpc.request.retrieveFromKeychain({ vaultPath });
  } catch (e) {
    console.error("[dotlock] retrieveFromKeychain error:", e);
    return null;
  }
}

export async function removeFromKeychain(
  vaultPath: string,
): Promise<boolean> {
  if (!rpc) return false;
  try {
    return await rpc.request.removeFromKeychain({ vaultPath });
  } catch (e) {
    console.error("[dotlock] removeFromKeychain error:", e);
    return false;
  }
}

// ── Repo operations ─────────────────────────────────────────────────

export async function selectFolder(): Promise<Repo | null> {
  console.log("[dotlock] selectFolder called, rpc =", !!rpc);
  if (!rpc) {
    return null;
  }
  try {
    const result = await rpc.request.selectFolder({});
    console.log("[dotlock] selectFolder result:", result);
    return result;
  } catch (e) {
    console.error("[dotlock] selectFolder error:", e);
    return null;
  }
}

export async function getRepos(): Promise<Repo[]> {
  console.log("[dotlock] getRepos called, rpc =", !!rpc);
  if (!rpc) {
    return [];
  }
  try {
    const result = await rpc.request.getRepos({});
    console.log("[dotlock] getRepos result:", result);
    return result;
  } catch (e) {
    console.error("[dotlock] getRepos error:", e);
    return [];
  }
}

export async function getRepo(name: string): Promise<Repo | null> {
  if (!rpc) {
    return null;
  }
  try {
    return await rpc.request.getRepo({ name });
  } catch (e) {
    console.error("[dotlock] getRepo error:", e);
    return null;
  }
}

export async function removeRepo(name: string): Promise<boolean> {
  if (!rpc) {
    return false;
  }
  try {
    return await rpc.request.removeRepo({ name });
  } catch (e) {
    console.error("[dotlock] removeRepo error:", e);
    return false;
  }
}

export async function importFile(
  repoName: string,
  absolutePath: string,
): Promise<Repo | null> {
  if (!rpc) {
    return null;
  }
  try {
    return await rpc.request.importFile({ repoName, absolutePath });
  } catch (e) {
    console.error("[dotlock] importFile error:", e);
    return null;
  }
}

export async function restoreFile(
  repoName: string,
  absolutePath: string,
): Promise<Repo | null> {
  if (!rpc) {
    return null;
  }
  try {
    return await rpc.request.restoreFile({ repoName, absolutePath });
  } catch (e) {
    console.error("[dotlock] restoreFile error:", e);
    return null;
  }
}
