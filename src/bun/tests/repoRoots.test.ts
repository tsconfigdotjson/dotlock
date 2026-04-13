import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  clearVaultRoots,
  getAllRepoRoots,
  getRepoRoot,
  removeRepoRoot,
  setDataDir,
  setRepoRoot,
} from "../repoRoots";

const TEST_DIR = join(tmpdir(), "dotlock-reporoots-tests", `run-${Date.now()}`);

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

describe("repoRoots", () => {
  test("getRepoRoot returns null when no mapping exists", async () => {
    const result = await getRepoRoot("/vault.dotlock", "my-repo");
    expect(result).toBeNull();
  });

  test("setRepoRoot + getRepoRoot roundtrip", async () => {
    await setRepoRoot(
      "/vault.dotlock",
      "my-repo",
      "/Users/me/projects/my-repo",
    );
    const result = await getRepoRoot("/vault.dotlock", "my-repo");
    expect(result).toBe("/Users/me/projects/my-repo");
  });

  test("mappings are isolated per vault", async () => {
    await setRepoRoot("/alice.dotlock", "my-repo", "/Users/alice/my-repo");
    await setRepoRoot("/bob.dotlock", "my-repo", "/Users/bob/code/my-repo");

    expect(await getRepoRoot("/alice.dotlock", "my-repo")).toBe(
      "/Users/alice/my-repo",
    );
    expect(await getRepoRoot("/bob.dotlock", "my-repo")).toBe(
      "/Users/bob/code/my-repo",
    );
  });

  test("setRepoRoot overwrites an existing mapping", async () => {
    await setRepoRoot("/vault.dotlock", "my-repo", "/old/path");
    await setRepoRoot("/vault.dotlock", "my-repo", "/new/path");
    expect(await getRepoRoot("/vault.dotlock", "my-repo")).toBe("/new/path");
  });

  test("removeRepoRoot removes a single mapping", async () => {
    await setRepoRoot("/vault.dotlock", "repo-a", "/path/a");
    await setRepoRoot("/vault.dotlock", "repo-b", "/path/b");

    await removeRepoRoot("/vault.dotlock", "repo-a");

    expect(await getRepoRoot("/vault.dotlock", "repo-a")).toBeNull();
    expect(await getRepoRoot("/vault.dotlock", "repo-b")).toBe("/path/b");
  });

  test("getAllRepoRoots returns all mappings for a vault", async () => {
    await setRepoRoot("/vault.dotlock", "repo-a", "/path/a");
    await setRepoRoot("/vault.dotlock", "repo-b", "/path/b");
    await setRepoRoot("/other.dotlock", "repo-a", "/path/other");

    const all = await getAllRepoRoots("/vault.dotlock");
    expect(all).toEqual({ "repo-a": "/path/a", "repo-b": "/path/b" });
  });

  test("clearVaultRoots removes all mappings for a vault", async () => {
    await setRepoRoot("/vault.dotlock", "repo-a", "/path/a");
    await setRepoRoot("/vault.dotlock", "repo-b", "/path/b");
    await setRepoRoot("/other.dotlock", "repo-c", "/path/c");

    await clearVaultRoots("/vault.dotlock");

    expect(await getAllRepoRoots("/vault.dotlock")).toEqual({});
    expect(await getRepoRoot("/other.dotlock", "repo-c")).toBe("/path/c");
  });

  test("creates data directory if it does not exist", async () => {
    const newDir = join(TEST_DIR, "auto-created-subdir");
    setDataDir(newDir);
    expect(existsSync(newDir)).toBe(false);

    await setRepoRoot("/vault.dotlock", "my-repo", "/some/path");
    expect(existsSync(newDir)).toBe(true);
  });

  test("concurrent setRepoRoot calls don't clobber each other", async () => {
    const writes = Array.from({ length: 20 }, (_, i) =>
      setRepoRoot("/vault.dotlock", `repo-${i}`, `/path/${i}`),
    );
    await Promise.all(writes);

    const all = await getAllRepoRoots("/vault.dotlock");
    expect(Object.keys(all).length).toBe(20);
    for (let i = 0; i < 20; i++) {
      expect(all[`repo-${i}`]).toBe(`/path/${i}`);
    }
  });
});
