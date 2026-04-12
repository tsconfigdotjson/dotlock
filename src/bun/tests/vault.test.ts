import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { VaultManager } from "../vault";

const TEST_DIR = join(tmpdir(), "dotlock-vault-tests");
let testFile: string;
let counter = 0;

beforeEach(() => {
  counter++;
  testFile = join(TEST_DIR, `test-vault-${counter}-${Date.now()}.dotlock`);
  if (!existsSync(TEST_DIR)) {
    require("node:fs").mkdirSync(TEST_DIR, { recursive: true });
  }
});

afterEach(() => {
  // Clean up test files
  for (const suffix of ["", ".tmp"]) {
    const p = testFile + suffix;
    if (existsSync(p)) {
      rmSync(p);
    }
  }
});

describe("VaultManager.createVault", () => {
  test("creates a valid .dotlock file and unlocks", async () => {
    const vault = new VaultManager();
    expect(vault.getState()).toBe("no_vault");
    expect(vault.getVaultPath()).toBeNull();

    await vault.createVault(testFile, "test-password");

    expect(vault.getState()).toBe("unlocked");
    expect(vault.getVaultPath()).toBe(testFile);
    expect(existsSync(testFile)).toBe(true);
    expect(vault.getDB().getAll()).toEqual([]);
  });

  test("no .tmp file remains after creation", async () => {
    const vault = new VaultManager();
    await vault.createVault(testFile, "test-password");
    expect(existsSync(`${testFile}.tmp`)).toBe(false);
  });
});

describe("VaultManager.openVault", () => {
  test("opens a vault with the correct password", async () => {
    // Create
    const v1 = new VaultManager();
    await v1.createVault(testFile, "my-password");

    // Open with new instance
    const v2 = new VaultManager();
    await v2.openVault(testFile, "my-password");

    expect(v2.getState()).toBe("unlocked");
    expect(v2.getDB().getAll()).toEqual([]);
  });

  test("wrong password throws", async () => {
    const v1 = new VaultManager();
    await v1.createVault(testFile, "correct-password");

    const v2 = new VaultManager();
    expect(v2.openVault(testFile, "wrong-password")).rejects.toThrow();
    expect(v2.getState()).toBe("no_vault");
  });
});

describe("VaultManager.save", () => {
  test("persists data across close and reopen", async () => {
    const v1 = new VaultManager();
    await v1.createVault(testFile, "password");

    // Add a repo
    v1.getDB().add({
      name: "my-project",
      envFiles: [
        {
          filename: ".env",
          relativePath: ".env",
          rawContent: "SECRET_KEY=abc123",
          keys: [{ name: "SECRET_KEY", value: "abc123" }],
          syncStatus: "synced",
        },
      ],
    });
    await v1.save();

    // Open with fresh instance
    const v2 = new VaultManager();
    await v2.openVault(testFile, "password");

    const repos = v2.getDB().getAll();
    expect(repos.length).toBe(1);
    expect(repos[0].name).toBe("my-project");
    expect(repos[0].envFiles[0].keys[0].value).toBe("abc123");
  });

  test("no .tmp file remains after save", async () => {
    const vault = new VaultManager();
    await vault.createVault(testFile, "password");
    vault.getDB().add({
      name: "test",
      envFiles: [],
    });
    await vault.save();
    expect(existsSync(`${testFile}.tmp`)).toBe(false);
  });
});

describe("VaultManager.lock", () => {
  test("lock clears state and getDB throws", async () => {
    const vault = new VaultManager();
    await vault.createVault(testFile, "password");
    expect(vault.getState()).toBe("unlocked");

    vault.lock();
    expect(vault.getState()).toBe("locked");
    expect(() => vault.getDB()).toThrow("Vault is not unlocked");
  });

  test("save throws when locked", async () => {
    const vault = new VaultManager();
    await vault.createVault(testFile, "password");
    vault.lock();
    expect(vault.save()).rejects.toThrow("Cannot save");
  });

  test("lock on fresh vault sets state to no_vault", () => {
    const vault = new VaultManager();
    vault.lock();
    expect(vault.getState()).toBe("no_vault");
  });
});

describe("full lifecycle", () => {
  test("create → add data → save → lock → reopen → verify", async () => {
    const vault = new VaultManager();

    // Create
    await vault.createVault(testFile, "lifecycle-password");

    // Add repos
    vault.getDB().add({
      name: "repo-a",
      envFiles: [
        {
          filename: ".env.local",
          relativePath: ".env.local",
          rawContent: "API_KEY=key123\nDB_URL=postgres://localhost",
          keys: [
            { name: "API_KEY", value: "key123" },
            { name: "DB_URL", value: "postgres://localhost" },
          ],
          syncStatus: "synced",
        },
      ],
    });
    vault.getDB().add({
      name: "repo-b",
      envFiles: [],
    });
    await vault.save();

    // Lock
    vault.lock();
    expect(vault.getState()).toBe("locked");

    // Reopen
    await vault.openVault(testFile, "lifecycle-password");
    expect(vault.getState()).toBe("unlocked");

    const repos = vault.getDB().getAll();
    expect(repos.length).toBe(2);

    const repoA = vault.getDB().get("repo-a");
    expect(repoA).not.toBeNull();
    expect(repoA?.envFiles.length).toBe(1);
    expect(repoA?.envFiles[0].keys.length).toBe(2);
    expect(repoA?.envFiles[0].keys[0].name).toBe("API_KEY");
    expect(repoA?.envFiles[0].keys[1].value).toBe("postgres://localhost");

    const repoB = vault.getDB().get("repo-b");
    expect(repoB).not.toBeNull();
    expect(repoB?.envFiles.length).toBe(0);
  });

  test("two rapid saves don't corrupt the file", async () => {
    const vault = new VaultManager();
    await vault.createVault(testFile, "password");

    vault.getDB().add({ name: "r1", envFiles: [] });
    const save1 = vault.save();

    vault.getDB().add({ name: "r2", envFiles: [] });
    const save2 = vault.save();

    await Promise.all([save1, save2]);

    // Reopen and verify
    const v2 = new VaultManager();
    await v2.openVault(testFile, "password");
    // Should have at least the repos (order may vary due to race, but file is valid)
    expect(v2.getDB().getAll().length).toBeGreaterThanOrEqual(1);
  });
});
