import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative } from "node:path";
import type { Repo } from "../../shared/types";
import { InMemoryDB } from "../db";
import { fileWatcher } from "../watcher";

const TEST_DIR = join(tmpdir(), "dotlock-watcher-tests", `run-${Date.now()}`);

/**
 * macOS FSEvents needs a brief moment after fs.watch() is called before it
 * reliably delivers events. This constant is used after watchRepo() in every
 * async test to avoid flaky misses.
 */
const FSEVENTS_SETTLE_MS = 100;

/** Use a fast debounce in tests (50ms instead of the default 300ms). */
const TEST_DEBOUNCE_MS = 50;

/** Debounce + buffer for timer + async checkFile. */
const DEBOUNCE_WAIT_MS = TEST_DEBOUNCE_MS + 100;

/** Build a Repo object with one env file for testing. */
function makeRepo(
  name: string,
  relativePath: string,
  rawContent: string,
): Repo {
  return {
    name,
    envFiles: [
      {
        filename: basename(relativePath),
        relativePath,
        rawContent,
        keys: [],
        syncStatus: "synced",
      },
    ],
  };
}

/** Build a Repo with multiple env files. */
function makeRepoMulti(
  name: string,
  files: { relativePath: string; rawContent: string }[],
): Repo {
  return {
    name,
    envFiles: files.map((f) => ({
      filename: basename(f.relativePath),
      relativePath: f.relativePath,
      rawContent: f.rawContent,
      keys: [],
      syncStatus: "synced",
    })),
  };
}

let db: InMemoryDB;

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  db = new InMemoryDB();
  fileWatcher.setGetDB(() => db);
  fileWatcher.setOnChange(() => {});
  fileWatcher.setDebounceMs(TEST_DEBOUNCE_MS);
});

afterEach(() => {
  fileWatcher.unwatchAll();
  // Reset callbacks so nothing leaks between tests
  fileWatcher.setGetDB(null as unknown as () => InMemoryDB);
  fileWatcher.setOnChange(null as unknown as (repoName: string) => void);
  fileWatcher.setOnNewEnvFile(null);
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

// ── watchRepo / unwatchRepo lifecycle ────────────────────────────────

describe("watchRepo / unwatchRepo lifecycle", () => {
  test("watchRepo then unwatchRepo does not throw", () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("my-repo", ".env", "KEY=value"));

    expect(() => {
      fileWatcher.watchRepo("my-repo", TEST_DIR, [".env"]);
    }).not.toThrow();

    expect(() => {
      fileWatcher.unwatchRepo("my-repo");
    }).not.toThrow();
  });

  test("unwatchRepo on non-existent repo does not throw", () => {
    expect(() => {
      fileWatcher.unwatchRepo("no-such-repo");
    }).not.toThrow();
  });

  test("calling watchRepo twice replaces the previous watch", () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("my-repo", ".env", "KEY=value"));

    fileWatcher.watchRepo("my-repo", TEST_DIR, [".env"]);
    // Calling again should internally unwatch the first, then set up new watchers
    expect(() => {
      fileWatcher.watchRepo("my-repo", TEST_DIR, [".env"]);
    }).not.toThrow();
  });

  test("watchRepo with non-existent directory marks files as missing", () => {
    const missingDir = join(TEST_DIR, "nonexistent-dir");
    db.add(makeRepo("ghost-repo", ".env", "KEY=value"));

    fileWatcher.watchRepo("ghost-repo", missingDir, [".env"]);

    const repo = db.get("ghost-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("missing");
  });
});

// ── unwatchAll ───────────────────────────────────────────────────────

describe("unwatchAll", () => {
  test("cleans up multiple repos", () => {
    const file1 = join(TEST_DIR, ".env");
    const file2 = join(TEST_DIR, ".env.local");
    writeFileSync(file1, "A=1");
    writeFileSync(file2, "B=2");
    db.add(makeRepo("repo-a", ".env", "A=1"));
    db.add(makeRepo("repo-b", ".env.local", "B=2"));

    fileWatcher.watchRepo("repo-a", TEST_DIR, [".env"]);
    fileWatcher.watchRepo("repo-b", TEST_DIR, [".env.local"]);

    expect(() => {
      fileWatcher.unwatchAll();
    }).not.toThrow();
  });

  test("unwatchAll when nothing is watched does not throw", () => {
    expect(() => {
      fileWatcher.unwatchAll();
    }).not.toThrow();
  });
});

// ── Status detection via checkFile ───────────────────────────────────

describe("status detection", () => {
  test("file in sync is detected as synced", async () => {
    const filePath = join(TEST_DIR, ".env");
    const content = "SECRET=abc123";
    writeFileSync(filePath, content);
    db.add(makeRepo("sync-repo", ".env", content));

    fileWatcher.watchRepo("sync-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Trigger a check by modifying the file (same content)
    writeFileSync(filePath, content);

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const repo = db.get("sync-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("synced");
  });

  test("disk content differing from vault is detected as disk_changed", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "SECRET=original");
    db.add(makeRepo("drift-repo", ".env", "SECRET=original"));

    fileWatcher.watchRepo("drift-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Now change the file on disk
    writeFileSync(filePath, "SECRET=modified");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const repo = db.get("drift-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("disk_changed");
  });

  test("deleted file is detected as missing", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("missing-repo", ".env", "KEY=value"));

    fileWatcher.watchRepo("missing-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Delete the file
    rmSync(filePath);

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const repo = db.get("missing-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("missing");
  });

  test("trailing whitespace is ignored when comparing content", async () => {
    const filePath = join(TEST_DIR, ".env");
    // Disk has trailing newline, vault does not
    writeFileSync(filePath, "KEY=value\n");
    db.add(makeRepo("trim-repo", ".env", "KEY=value"));

    fileWatcher.watchRepo("trim-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Touch the file to trigger a check (content stays the same)
    writeFileSync(filePath, "KEY=value\n");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const repo = db.get("trim-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("synced");
  });

  test("trailing whitespace ignored symmetrically (vault has trailing newline)", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("trim-repo2", ".env", "KEY=value\n"));

    fileWatcher.watchRepo("trim-repo2", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    writeFileSync(filePath, "KEY=value");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const repo = db.get("trim-repo2");
    expect(repo?.envFiles[0].syncStatus).toBe("synced");
  });
});

// ── onChange callback / transitions ──────────────────────────────────

describe("onChange notifications", () => {
  test("onChange fires when status transitions from synced to disk_changed", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=original");
    db.add(makeRepo("notify-repo", ".env", "KEY=original"));

    const notifications: string[] = [];
    fileWatcher.setOnChange((repoName) => {
      notifications.push(repoName);
    });

    fileWatcher.watchRepo("notify-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Change the file to trigger drift
    writeFileSync(filePath, "KEY=changed");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(notifications).toContain("notify-repo");
  });

  test("onChange does not fire when status stays the same", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=same");
    db.add(makeRepo("stable-repo", ".env", "KEY=same"));

    const notifications: string[] = [];
    fileWatcher.setOnChange((repoName) => {
      notifications.push(repoName);
    });

    fileWatcher.watchRepo("stable-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Write same content — status stays "synced"
    writeFileSync(filePath, "KEY=same");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(notifications).toEqual([]);
  });

  test("onChange fires when file is deleted (synced -> missing)", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("delete-repo", ".env", "KEY=value"));

    const notifications: string[] = [];
    fileWatcher.setOnChange((repoName) => {
      notifications.push(repoName);
    });

    fileWatcher.watchRepo("delete-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    rmSync(filePath);

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(notifications).toContain("delete-repo");
  });
});

// ── Debouncing ───────────────────────────────────────────────────────

describe("debouncing", () => {
  test("rapid writes result in only one status check", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=start");
    db.add(makeRepo("debounce-repo", ".env", "KEY=start"));

    let notifyCount = 0;
    fileWatcher.setOnChange(() => {
      notifyCount++;
    });

    fileWatcher.watchRepo("debounce-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Rapid-fire writes within the debounce window
    for (let i = 0; i < 5; i++) {
      writeFileSync(filePath, `KEY=change-${i}`);
      await Bun.sleep(10);
    }

    // Wait for debounce to settle
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Should have only notified once (one debounced check)
    expect(notifyCount).toBe(1);

    // Final status should reflect the last write
    const repo = db.get("debounce-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("disk_changed");
  });
});

// ── Null / error handling for getDB ──────────────────────────────────

describe("null/error getDB handling", () => {
  test("checkFile is a no-op when getDB is null", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("null-db-repo", ".env", "KEY=value"));

    fileWatcher.watchRepo("null-db-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Clear getDB so checkFile bails out early
    fileWatcher.setGetDB(null as unknown as () => InMemoryDB);

    // Trigger a change
    writeFileSync(filePath, "KEY=changed");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Status should remain unchanged because checkFile returned early
    const repo = db.get("null-db-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("synced");
  });

  test("checkFile is a no-op when getDB throws", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("throw-db-repo", ".env", "KEY=value"));

    fileWatcher.watchRepo("throw-db-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Make getDB throw
    fileWatcher.setGetDB(() => {
      throw new Error("DB unavailable");
    });

    writeFileSync(filePath, "KEY=changed");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Status unchanged — checkFile caught the exception and returned
    const repo = db.get("throw-db-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("synced");
  });

  test("checkFile is a no-op when repo not found in DB", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");

    // Add repo then watch it
    db.add(makeRepo("removed-repo", ".env", "KEY=value"));
    fileWatcher.watchRepo("removed-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Remove the repo from DB before the check fires
    db.remove("removed-repo");

    writeFileSync(filePath, "KEY=changed");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Repo was removed from DB, so no update happened (no crash either)
    expect(db.get("removed-repo")).toBeNull();
  });

  test("checkFile is a no-op when env file not found in repo", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");

    // Add repo with a different file path
    db.add(makeRepo("wrong-file-repo", ".env.other", "KEY=value"));
    // But watch the actual file path
    fileWatcher.watchRepo("wrong-file-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    writeFileSync(filePath, "KEY=changed");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // The env file in the DB was for a different path, so no status change
    const repo = db.get("wrong-file-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("synced");
  });
});

// ── Multiple files in one repo ───────────────────────────────────────

describe("multiple files in one repo", () => {
  test("changes to one file do not affect the other", async () => {
    const file1 = join(TEST_DIR, ".env");
    const file2 = join(TEST_DIR, ".env.local");
    writeFileSync(file1, "A=1");
    writeFileSync(file2, "B=2");

    db.add(
      makeRepoMulti("multi-repo", [
        { relativePath: ".env", rawContent: "A=1" },
        { relativePath: ".env.local", rawContent: "B=2" },
      ]),
    );

    fileWatcher.watchRepo("multi-repo", TEST_DIR, [".env", ".env.local"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Change only file1
    writeFileSync(file1, "A=changed");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const repo = db.get("multi-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("disk_changed");
    expect(repo?.envFiles[1].syncStatus).toBe("synced");
  });
});

// ── New env file detection ──────────────────────────────────────────

describe("new env file detection", () => {
  test("new .env file in a watched directory triggers onNewEnvFile", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("detect-repo", ".env", "KEY=value"));

    const detected: { repoName: string; relativePath: string }[] = [];
    fileWatcher.setOnNewEnvFile(async (repoName, relativePath) => {
      detected.push({ repoName, relativePath });
      return true;
    });

    fileWatcher.watchRepo("detect-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Create a new .env file in the same directory
    const newFile = join(TEST_DIR, ".env.local");
    writeFileSync(newFile, "LOCAL=true");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(detected.length).toBe(1);
    expect(detected[0].repoName).toBe("detect-repo");
    expect(detected[0].relativePath).toBe(relative(TEST_DIR, newFile));
  });

  test("non-.env files in watched directory do not trigger onNewEnvFile", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("ignore-repo", ".env", "KEY=value"));

    const detected: string[] = [];
    fileWatcher.setOnNewEnvFile(async (_repoName, relativePath) => {
      detected.push(relativePath);
      return false;
    });

    fileWatcher.watchRepo("ignore-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Create a non-.env file
    writeFileSync(join(TEST_DIR, "readme.md"), "hello");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(detected.length).toBe(0);
  });

  test("new file is tracked for drift after onNewEnvFile returns true", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("track-new-repo", ".env", "KEY=value"));

    fileWatcher.setOnNewEnvFile(async (repoName, relativePath) => {
      // Simulate adding the file to the DB (as index.ts would)
      const repo = db.get(repoName);
      if (repo) {
        repo.envFiles.push({
          filename: basename(relativePath),
          relativePath,
          rawContent: "LOCAL=true",
          keys: [],
          syncStatus: "synced",
        });
      }
      return true;
    });

    fileWatcher.watchRepo("track-new-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Create new file — triggers onNewEnvFile
    const newFile = join(TEST_DIR, ".env.local");
    writeFileSync(newFile, "LOCAL=true");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    // Now modify the new file — should trigger normal drift detection
    const notifications: string[] = [];
    fileWatcher.setOnChange((name) => notifications.push(name));

    writeFileSync(newFile, "LOCAL=changed");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const repo = db.get("track-new-repo");
    const newEnv = repo?.envFiles.find((f) => f.relativePath === ".env.local");
    expect(newEnv?.syncStatus).toBe("disk_changed");
    expect(notifications).toContain("track-new-repo");
  });

  test("onNewEnvFile returning false does not track the file", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("no-track-repo", ".env", "KEY=value"));

    let callCount = 0;
    fileWatcher.setOnNewEnvFile(async () => {
      callCount++;
      return false;
    });

    fileWatcher.watchRepo("no-track-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Create a .env file — callback returns false
    const newFile = join(TEST_DIR, ".env.local");
    writeFileSync(newFile, "");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(callCount).toBe(1);

    // Modify it again — should re-trigger since it was not tracked
    writeFileSync(newFile, "LOCAL=now-has-keys");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(callCount).toBe(2);
  });

  test("onChange fires after onNewEnvFile adds a file", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("notify-new-repo", ".env", "KEY=value"));

    const notifications: string[] = [];
    fileWatcher.setOnChange((name) => notifications.push(name));
    fileWatcher.setOnNewEnvFile(async () => true);

    fileWatcher.watchRepo("notify-new-repo", TEST_DIR, [".env"]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    writeFileSync(join(TEST_DIR, ".env.local"), "LOCAL=true");
    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(notifications).toContain("notify-new-repo");
  });
});
