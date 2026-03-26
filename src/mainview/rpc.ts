import type {
  ActivationResult,
  DotlockRPC,
  LicenseInfo,
  Repo,
  UpdateStatus,
  VaultMeta,
  VaultState,
} from "../shared/types";

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

/** Generic RPC wrapper: guards against null rpc, catches errors, returns fallback. */
function rpcCall<T>(
  fn: (client: DotlockRPCClient) => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!rpc) {
    return Promise.resolve(fallback);
  }
  return fn(rpc).catch(() => fallback);
}

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

// Callback for update status changes.
type UpdateStatusCallback = (status: UpdateStatus) => void;
let updateStatusCallback: UpdateStatusCallback | null = null;

/** Register a callback to be notified when update status changes. */
export function onUpdateStatusChanged(cb: UpdateStatusCallback): void {
  updateStatusCallback = cb;
}

export async function initRPC(): Promise<void> {
  if (!window.__electrobun) {
    return;
  }

  try {
    const { Electroview } = await import("electrobun/view");
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
        if (syncChangedCallback) {
          syncChangedCallback(repoName);
        }
      },
    );

    // Listen for vault state changes
    rpcInstance.addMessageListener(
      "vaultStateChanged",
      ({ state }: { state: VaultState }) => {
        if (vaultStateCallback) {
          vaultStateCallback(state);
        }
      },
    );

    // Listen for update status changes
    rpcInstance.addMessageListener(
      "updateStatusChanged",
      ({ status }: { status: UpdateStatus }) => {
        if (updateStatusCallback) {
          updateStatusCallback(status);
        }
      },
    );
  } catch {
    // Electrobun RPC not available (e.g. running in browser for dev)
  }
}

// ── Vault lifecycle ─────────────────────────────────────────────────

export function getVaultState(): Promise<VaultState> {
  return rpcCall((r) => r.request.getVaultState({}), "no_vault");
}

export function getRecentVaults(): Promise<VaultMeta[]> {
  return rpcCall((r) => r.request.getRecentVaults({}), []);
}

export function createVault(path: string, password: string): Promise<boolean> {
  return rpcCall((r) => r.request.createVault({ path, password }), false);
}

export function openVault(path: string, password: string): Promise<boolean> {
  return rpcCall((r) => r.request.openVault({ path, password }), false);
}

export function lockVault(): Promise<boolean> {
  return rpcCall((r) => r.request.lockVault({}), false);
}

export function pickVaultFile(): Promise<string | null> {
  return rpcCall((r) => r.request.pickVaultFile({}), null);
}

export function pickVaultFolder(): Promise<string | null> {
  return rpcCall((r) => r.request.pickVaultFolder({}), null);
}

export function removeRecentVault(path: string): Promise<boolean> {
  return rpcCall((r) => r.request.removeRecentVault({ path }), false);
}

// ── Keychain / Touch ID ─────────────────────────────────────────────

export function hasKeychainPassword(vaultPath: string): Promise<boolean> {
  return rpcCall((r) => r.request.hasKeychainPassword({ vaultPath }), false);
}

export function storeInKeychain(
  vaultPath: string,
  password: string,
): Promise<boolean> {
  return rpcCall(
    (r) => r.request.storeInKeychain({ vaultPath, password }),
    false,
  );
}

export function retrieveFromKeychain(
  vaultPath: string,
): Promise<string | null> {
  return rpcCall((r) => r.request.retrieveFromKeychain({ vaultPath }), null);
}

export function removeFromKeychain(vaultPath: string): Promise<boolean> {
  return rpcCall((r) => r.request.removeFromKeychain({ vaultPath }), false);
}

// ── Appearance ──────────────────────────────────────────────────────

export function getAccentColor(): Promise<string | null> {
  return rpcCall((r) => r.request.getAccentColor({}), null);
}

// ── Repo operations ─────────────────────────────────────────────────

export function selectFolder(): Promise<Repo | null> {
  return rpcCall((r) => r.request.selectFolder({}), null);
}

export function getRepos(): Promise<Repo[]> {
  return rpcCall((r) => r.request.getRepos({}), []);
}

export function getRepo(name: string): Promise<Repo | null> {
  return rpcCall((r) => r.request.getRepo({ name }), null);
}

export function removeRepo(name: string): Promise<boolean> {
  return rpcCall((r) => r.request.removeRepo({ name }), false);
}

export function importFile(
  repoName: string,
  absolutePath: string,
): Promise<Repo | null> {
  return rpcCall((r) => r.request.importFile({ repoName, absolutePath }), null);
}

export function restoreFile(
  repoName: string,
  absolutePath: string,
): Promise<Repo | null> {
  return rpcCall(
    (r) => r.request.restoreFile({ repoName, absolutePath }),
    null,
  );
}

export function editKey(
  repoName: string,
  absolutePath: string,
  keyName: string,
  value: string,
  provider: string,
): Promise<Repo | null> {
  return rpcCall(
    (r) =>
      r.request.editKey({ repoName, absolutePath, keyName, value, provider }),
    null,
  );
}

export function deleteKey(
  repoName: string,
  absolutePath: string,
  keyName: string,
): Promise<Repo | null> {
  return rpcCall(
    (r) => r.request.deleteKey({ repoName, absolutePath, keyName }),
    null,
  );
}

export function addKey(
  repoName: string,
  absolutePath: string,
  keyName: string,
  value: string,
  provider: string,
): Promise<Repo | null> {
  return rpcCall(
    (r) =>
      r.request.addKey({ repoName, absolutePath, keyName, value, provider }),
    null,
  );
}

// ── License ──────────────────────────────────────────────────────────

export function activateLicense(key: string): Promise<ActivationResult> {
  return rpcCall((r) => r.request.activateLicense({ key }), {
    success: false,
    error: "RPC not available",
  });
}

export function getLicenseStatus(): Promise<LicenseInfo> {
  return rpcCall((r) => r.request.getLicenseStatus({}), { licensed: false });
}

// ── Update ──────────────────────────────────────────────────────────

export function checkForUpdate(): Promise<UpdateStatus> {
  return rpcCall((r) => r.request.checkForUpdate({}), { state: "idle" });
}

export function applyUpdate(): Promise<boolean> {
  return rpcCall((r) => r.request.applyUpdate({}), false);
}
