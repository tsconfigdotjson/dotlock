import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isValidRepoRoot, resolveEnvFilePath } from "../paths";
import { setDataDir, setRepoRoot } from "../repoRoots";

const TEST_DIR = join(tmpdir(), "dotlock-paths-tests", `run-${Date.now()}`);

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

// ── isValidRepoRoot ──────────────────────────────────────────────────

describe("isValidRepoRoot", () => {
  test("accepts an existing directory", () => {
    const dir = join(TEST_DIR, "a-repo");
    mkdirSync(dir);
    expect(isValidRepoRoot(dir)).toBe(true);
  });

  test("rejects a regular file", () => {
    const file = join(TEST_DIR, "not-a-dir.txt");
    writeFileSync(file, "hi");
    expect(isValidRepoRoot(file)).toBe(false);
  });

  test("rejects a nonexistent path", () => {
    expect(isValidRepoRoot(join(TEST_DIR, "does-not-exist"))).toBe(false);
  });

  test("rejects an empty string", () => {
    expect(isValidRepoRoot("")).toBe(false);
  });
});

// ── resolveEnvFilePath ──────────────────────────────────────────────

describe("resolveEnvFilePath", () => {
  const vaultPath = "/vault.dotlock";
  const repoName = "my-repo";

  test("returns null when repo has no local mapping", async () => {
    const result = await resolveEnvFilePath(vaultPath, "never-linked", ".env");
    expect(result).toBeNull();
  });

  test("resolves happy-path relative paths", async () => {
    const root = join(TEST_DIR, "my-repo");
    mkdirSync(root, { recursive: true });
    await setRepoRoot(vaultPath, repoName, root);

    const result = await resolveEnvFilePath(vaultPath, repoName, ".env");
    expect(result).toBe(join(root, ".env"));
  });

  test("resolves nested relative paths", async () => {
    const root = join(TEST_DIR, "my-repo");
    mkdirSync(root, { recursive: true });
    await setRepoRoot(vaultPath, repoName, root);

    const result = await resolveEnvFilePath(
      vaultPath,
      repoName,
      "backend/.env.local",
    );
    expect(result).toBe(join(root, "backend/.env.local"));
  });

  test("rejects relativePath that escapes the root via ..", async () => {
    const root = join(TEST_DIR, "my-repo");
    mkdirSync(root, { recursive: true });
    await setRepoRoot(vaultPath, repoName, root);

    const result = await resolveEnvFilePath(
      vaultPath,
      repoName,
      "../../etc/passwd",
    );
    expect(result).toBeNull();
  });

  test("rejects relativePath that starts with ..", async () => {
    const root = join(TEST_DIR, "my-repo");
    mkdirSync(root, { recursive: true });
    await setRepoRoot(vaultPath, repoName, root);

    const result = await resolveEnvFilePath(vaultPath, repoName, "../leak");
    expect(result).toBeNull();
  });

  test("rejects absolute relativePath", async () => {
    const root = join(TEST_DIR, "my-repo");
    mkdirSync(root, { recursive: true });
    await setRepoRoot(vaultPath, repoName, root);

    const result = await resolveEnvFilePath(vaultPath, repoName, "/etc/passwd");
    expect(result).toBeNull();
  });

  test("allows a .. that still stays under the root", async () => {
    const root = join(TEST_DIR, "my-repo");
    mkdirSync(root, { recursive: true });
    await setRepoRoot(vaultPath, repoName, root);

    // "sub/../.env" resolves to root/.env — legitimately inside the root.
    const result = await resolveEnvFilePath(vaultPath, repoName, "sub/../.env");
    expect(result).toBe(join(root, "sub/../.env"));
  });
});
