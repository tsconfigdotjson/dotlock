import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { addKey, deleteKey, editKey } from "../operations";
import { VaultManager } from "../vault";

const TEST_DIR = join(tmpdir(), `dotlock-ops-tests-${Date.now()}`);
let counter = 0;

function nextDir(): string {
  counter++;
  return join(TEST_DIR, `project-${counter}`);
}

let vault: VaultManager;
let vaultFile: string;

beforeEach(async () => {
  counter++;
  mkdirSync(TEST_DIR, { recursive: true });
  vaultFile = join(TEST_DIR, `vault-${counter}-${Date.now()}.dotlock`);
  vault = new VaultManager();
  await vault.createVault(vaultFile, "test-password");
});

afterEach(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
});

/** Helper: set up a repo with one .env file on disk and in the vault. */
function setupRepo(
  repoName: string,
  envContent: string,
): { projectDir: string; envPath: string } {
  const projectDir = nextDir();
  mkdirSync(projectDir, { recursive: true });
  const envPath = join(projectDir, ".env");
  writeFileSync(envPath, envContent, "utf-8");

  vault.getDB().add({
    name: repoName,
    path: projectDir,
    envFiles: [
      {
        filename: ".env",
        absolutePath: envPath,
        rawContent: envContent,
        keys: envContent
          .split("\n")
          .filter((l) => l.includes("="))
          .map((l) => {
            const [name, ...rest] = l.split("=");
            return { name, value: rest.join("=") };
          }),
        syncStatus: "synced",
      },
    ],
  });

  return { projectDir, envPath };
}

// ---------------------------------------------------------------------------
// editKey
// ---------------------------------------------------------------------------

describe("editKey", () => {
  test("updates the value in the vault", async () => {
    const { envPath } = setupRepo("proj", "API_KEY=old_value\n");

    const result = await editKey(
      vault,
      "proj",
      envPath,
      "API_KEY",
      "new_value",
      "",
    );
    expect(result).not.toBeNull();

    const key = result?.envFiles[0].keys.find((k) => k.name === "API_KEY");
    expect(key?.value).toBe("new_value");
  });

  test("writes updated value to disk", async () => {
    const { envPath } = setupRepo("proj", "API_KEY=old_value\n");

    await editKey(vault, "proj", envPath, "API_KEY", "new_value", "");

    const onDisk = readFileSync(envPath, "utf-8");
    expect(onDisk).toContain("API_KEY=new_value");
  });

  test("sets lastRotated when value changes", async () => {
    const { envPath } = setupRepo("proj", "KEY=before\n");

    const result = await editKey(vault, "proj", envPath, "KEY", "after", "");
    const key = result?.envFiles[0].keys.find((k) => k.name === "KEY");
    const today = new Date().toISOString().split("T")[0];
    expect(key?.lastRotated).toBe(today);
  });

  test("does not set lastRotated when only provider changes", async () => {
    const { envPath } = setupRepo("proj", "KEY=same\n");

    const result = await editKey(vault, "proj", envPath, "KEY", "same", "AWS");
    const key = result?.envFiles[0].keys.find((k) => k.name === "KEY");
    expect(key?.lastRotated).toBeUndefined();
  });

  test("updates provider", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");

    const result = await editKey(
      vault,
      "proj",
      envPath,
      "KEY",
      "val",
      "Stripe",
    );
    const key = result?.envFiles[0].keys.find((k) => k.name === "KEY");
    expect(key?.provider).toBe("Stripe");
  });

  test("clears provider when empty string", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");

    // First set a provider
    await editKey(vault, "proj", envPath, "KEY", "val", "AWS");
    // Then clear it
    const result = await editKey(vault, "proj", envPath, "KEY", "val", "");
    const key = result?.envFiles[0].keys.find((k) => k.name === "KEY");
    expect(key?.provider).toBeUndefined();
  });

  test("persists through vault reopen", async () => {
    const { envPath } = setupRepo("proj", "KEY=original\n");
    await editKey(vault, "proj", envPath, "KEY", "edited", "Vercel");

    // Reopen vault from disk
    const v2 = new VaultManager();
    await v2.openVault(vaultFile, "test-password");
    const key = v2.getDB().get("proj")?.envFiles[0].keys[0];
    expect(key?.value).toBe("edited");
    expect(key?.provider).toBe("Vercel");
  });

  test("returns null for nonexistent repo", async () => {
    const result = await editKey(vault, "nope", "/fake/.env", "K", "v", "");
    expect(result).toBeNull();
  });

  test("returns null for nonexistent key", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");
    const result = await editKey(vault, "proj", envPath, "MISSING", "v", "");
    expect(result).toBeNull();
  });

  test("does not modify other keys", async () => {
    const { envPath } = setupRepo("proj", "A=1\nB=2\n");

    await editKey(vault, "proj", envPath, "A", "changed", "");

    const repo = vault.getDB().get("proj");
    expect(repo).not.toBeNull();
    expect(repo?.envFiles[0].keys.find((k) => k.name === "B")?.value).toBe("2");
  });

  test("disk file contains all keys after editing one", async () => {
    const { envPath } = setupRepo("proj", "A=1\nB=2\nC=3\n");

    await editKey(vault, "proj", envPath, "B", "updated", "");

    const onDisk = readFileSync(envPath, "utf-8");
    expect(onDisk).toContain("A=1");
    expect(onDisk).toContain("B=updated");
    expect(onDisk).toContain("C=3");
  });
});

// ---------------------------------------------------------------------------
// deleteKey
// ---------------------------------------------------------------------------

describe("deleteKey", () => {
  test("removes the key from the vault", async () => {
    const { envPath } = setupRepo("proj", "A=1\nB=2\n");

    const result = await deleteKey(vault, "proj", envPath, "A");
    expect(result).not.toBeNull();
    expect(result?.envFiles[0].keys.length).toBe(1);
    expect(result?.envFiles[0].keys[0].name).toBe("B");
  });

  test("removes the key from the disk file", async () => {
    const { envPath } = setupRepo("proj", "A=1\nB=2\n");

    await deleteKey(vault, "proj", envPath, "A");

    const onDisk = readFileSync(envPath, "utf-8");
    expect(onDisk).not.toContain("A=1");
    expect(onDisk).toContain("B=2");
  });

  test("deleting last key leaves empty keys array", async () => {
    const { envPath } = setupRepo("proj", "ONLY=val\n");

    const result = await deleteKey(vault, "proj", envPath, "ONLY");
    expect(result?.envFiles[0].keys.length).toBe(0);
  });

  test("persists through vault reopen", async () => {
    const { envPath } = setupRepo("proj", "A=1\nB=2\n");
    await deleteKey(vault, "proj", envPath, "A");

    const v2 = new VaultManager();
    await v2.openVault(vaultFile, "test-password");
    const keys = v2.getDB().get("proj")?.envFiles[0].keys;
    expect(keys?.length).toBe(1);
    expect(keys?.[0].name).toBe("B");
  });

  test("returns null for nonexistent repo", async () => {
    const result = await deleteKey(vault, "nope", "/fake/.env", "K");
    expect(result).toBeNull();
  });

  test("returns repo unchanged for nonexistent key", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");
    const result = await deleteKey(vault, "proj", envPath, "MISSING");
    // Key still exists (filter just didn't match anything)
    expect(result?.envFiles[0].keys.length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// addKey
// ---------------------------------------------------------------------------

describe("addKey", () => {
  test("adds a new key to the vault", async () => {
    const { envPath } = setupRepo("proj", "EXISTING=val\n");

    const result = await addKey(
      vault,
      "proj",
      envPath,
      "NEW_KEY",
      "new_val",
      "",
    );
    expect(result).not.toBeNull();
    expect(result?.envFiles[0].keys.length).toBe(2);

    const added = result?.envFiles[0].keys.find((k) => k.name === "NEW_KEY");
    expect(added?.value).toBe("new_val");
  });

  test("writes the new key to disk", async () => {
    const { envPath } = setupRepo("proj", "EXISTING=val\n");

    await addKey(vault, "proj", envPath, "NEW_KEY", "new_val", "");

    const onDisk = readFileSync(envPath, "utf-8");
    expect(onDisk).toContain("EXISTING=val");
    expect(onDisk).toContain("NEW_KEY=new_val");
  });

  test("sets addedAt to today", async () => {
    const { envPath } = setupRepo("proj", "A=1\n");

    const result = await addKey(vault, "proj", envPath, "B", "2", "");
    const key = result?.envFiles[0].keys.find((k) => k.name === "B");
    const today = new Date().toISOString().split("T")[0];
    expect(key?.addedAt).toBe(today);
  });

  test("sets provider when provided", async () => {
    const { envPath } = setupRepo("proj", "A=1\n");

    const result = await addKey(vault, "proj", envPath, "B", "2", "AWS");
    const key = result?.envFiles[0].keys.find((k) => k.name === "B");
    expect(key?.provider).toBe("AWS");
  });

  test("rejects duplicate key name", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");

    const result = await addKey(vault, "proj", envPath, "KEY", "other", "");
    expect(result).toBeNull();
  });

  test("does not modify disk on duplicate rejection", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");
    const before = readFileSync(envPath, "utf-8");

    await addKey(vault, "proj", envPath, "KEY", "other", "");

    const after = readFileSync(envPath, "utf-8");
    expect(after).toBe(before);
  });

  test("persists through vault reopen", async () => {
    const { envPath } = setupRepo("proj", "A=1\n");
    await addKey(vault, "proj", envPath, "B", "2", "Stripe");

    const v2 = new VaultManager();
    await v2.openVault(vaultFile, "test-password");
    const keys = v2.getDB().get("proj")?.envFiles[0].keys;
    expect(keys?.length).toBe(2);
    expect(keys?.[1].name).toBe("B");
    expect(keys?.[1].provider).toBe("Stripe");
  });

  test("returns null for nonexistent repo", async () => {
    const result = await addKey(vault, "nope", "/fake/.env", "K", "v", "");
    expect(result).toBeNull();
  });

  test("preserves existing keys on disk", async () => {
    const { envPath } = setupRepo("proj", "A=1\nB=2\n");

    await addKey(vault, "proj", envPath, "C", "3", "");

    const onDisk = readFileSync(envPath, "utf-8");
    expect(onDisk).toContain("A=1");
    expect(onDisk).toContain("B=2");
    expect(onDisk).toContain("C=3");
  });
});

// ---------------------------------------------------------------------------
// locked vault
// ---------------------------------------------------------------------------

describe("operations on locked vault", () => {
  test("editKey returns null when vault is locked", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");
    vault.lock();
    const result = await editKey(vault, "proj", envPath, "KEY", "new", "");
    expect(result).toBeNull();
  });

  test("deleteKey returns null when vault is locked", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");
    vault.lock();
    const result = await deleteKey(vault, "proj", envPath, "KEY");
    expect(result).toBeNull();
  });

  test("addKey returns null when vault is locked", async () => {
    const { envPath } = setupRepo("proj", "KEY=val\n");
    vault.lock();
    const result = await addKey(vault, "proj", envPath, "NEW", "val", "");
    expect(result).toBeNull();
  });
});
