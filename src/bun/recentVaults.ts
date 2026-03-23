import { existsSync, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { VaultMeta } from "../shared/types";
import { atomicWrite } from "./atomicWrite";

const MAX_RECENTS = 10;

/** Override for testing — when set, used instead of ~/.dotlock. */
let dataDirOverride: string | null = null;

/** Set a custom data directory (for testing). Pass null to reset. */
export function setDataDir(dir: string | null): void {
  dataDirOverride = dir;
}

function getDataDir(): string {
  const dir = dataDirOverride ?? join(homedir(), ".dotlock");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function getRecentsPath(): string {
  return join(getDataDir(), "recent-vaults.json");
}

/** Read recent vaults, filtering out entries whose files no longer exist. */
export async function getRecentVaults(): Promise<VaultMeta[]> {
  const path = getRecentsPath();
  try {
    const raw = await readFile(path, "utf-8");
    const entries: VaultMeta[] = JSON.parse(raw);
    return entries.filter((e) => existsSync(e.path));
  } catch {
    return [];
  }
}

/** Add or update a recent vault entry (upserts by path). */
export async function addRecentVault(meta: VaultMeta): Promise<void> {
  const existing = await getRecentVaultsRaw();
  const filtered = existing.filter((e) => e.path !== meta.path);
  const updated = [meta, ...filtered].slice(0, MAX_RECENTS);
  await writeRecents(updated);
}

/** Remove a recent vault entry by path. */
export async function removeRecentVault(path: string): Promise<void> {
  const existing = await getRecentVaultsRaw();
  const updated = existing.filter((e) => e.path !== path);
  await writeRecents(updated);
}

// ── internal helpers ────────────────────────────────────────────────

async function getRecentVaultsRaw(): Promise<VaultMeta[]> {
  const path = getRecentsPath();
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeRecents(entries: VaultMeta[]): Promise<void> {
  const path = getRecentsPath();
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  await atomicWrite(path, JSON.stringify(entries, null, 2));
}
