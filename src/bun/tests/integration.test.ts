import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import type { InMemoryDB } from "../db";
import {
  addKey,
  deleteKey,
  editKey,
  importFile,
  removeRepo,
  restoreFile,
} from "../operations";
import {
  addRecentVault,
  getRecentVaults,
  removeRecentVault,
  setDataDir,
} from "../recentVaults";
import { parseEnvFile, scanFolder } from "../scanner";
import { VaultManager } from "../vault";
import { fileWatcher } from "../watcher";

/**
 * Integration tests that exercise the real app flow:
 *   scanner → vault → operations → watcher
 *
 * Unlike unit tests, these wire multiple modules together and
 * verify they interoperate correctly.
 */

const TEST_DIR = join(tmpdir(), "dotlock-integration", `run-${Date.now()}`);
const TEST_DEBOUNCE_MS = 50;
const FSEVENTS_SETTLE_MS = 100;
const DEBOUNCE_WAIT_MS = TEST_DEBOUNCE_MS + 100;

let vault: VaultManager;
let vaultFile: string;
let counter = 0;

function nextProject(): string {
  counter++;
  const dir = join(TEST_DIR, `project-${counter}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

beforeEach(async () => {
  counter++;
  mkdirSync(TEST_DIR, { recursive: true });
  vaultFile = join(TEST_DIR, `vault-${counter}-${Date.now()}.dotlock`);
  vault = new VaultManager();
  await vault.createVault(vaultFile, "test-password");

  fileWatcher.setGetDB(() => vault.getDB());
  fileWatcher.setOnChange(() => {});
  fileWatcher.setDebounceMs(TEST_DEBOUNCE_MS);

  setDataDir(join(TEST_DIR, "dotlock-data"));
});

afterEach(() => {
  fileWatcher.unwatchAll();
  fileWatcher.setGetDB(null as unknown as () => InMemoryDB);
  fileWatcher.setOnChange(null as unknown as (repoName: string) => void);
  fileWatcher.setOnNewEnvFile(null);
  setDataDir(null);
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

// ── scan → vault → persist ──────────────────────────────────────────

describe("scan folder → store in vault → reopen", () => {
  test("scanned env files are persisted through vault close/reopen", async () => {
    const projectDir = nextProject();
    writeFileSync(join(projectDir, ".env"), "API_KEY=secret123\nDB=postgres\n");
    writeFileSync(join(projectDir, ".env.local"), "LOCAL_OVERRIDE=true\n");

    const envFiles = await scanFolder(projectDir);
    const db = vault.getDB();
    db.add({
      name: basename(projectDir),
      path: projectDir,
      envFiles,
    });
    await vault.save();

    // Reopen from disk with a fresh VaultManager
    const v2 = new VaultManager();
    await v2.openVault(vaultFile, "test-password");
    const repo = v2.getDB().get(basename(projectDir));

    expect(repo).not.toBeNull();
    expect(repo?.envFiles.length).toBe(2);

    const mainEnv = repo?.envFiles.find((f) => f.filename === ".env");
    expect(mainEnv).not.toBeNull();
    expect(mainEnv?.keys.length).toBe(2);
    expect(mainEnv?.keys.find((k) => k.name === "API_KEY")?.value).toBe(
      "secret123",
    );

    const localEnv = repo?.envFiles.find((f) => f.filename === ".env.local");
    expect(localEnv).not.toBeNull();
    expect(localEnv?.keys[0].value).toBe("true");
  });

  test("scanner skips node_modules and .git", async () => {
    const projectDir = nextProject();
    writeFileSync(join(projectDir, ".env"), "REAL=yes\n");
    mkdirSync(join(projectDir, "node_modules"), { recursive: true });
    writeFileSync(
      join(projectDir, "node_modules", ".env"),
      "SHOULD_SKIP=true\n",
    );
    mkdirSync(join(projectDir, ".git"), { recursive: true });
    writeFileSync(join(projectDir, ".git", ".env"), "ALSO_SKIP=true\n");

    const envFiles = await scanFolder(projectDir);
    expect(envFiles.length).toBe(1);
    expect(envFiles[0].keys[0].name).toBe("REAL");
  });
});

// ── scan → operations → disk sync ───────────────────────────────────

describe("scan → edit/add/delete keys → verify disk", () => {
  test("edit a scanned key updates both vault and disk", async () => {
    const projectDir = nextProject();
    writeFileSync(join(projectDir, ".env"), "SECRET=original\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    const envPath = join(projectDir, ".env");
    await editKey(vault, repoName, envPath, "SECRET", "rotated", "AWS");

    // Vault has the update
    const key = vault
      .getDB()
      .get(repoName)
      ?.envFiles[0].keys.find((k) => k.name === "SECRET");
    expect(key?.value).toBe("rotated");
    expect(key?.provider).toBe("AWS");

    // Disk has the update
    const onDisk = readFileSync(envPath, "utf-8");
    expect(onDisk).toContain("SECRET=rotated");
  });

  test("add key then delete key round-trip", async () => {
    const projectDir = nextProject();
    writeFileSync(join(projectDir, ".env"), "A=1\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    const envPath = join(projectDir, ".env");

    // Add a key
    await addKey(vault, repoName, envPath, "B", "2", "Stripe");
    let keys = vault.getDB().get(repoName)?.envFiles[0].keys;
    expect(keys?.length).toBe(2);
    expect(readFileSync(envPath, "utf-8")).toContain("B=2");

    // Delete it
    await deleteKey(vault, repoName, envPath, "B");
    keys = vault.getDB().get(repoName)?.envFiles[0].keys;
    expect(keys?.length).toBe(1);
    expect(keys?.[0].name).toBe("A");
    expect(readFileSync(envPath, "utf-8")).not.toContain("B=2");

    // Survives vault reopen
    const v2 = new VaultManager();
    await v2.openVault(vaultFile, "test-password");
    expect(v2.getDB().get(repoName)?.envFiles[0].keys.length).toBe(1);
  });
});

// ── watcher + operations ─────────────────────────────────────────────

describe("watcher detects drift → import/restore resolves it", () => {
  test("external edit triggers disk_changed, import resolves to synced", async () => {
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "KEY=vault_value\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    const notifications: string[] = [];
    fileWatcher.setOnChange((name) => notifications.push(name));

    // Start watching
    const watchPaths = vault.getDB().getWatchPaths(repoName);
    fileWatcher.watchRepo(repoName, watchPaths);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Simulate external edit (another tool changes the file)
    writeFileSync(envPath, "KEY=external_edit\n");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Watcher should have detected drift
    const driftStatus = vault.getDB().get(repoName)?.envFiles[0].syncStatus;
    expect(driftStatus).toBe("disk_changed");
    expect(notifications).toContain(repoName);

    // Import resolves the drift
    const result = await importFile(vault, repoName, envPath);
    expect(result?.envFiles[0].syncStatus).toBe("synced");
    expect(result?.envFiles[0].keys[0].value).toBe("external_edit");
  });

  test("external delete triggers missing, restoreFile recreates file", async () => {
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "KEY=precious\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    fileWatcher.watchRepo(repoName, [envPath]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Delete the file externally
    rmSync(envPath);
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(vault.getDB().get(repoName)?.envFiles[0].syncStatus).toBe("missing");

    // Restore from vault
    await restoreFile(vault, repoName, envPath);

    expect(existsSync(envPath)).toBe(true);
    expect(readFileSync(envPath, "utf-8")).toContain("KEY=precious");
    expect(vault.getDB().get(repoName)?.envFiles[0].syncStatus).toBe("synced");
  });

  test("editKey writes to disk, watcher sees it as synced (not drift)", async () => {
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "KEY=before\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    fileWatcher.watchRepo(repoName, [envPath]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Edit through operations (updates both vault + disk atomically)
    await editKey(vault, repoName, envPath, "KEY", "after", "");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Watcher should see this as synced, not drift
    const status = vault.getDB().get(repoName)?.envFiles[0].syncStatus;
    expect(status).toBe("synced");
  });
});

// ── lock / reopen watcher re-establishment ───────────────────────────

describe("lock stops watchers, reopen re-establishes them", () => {
  test("lock → file change → no notification; reopen → watcher resumes", async () => {
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "KEY=original\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    // Start watching
    fileWatcher.watchRepo(repoName, [envPath]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Lock: kills all watchers (mirrors index.ts lockVault handler)
    fileWatcher.unwatchAll();
    vault.lock();

    // Change file while locked — should NOT crash or notify
    const notifications: string[] = [];
    fileWatcher.setOnChange((name) => notifications.push(name));
    writeFileSync(envPath, "KEY=changed-while-locked\n");
    await Bun.sleep(DEBOUNCE_WAIT_MS);
    expect(notifications).toEqual([]);

    // Reopen (mirrors index.ts openVault handler)
    await vault.openVault(vaultFile, "test-password");
    fileWatcher.setGetDB(() => vault.getDB());
    const db = vault.getDB();
    for (const repo of db.getAll()) {
      const watchPaths = db.getWatchPaths(repo.name);
      fileWatcher.watchRepo(repo.name, watchPaths);
    }
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Watcher should immediately detect the drift from while we were locked
    await Bun.sleep(DEBOUNCE_WAIT_MS);
    expect(vault.getDB().get(repoName)?.envFiles[0].syncStatus).toBe(
      "disk_changed",
    );
  });
});

// ── removeRepo stops watcher ─────────────────────────────────────────

describe("removeRepo stops its watcher", () => {
  test("after removeRepo, file changes do not trigger notifications", async () => {
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "KEY=val\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    const notifications: string[] = [];
    fileWatcher.setOnChange((name) => notifications.push(name));

    // Watch, then remove (mirrors index.ts removeRepo handler)
    fileWatcher.watchRepo(repoName, [envPath]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    fileWatcher.unwatchRepo(repoName);
    await removeRepo(vault, repoName);

    // Modify file after repo removed
    writeFileSync(envPath, "KEY=should-not-trigger\n");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(notifications).toEqual([]);
    expect(vault.getDB().get(repoName)).toBeNull();
  });
});

// ── multiple repos with concurrent watchers ──────────────────────────

describe("multiple repos watched simultaneously", () => {
  test("drift in one repo does not affect another", async () => {
    // Set up two repos
    const dirA = nextProject();
    const dirB = nextProject();
    const envA = join(dirA, ".env");
    const envB = join(dirB, ".env");
    writeFileSync(envA, "A_KEY=alpha\n");
    writeFileSync(envB, "B_KEY=beta\n");

    const filesA = await scanFolder(dirA);
    const filesB = await scanFolder(dirB);
    const nameA = basename(dirA);
    const nameB = basename(dirB);

    vault.getDB().add({ name: nameA, path: dirA, envFiles: filesA });
    vault.getDB().add({ name: nameB, path: dirB, envFiles: filesB });
    await vault.save();

    const driftedRepos: string[] = [];
    fileWatcher.setOnChange((name) => driftedRepos.push(name));

    fileWatcher.watchRepo(nameA, [envA]);
    fileWatcher.watchRepo(nameB, [envB]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Only change repo A
    writeFileSync(envA, "A_KEY=modified\n");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Repo A drifted, repo B still synced
    expect(vault.getDB().get(nameA)?.envFiles[0].syncStatus).toBe(
      "disk_changed",
    );
    expect(vault.getDB().get(nameB)?.envFiles[0].syncStatus).toBe("synced");
    expect(driftedRepos).toContain(nameA);
    expect(driftedRepos).not.toContain(nameB);
  });
});

// ── recentVaults + vault lifecycle ───────────────────────────────────

describe("recentVaults tracks vault lifecycle", () => {
  test("creating and opening vaults updates recent vaults list", async () => {
    // Simulate createVault handler from index.ts
    await addRecentVault({
      path: vaultFile,
      name: basename(vaultFile, ".dotlock"),
      lastOpened: new Date().toISOString(),
    });

    let recents = await getRecentVaults();
    expect(recents.length).toBe(1);
    expect(recents[0].path).toBe(vaultFile);

    // Create a second vault and add it
    const vaultFile2 = join(TEST_DIR, "second.dotlock");
    const v2 = new VaultManager();
    await v2.createVault(vaultFile2, "pass2");
    await addRecentVault({
      path: vaultFile2,
      name: basename(vaultFile2, ".dotlock"),
      lastOpened: new Date().toISOString(),
    });

    recents = await getRecentVaults();
    expect(recents.length).toBe(2);

    // Most recent should be first
    expect(recents[0].path).toBe(vaultFile2);

    // Re-opening the first vault bumps it to the top
    await addRecentVault({
      path: vaultFile,
      name: basename(vaultFile, ".dotlock"),
      lastOpened: new Date().toISOString(),
    });
    recents = await getRecentVaults();
    expect(recents[0].path).toBe(vaultFile);
  });

  test("removing a recent vault persists across reload", async () => {
    // Add two vaults
    await addRecentVault({
      path: vaultFile,
      name: basename(vaultFile, ".dotlock"),
      lastOpened: new Date().toISOString(),
    });

    const vaultFile2 = join(TEST_DIR, "to-remove.dotlock");
    const v2 = new VaultManager();
    await v2.createVault(vaultFile2, "pass2");
    await addRecentVault({
      path: vaultFile2,
      name: basename(vaultFile2, ".dotlock"),
      lastOpened: new Date().toISOString(),
    });

    let recents = await getRecentVaults();
    expect(recents.length).toBe(2);

    // Remove one
    await removeRecentVault(vaultFile2);

    recents = await getRecentVaults();
    expect(recents.length).toBe(1);
    expect(recents[0].path).toBe(vaultFile);

    // Simulate app restart by re-reading from disk
    recents = await getRecentVaults();
    expect(recents.length).toBe(1);
    expect(recents.find((r) => r.path === vaultFile2)).toBeUndefined();
  });
});

// ── full lifecycle ───────────────────────────────────────────────────

describe("full end-to-end lifecycle", () => {
  test("create vault → scan → edit → lock → reopen → verify → restore", async () => {
    // 1. Set up a project with env files
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "DB_HOST=localhost\nDB_PASS=secret\n");
    writeFileSync(join(projectDir, ".env.staging"), "DB_HOST=staging.db\n");

    // 2. Scan and store in vault
    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    expect(vault.getDB().get(repoName)?.envFiles.length).toBe(2);

    // 3. Edit a key
    await editKey(vault, repoName, envPath, "DB_PASS", "new-secret", "RDS");

    // 4. Add a new key
    await addKey(vault, repoName, envPath, "DB_PORT", "5432", "");

    // 5. Verify disk
    const onDisk = readFileSync(envPath, "utf-8");
    expect(onDisk).toContain("DB_HOST=localhost");
    expect(onDisk).toContain("DB_PASS=new-secret");
    expect(onDisk).toContain("DB_PORT=5432");

    // 6. Lock and reopen
    vault.lock();
    const v2 = new VaultManager();
    await v2.openVault(vaultFile, "test-password");

    const repo = v2.getDB().get(repoName);
    const mainEnv = repo?.envFiles.find((f) => f.filename === ".env");
    expect(mainEnv?.keys.length).toBe(3);
    expect(mainEnv?.keys.find((k) => k.name === "DB_PASS")?.value).toBe(
      "new-secret",
    );
    expect(mainEnv?.keys.find((k) => k.name === "DB_PASS")?.provider).toBe(
      "RDS",
    );
    expect(mainEnv?.keys.find((k) => k.name === "DB_PORT")?.value).toBe("5432");

    // 7. Simulate disk divergence and restore
    writeFileSync(envPath, "DB_HOST=hacked\n");
    await restoreFile(v2, repoName, envPath);

    const restored = readFileSync(envPath, "utf-8");
    expect(restored).toContain("DB_PASS=new-secret");
    expect(restored).not.toContain("hacked");
  });
});

// ── new env file auto-discovery ──────────────────────────────────────

/** Mirrors the onNewEnvFile handler from index.ts */
async function newEnvFileHandler(
  v: VaultManager,
  repoName: string,
  absolutePath: string,
): Promise<boolean> {
  if (v.getState() !== "unlocked") {
    return false;
  }
  const db = v.getDB();
  const repo = db.get(repoName);
  if (!repo) {
    return false;
  }

  try {
    const content = await readFile(absolutePath, "utf-8");
    const keys = parseEnvFile(content);
    if (keys.length === 0) {
      return false;
    }

    const relDir = relative(repo.path, dirname(absolutePath));
    const name = basename(absolutePath);
    const filename = relDir ? `${name} (${relDir})` : name;

    db.addEnvFile(repoName, {
      filename,
      absolutePath,
      rawContent: content,
      keys,
      syncStatus: "synced",
    });

    await v.save();
    return true;
  } catch {
    return false;
  }
}

describe("new env file auto-discovery in watched repo", () => {
  test("new .env file is auto-discovered and persisted in vault", async () => {
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "API_KEY=secret\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    fileWatcher.setOnNewEnvFile((name, path) =>
      newEnvFileHandler(vault, name, path),
    );

    const notifications: string[] = [];
    fileWatcher.setOnChange((name) => notifications.push(name));

    const watchPaths = vault.getDB().getWatchPaths(repoName);
    fileWatcher.watchRepo(repoName, watchPaths);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Create a new .env file in the project
    const newEnvPath = join(projectDir, ".env.local");
    writeFileSync(newEnvPath, "LOCAL_SECRET=dev_only\n");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Verify discovered and added to vault
    const repo = vault.getDB().get(repoName);
    expect(repo?.envFiles.length).toBe(2);

    const localEnv = repo?.envFiles.find((f) => f.filename === ".env.local");
    expect(localEnv).not.toBeNull();
    expect(localEnv?.keys[0].name).toBe("LOCAL_SECRET");
    expect(localEnv?.keys[0].value).toBe("dev_only");
    expect(localEnv?.syncStatus).toBe("synced");

    // Verify frontend was notified
    expect(notifications).toContain(repoName);

    // Verify persisted through vault reopen
    const v2 = new VaultManager();
    await v2.openVault(vaultFile, "test-password");
    const reopened = v2.getDB().get(repoName);
    expect(reopened?.envFiles.length).toBe(2);
    expect(
      reopened?.envFiles.find((f) => f.filename === ".env.local"),
    ).not.toBeNull();
  });

  test("new .env file with no keys is ignored", async () => {
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "KEY=val\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    fileWatcher.setOnNewEnvFile((name, path) =>
      newEnvFileHandler(vault, name, path),
    );

    const watchPaths = vault.getDB().getWatchPaths(repoName);
    fileWatcher.watchRepo(repoName, watchPaths);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Create an empty .env file (comment only — no valid keys)
    writeFileSync(join(projectDir, ".env.empty"), "# just a comment\n");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(vault.getDB().get(repoName)?.envFiles.length).toBe(1);
  });

  test("auto-discovered file is subsequently tracked for drift", async () => {
    const projectDir = nextProject();
    const envPath = join(projectDir, ".env");
    writeFileSync(envPath, "KEY=val\n");

    const envFiles = await scanFolder(projectDir);
    const repoName = basename(projectDir);
    vault.getDB().add({ name: repoName, path: projectDir, envFiles });
    await vault.save();

    fileWatcher.setOnNewEnvFile((name, path) =>
      newEnvFileHandler(vault, name, path),
    );

    const watchPaths = vault.getDB().getWatchPaths(repoName);
    fileWatcher.watchRepo(repoName, watchPaths);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Create new file — auto-discovered
    const newEnvPath = join(projectDir, ".env.local");
    writeFileSync(newEnvPath, "LOCAL=original\n");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(vault.getDB().get(repoName)?.envFiles.length).toBe(2);

    // Now externally modify the new file — should trigger drift detection
    writeFileSync(newEnvPath, "LOCAL=externally_changed\n");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const localEnv = vault
      .getDB()
      .get(repoName)
      ?.envFiles.find((f) => f.absolutePath === newEnvPath);
    expect(localEnv?.syncStatus).toBe("disk_changed");

    // Import resolves the drift
    const result = await importFile(vault, repoName, newEnvPath);
    expect(
      result?.envFiles.find((f) => f.absolutePath === newEnvPath)?.keys[0]
        .value,
    ).toBe("externally_changed");
  });
});
