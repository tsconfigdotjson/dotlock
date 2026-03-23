import { readFile, writeFile } from "node:fs/promises";
import type { Repo } from "../shared/types";
import { parseEnvFile, rebuildRawContent } from "./scanner";
import type { VaultManager } from "./vault";

export async function editKey(
  vault: VaultManager,
  repoName: string,
  absolutePath: string,
  keyName: string,
  value: string,
  provider: string,
): Promise<Repo | null> {
  if (vault.getState() !== "unlocked") {
    return null;
  }
  const db = vault.getDB();
  const repo = db.get(repoName);
  if (!repo) {
    return null;
  }

  const envFile = repo.envFiles.find((f) => f.absolutePath === absolutePath);
  if (!envFile) {
    return null;
  }

  const key = envFile.keys.find((k) => k.name === keyName);
  if (!key) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];
  if (key.value !== value) {
    key.lastRotated = today;
  }
  key.value = value;
  key.provider = provider || undefined;

  envFile.rawContent = rebuildRawContent(envFile.keys);
  await writeFile(absolutePath, envFile.rawContent, "utf-8");
  await vault.save();
  return db.get(repoName);
}

export async function deleteKey(
  vault: VaultManager,
  repoName: string,
  absolutePath: string,
  keyName: string,
): Promise<Repo | null> {
  if (vault.getState() !== "unlocked") {
    return null;
  }
  const db = vault.getDB();
  const repo = db.get(repoName);
  if (!repo) {
    return null;
  }

  const envFile = repo.envFiles.find((f) => f.absolutePath === absolutePath);
  if (!envFile) {
    return null;
  }

  envFile.keys = envFile.keys.filter((k) => k.name !== keyName);
  envFile.rawContent = rebuildRawContent(envFile.keys);
  await writeFile(absolutePath, envFile.rawContent, "utf-8");
  await vault.save();
  return db.get(repoName);
}

export async function addKey(
  vault: VaultManager,
  repoName: string,
  absolutePath: string,
  keyName: string,
  value: string,
  provider: string,
): Promise<Repo | null> {
  if (vault.getState() !== "unlocked") {
    return null;
  }
  const db = vault.getDB();
  const repo = db.get(repoName);
  if (!repo) {
    return null;
  }

  const envFile = repo.envFiles.find((f) => f.absolutePath === absolutePath);
  if (!envFile) {
    return null;
  }

  if (envFile.keys.some((k) => k.name === keyName)) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];
  envFile.keys.push({
    name: keyName,
    value,
    provider: provider || undefined,
    addedAt: today,
  });

  envFile.rawContent = rebuildRawContent(envFile.keys);
  await writeFile(absolutePath, envFile.rawContent, "utf-8");
  await vault.save();
  return db.get(repoName);
}

export async function removeRepo(
  vault: VaultManager,
  repoName: string,
): Promise<boolean> {
  if (vault.getState() !== "unlocked") {
    return false;
  }
  const result = vault.getDB().remove(repoName);
  await vault.save();
  return result;
}

export async function importFile(
  vault: VaultManager,
  repoName: string,
  absolutePath: string,
): Promise<Repo | null> {
  if (vault.getState() !== "unlocked") {
    return null;
  }
  const db = vault.getDB();
  const repo = db.get(repoName);
  if (!repo) {
    return null;
  }

  const envFile = repo.envFiles.find((f) => f.absolutePath === absolutePath);
  if (!envFile) {
    return null;
  }

  try {
    const content = await readFile(absolutePath, "utf-8");
    const keys = parseEnvFile(content);
    db.updateEnvFile(repoName, {
      ...envFile,
      rawContent: content,
      keys,
      syncStatus: "synced",
    });
    await vault.save();
    return db.get(repoName);
  } catch {
    return null;
  }
}

export async function restoreFile(
  vault: VaultManager,
  repoName: string,
  absolutePath: string,
): Promise<Repo | null> {
  if (vault.getState() !== "unlocked") {
    return null;
  }
  const db = vault.getDB();
  const repo = db.get(repoName);
  if (!repo) {
    return null;
  }

  const envFile = repo.envFiles.find((f) => f.absolutePath === absolutePath);
  if (!envFile) {
    return null;
  }

  try {
    await writeFile(absolutePath, envFile.rawContent, "utf-8");
    db.updateSyncStatus(repoName, absolutePath, "synced");
    await vault.save();
    return db.get(repoName);
  } catch {
    return null;
  }
}
