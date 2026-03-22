import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  addRecentVault,
  getRecentVaults,
  removeRecentVault,
  setDataDir,
} from "../recentVaults";

const TEST_DIR = join(tmpdir(), "dotlock-recent-tests", `run-${Date.now()}`);

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  setDataDir(TEST_DIR);
});

afterEach(() => {
  setDataDir(null);
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

describe("recentVaults", () => {
  test("getRecentVaults returns empty when no file exists", async () => {
    const result = await getRecentVaults();
    expect(result).toEqual([]);
  });

  test("addRecentVault + getRecentVaults roundtrip", async () => {
    const vaultPath = join(TEST_DIR, "test.dotlock");
    writeFileSync(vaultPath, "dummy");

    await addRecentVault({
      path: vaultPath,
      name: "test",
      lastOpened: "2026-01-01T00:00:00Z",
    });

    const result = await getRecentVaults();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("test");
    expect(result[0].path).toBe(vaultPath);
  });

  test("addRecentVault upserts by path", async () => {
    const vaultPath = join(TEST_DIR, "upsert.dotlock");
    writeFileSync(vaultPath, "dummy");

    await addRecentVault({
      path: vaultPath,
      name: "first",
      lastOpened: "2026-01-01T00:00:00Z",
    });
    await addRecentVault({
      path: vaultPath,
      name: "updated",
      lastOpened: "2026-02-01T00:00:00Z",
    });

    const result = await getRecentVaults();
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("updated");
    expect(result[0].lastOpened).toBe("2026-02-01T00:00:00Z");
  });

  test("caps at 10 entries", async () => {
    for (let i = 0; i < 15; i++) {
      const vaultPath = join(TEST_DIR, `vault-${i}.dotlock`);
      writeFileSync(vaultPath, "dummy");
      await addRecentVault({
        path: vaultPath,
        name: `vault-${i}`,
        lastOpened: new Date(2026, 0, i + 1).toISOString(),
      });
    }

    const result = await getRecentVaults();
    expect(result.length).toBe(10);
  });

  test("removeRecentVault removes entry", async () => {
    const vaultPath = join(TEST_DIR, "remove-me.dotlock");
    writeFileSync(vaultPath, "dummy");

    await addRecentVault({
      path: vaultPath,
      name: "remove-me",
      lastOpened: "2026-01-01T00:00:00Z",
    });

    let result = await getRecentVaults();
    expect(result.length).toBe(1);

    await removeRecentVault(vaultPath);
    result = await getRecentVaults();
    expect(result.length).toBe(0);
  });

  test("filters out non-existent files", async () => {
    const recentsPath = join(TEST_DIR, "recent-vaults.json");
    writeFileSync(
      recentsPath,
      JSON.stringify([
        {
          path: "/nonexistent/vault.dotlock",
          name: "ghost",
          lastOpened: "2026-01-01T00:00:00Z",
        },
      ]),
    );

    const result = await getRecentVaults();
    expect(result.length).toBe(0);
  });
});
