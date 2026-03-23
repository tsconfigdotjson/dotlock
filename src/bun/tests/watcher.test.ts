import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
function makeRepo(name: string, filePath: string, rawContent: string): Repo {
  return {
    name,
    path: TEST_DIR,
    envFiles: [
      {
        filename: filePath.split("/").pop() ?? "",
        absolutePath: filePath,
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
  files: { path: string; rawContent: string }[],
): Repo {
  return {
    name,
    path: TEST_DIR,
    envFiles: files.map((f) => ({
      filename: f.path.split("/").pop() ?? "",
      absolutePath: f.path,
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
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

// ── watchRepo / unwatchRepo lifecycle ────────────────────────────────

describe("watchRepo / unwatchRepo lifecycle", () => {
  test("watchRepo then unwatchRepo does not throw", () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("my-repo", filePath, "KEY=value"));

    expect(() => {
      fileWatcher.watchRepo("my-repo", [filePath]);
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
    db.add(makeRepo("my-repo", filePath, "KEY=value"));

    fileWatcher.watchRepo("my-repo", [filePath]);
    // Calling again should internally unwatch the first, then set up new watchers
    expect(() => {
      fileWatcher.watchRepo("my-repo", [filePath]);
    }).not.toThrow();
  });

  test("watchRepo with non-existent directory marks files as missing", () => {
    const missingDir = join(TEST_DIR, "nonexistent-dir");
    const filePath = join(missingDir, ".env");
    db.add(makeRepo("ghost-repo", filePath, "KEY=value"));

    fileWatcher.watchRepo("ghost-repo", [filePath]);

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
    db.add(makeRepo("repo-a", file1, "A=1"));
    db.add(makeRepo("repo-b", file2, "B=2"));

    fileWatcher.watchRepo("repo-a", [file1]);
    fileWatcher.watchRepo("repo-b", [file2]);

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
    db.add(makeRepo("sync-repo", filePath, content));

    fileWatcher.watchRepo("sync-repo", [filePath]);
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
    db.add(makeRepo("drift-repo", filePath, "SECRET=original"));

    fileWatcher.watchRepo("drift-repo", [filePath]);
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
    db.add(makeRepo("missing-repo", filePath, "KEY=value"));

    fileWatcher.watchRepo("missing-repo", [filePath]);
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
    db.add(makeRepo("trim-repo", filePath, "KEY=value"));

    fileWatcher.watchRepo("trim-repo", [filePath]);
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
    db.add(makeRepo("trim-repo2", filePath, "KEY=value\n"));

    fileWatcher.watchRepo("trim-repo2", [filePath]);
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
    db.add(makeRepo("notify-repo", filePath, "KEY=original"));

    const notifications: string[] = [];
    fileWatcher.setOnChange((repoName) => {
      notifications.push(repoName);
    });

    fileWatcher.watchRepo("notify-repo", [filePath]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Change the file to trigger drift
    writeFileSync(filePath, "KEY=changed");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(notifications).toContain("notify-repo");
  });

  test("onChange does not fire when status stays the same", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=same");
    db.add(makeRepo("stable-repo", filePath, "KEY=same"));

    const notifications: string[] = [];
    fileWatcher.setOnChange((repoName) => {
      notifications.push(repoName);
    });

    fileWatcher.watchRepo("stable-repo", [filePath]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Write same content — status stays "synced"
    writeFileSync(filePath, "KEY=same");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    expect(notifications).toEqual([]);
  });

  test("onChange fires when file is deleted (synced -> missing)", async () => {
    const filePath = join(TEST_DIR, ".env");
    writeFileSync(filePath, "KEY=value");
    db.add(makeRepo("delete-repo", filePath, "KEY=value"));

    const notifications: string[] = [];
    fileWatcher.setOnChange((repoName) => {
      notifications.push(repoName);
    });

    fileWatcher.watchRepo("delete-repo", [filePath]);
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
    db.add(makeRepo("debounce-repo", filePath, "KEY=start"));

    let notifyCount = 0;
    fileWatcher.setOnChange(() => {
      notifyCount++;
    });

    fileWatcher.watchRepo("debounce-repo", [filePath]);
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
    db.add(makeRepo("null-db-repo", filePath, "KEY=value"));

    fileWatcher.watchRepo("null-db-repo", [filePath]);
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
    db.add(makeRepo("throw-db-repo", filePath, "KEY=value"));

    fileWatcher.watchRepo("throw-db-repo", [filePath]);
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
    db.add(makeRepo("removed-repo", filePath, "KEY=value"));
    fileWatcher.watchRepo("removed-repo", [filePath]);
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
    const otherPath = join(TEST_DIR, ".env.other");
    db.add(makeRepo("wrong-file-repo", otherPath, "KEY=value"));
    // But watch the actual file path
    fileWatcher.watchRepo("wrong-file-repo", [filePath]);
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
        { path: file1, rawContent: "A=1" },
        { path: file2, rawContent: "B=2" },
      ]),
    );

    fileWatcher.watchRepo("multi-repo", [file1, file2]);
    await Bun.sleep(FSEVENTS_SETTLE_MS);

    // Change only file1
    writeFileSync(file1, "A=changed");

    await Bun.sleep(DEBOUNCE_WAIT_MS);

    const repo = db.get("multi-repo");
    expect(repo?.envFiles[0].syncStatus).toBe("disk_changed");
    expect(repo?.envFiles[1].syncStatus).toBe("synced");
  });
});
