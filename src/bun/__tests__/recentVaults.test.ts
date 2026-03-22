import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";

// We need to mock the data directory for tests.
// Since recentVaults.ts uses ~/.dotlock, we'll test the logic more directly.
// For now, test the module functions with a real temp directory by setting HOME.

const TEST_DIR = join(tmpdir(), "dotlock-recent-tests", `run-${Date.now()}`);
const DOTLOCK_DIR = join(TEST_DIR, ".dotlock");
const RECENTS_FILE = join(DOTLOCK_DIR, "recent-vaults.json");

// Store original HOME
const origHome = process.env.HOME;

beforeEach(() => {
  mkdirSync(DOTLOCK_DIR, { recursive: true });
  // Point HOME to our test dir so ~/.dotlock resolves to our test dir
  process.env.HOME = TEST_DIR;
  // Clear module cache to pick up new HOME
  delete require.cache[require.resolve("../recentVaults")];
});

afterEach(() => {
  process.env.HOME = origHome;
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

async function loadModule() {
  // Re-import to pick up new HOME
  return await import("../recentVaults");
}

describe("recentVaults", () => {
  test("getRecentVaults returns empty when no file exists", async () => {
    const mod = await loadModule();
    const result = await mod.getRecentVaults();
    expect(result).toEqual([]);
  });

  test("addRecentVault + getRecentVaults roundtrip", async () => {
    const mod = await loadModule();

    // Create a dummy vault file so it passes the exists check
    const vaultPath = join(TEST_DIR, "test.dotlock");
    writeFileSync(vaultPath, "dummy");

    await mod.addRecentVault({
      path: vaultPath,
      name: "test",
      lastOpened: "2026-01-01T00:00:00Z",
    });

    const result = await mod.getRecentVaults();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("test");
    expect(result[0].path).toBe(vaultPath);
  });

  test("addRecentVault upserts by path", async () => {
    const mod = await loadModule();

    const vaultPath = join(TEST_DIR, "upsert.dotlock");
    writeFileSync(vaultPath, "dummy");

    await mod.addRecentVault({
      path: vaultPath,
      name: "first",
      lastOpened: "2026-01-01T00:00:00Z",
    });
    await mod.addRecentVault({
      path: vaultPath,
      name: "updated",
      lastOpened: "2026-02-01T00:00:00Z",
    });

    const result = await mod.getRecentVaults();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("updated");
    expect(result[0].lastOpened).toBe("2026-02-01T00:00:00Z");
  });

  test("caps at 10 entries", async () => {
    const mod = await loadModule();

    for (let i = 0; i < 15; i++) {
      const vaultPath = join(TEST_DIR, `vault-${i}.dotlock`);
      writeFileSync(vaultPath, "dummy");
      await mod.addRecentVault({
        path: vaultPath,
        name: `vault-${i}`,
        lastOpened: new Date(2026, 0, i + 1).toISOString(),
      });
    }

    const result = await mod.getRecentVaults();
    expect(result.length).toBe(10);
  });

  test("removeRecentVault removes entry", async () => {
    const mod = await loadModule();

    const vaultPath = join(TEST_DIR, "remove-me.dotlock");
    writeFileSync(vaultPath, "dummy");

    await mod.addRecentVault({
      path: vaultPath,
      name: "remove-me",
      lastOpened: "2026-01-01T00:00:00Z",
    });

    let result = await mod.getRecentVaults();
    expect(result.length).toBe(1);

    await mod.removeRecentVault(vaultPath);
    result = await mod.getRecentVaults();
    expect(result.length).toBe(0);
  });

  test("filters out non-existent files", async () => {
    const mod = await loadModule();

    // Write a recents file with a path that doesn't exist
    writeFileSync(
      RECENTS_FILE,
      JSON.stringify([
        {
          path: "/nonexistent/vault.dotlock",
          name: "ghost",
          lastOpened: "2026-01-01T00:00:00Z",
        },
      ]),
    );

    const result = await mod.getRecentVaults();
    expect(result.length).toBe(0);
  });
});
