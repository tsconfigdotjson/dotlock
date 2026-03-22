import type { DotlockRPC, Repo } from "../shared/types";

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

/** Register a callback to be notified when the watcher detects file drift. */
export function onSyncChanged(cb: SyncChangedCallback): void {
  syncChangedCallback = cb;
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

    console.log("[dotlock] RPC initialized successfully");
  } catch (e) {
    console.warn("[dotlock] Electrobun RPC not available:", e);
  }
}

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

export async function dismissDrift(
  repoName: string,
  absolutePath: string,
): Promise<Repo | null> {
  if (!rpc) {
    return null;
  }
  try {
    return await rpc.request.dismissDrift({ repoName, absolutePath });
  } catch (e) {
    console.error("[dotlock] dismissDrift error:", e);
    return null;
  }
}
