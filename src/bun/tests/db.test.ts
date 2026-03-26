import { describe, expect, test } from "bun:test";
import type { EnvFile, Repo } from "../../shared/types";
import { InMemoryDB } from "../db";

function makeEnvFile(overrides: Partial<EnvFile> = {}): EnvFile {
  return {
    filename: ".env",
    absolutePath: "/project/.env",
    rawContent: "KEY=val\n",
    keys: [{ name: "KEY", value: "val" }],
    syncStatus: "synced",
    ...overrides,
  };
}

function makeRepo(overrides: Partial<Repo> = {}): Repo {
  return {
    name: "my-project",
    path: "/path/to/my-project",
    envFiles: [makeEnvFile()],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Basic CRUD
// ---------------------------------------------------------------------------

describe("InMemoryDB CRUD", () => {
  test("starts empty", () => {
    const db = new InMemoryDB();
    expect(db.getAll()).toEqual([]);
  });

  test("add and get", () => {
    const db = new InMemoryDB();
    const repo = makeRepo();
    db.add(repo);

    expect(db.get("my-project")).toEqual(repo);
  });

  test("getAll returns all repos", () => {
    const db = new InMemoryDB();
    db.add(makeRepo({ name: "a", path: "/a" }));
    db.add(makeRepo({ name: "b", path: "/b" }));
    expect(db.getAll().length).toBe(2);
  });

  test("get returns null for missing repo", () => {
    const db = new InMemoryDB();
    expect(db.get("nonexistent")).toBeNull();
  });

  test("remove returns true and deletes", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    expect(db.remove("my-project")).toBe(true);
    expect(db.get("my-project")).toBeNull();
  });

  test("remove returns false for missing repo", () => {
    const db = new InMemoryDB();
    expect(db.remove("nonexistent")).toBe(false);
  });

  test("add overwrites existing repo with same name", () => {
    const db = new InMemoryDB();
    db.add(makeRepo({ path: "/old" }));
    db.add(makeRepo({ path: "/new" }));
    expect(db.get("my-project")?.path).toBe("/new");
    expect(db.getAll().length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// findByPath
// ---------------------------------------------------------------------------

describe("findByPath", () => {
  test("finds repo by path", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    const found = db.findByPath("/path/to/my-project");
    expect(found?.name).toBe("my-project");
  });

  test("returns null for unknown path", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    expect(db.findByPath("/unknown")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// updateSyncStatus
// ---------------------------------------------------------------------------

describe("updateSyncStatus", () => {
  test("updates sync status for matching file", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());

    db.updateSyncStatus("my-project", "/project/.env", "disk_changed");
    const repo = db.get("my-project");
    expect(repo).not.toBeNull();
    expect(repo?.envFiles[0].syncStatus).toBe("disk_changed");
  });

  test("does nothing for unknown repo", () => {
    const db = new InMemoryDB();
    // Should not throw
    db.updateSyncStatus("nonexistent", "/path", "missing");
  });

  test("does nothing for unknown file path", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    db.updateSyncStatus("my-project", "/unknown/.env", "disk_changed");
    expect(db.get("my-project")?.envFiles[0].syncStatus).toBe("synced");
  });

  test("can set status to missing", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    db.updateSyncStatus("my-project", "/project/.env", "missing");
    expect(db.get("my-project")?.envFiles[0].syncStatus).toBe("missing");
  });

  test("can set status back to synced", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    db.updateSyncStatus("my-project", "/project/.env", "disk_changed");
    db.updateSyncStatus("my-project", "/project/.env", "synced");
    expect(db.get("my-project")?.envFiles[0].syncStatus).toBe("synced");
  });
});

// ---------------------------------------------------------------------------
// updateEnvFile
// ---------------------------------------------------------------------------

describe("updateEnvFile", () => {
  test("replaces env file content by absolutePath", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());

    const updated = makeEnvFile({
      rawContent: "NEW_KEY=new_val\n",
      keys: [{ name: "NEW_KEY", value: "new_val" }],
    });
    db.updateEnvFile("my-project", updated);

    const repo = db.get("my-project");
    expect(repo).not.toBeNull();
    expect(repo?.envFiles[0].keys[0].name).toBe("NEW_KEY");
    expect(repo?.envFiles[0].rawContent).toBe("NEW_KEY=new_val\n");
  });

  test("does nothing for unknown repo", () => {
    const db = new InMemoryDB();
    const file = makeEnvFile();
    // Should not throw
    db.updateEnvFile("nonexistent", file);
  });

  test("does nothing for unmatched absolutePath", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    const file = makeEnvFile({ absolutePath: "/other/.env" });
    db.updateEnvFile("my-project", file);
    // Original file unchanged
    expect(db.get("my-project")?.envFiles[0].keys[0].name).toBe("KEY");
  });

  test("replaces correct file when repo has multiple env files", () => {
    const db = new InMemoryDB();
    db.add(
      makeRepo({
        envFiles: [
          makeEnvFile({
            absolutePath: "/project/.env",
            keys: [{ name: "A", value: "1" }],
          }),
          makeEnvFile({
            filename: ".env.local",
            absolutePath: "/project/.env.local",
            keys: [{ name: "B", value: "2" }],
          }),
        ],
      }),
    );

    const updated = makeEnvFile({
      filename: ".env.local",
      absolutePath: "/project/.env.local",
      keys: [{ name: "B", value: "updated" }],
    });
    db.updateEnvFile("my-project", updated);

    const repo = db.get("my-project");
    expect(repo).not.toBeNull();
    expect(repo?.envFiles[0].keys[0].value).toBe("1"); // unchanged
    expect(repo?.envFiles[1].keys[0].value).toBe("updated"); // replaced
  });
});

// ---------------------------------------------------------------------------
// getWatchPaths
// ---------------------------------------------------------------------------

describe("getWatchPaths", () => {
  test("returns absolute paths for all env files", () => {
    const db = new InMemoryDB();
    db.add(
      makeRepo({
        envFiles: [
          makeEnvFile({ absolutePath: "/project/.env" }),
          makeEnvFile({ absolutePath: "/project/.env.local" }),
        ],
      }),
    );
    const paths = db.getWatchPaths("my-project");
    expect(paths).toEqual(["/project/.env", "/project/.env.local"]);
  });

  test("returns empty array for unknown repo", () => {
    const db = new InMemoryDB();
    expect(db.getWatchPaths("nonexistent")).toEqual([]);
  });

  test("returns empty array for repo with no env files", () => {
    const db = new InMemoryDB();
    db.add(makeRepo({ envFiles: [] }));
    expect(db.getWatchPaths("my-project")).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Serialization: toJSON / loadFromJSON
// ---------------------------------------------------------------------------

describe("toJSON / loadFromJSON", () => {
  test("round-trip preserves all repos", () => {
    const db1 = new InMemoryDB();
    db1.add(makeRepo({ name: "a", path: "/a" }));
    db1.add(makeRepo({ name: "b", path: "/b" }));

    const json = db1.toJSON();

    const db2 = new InMemoryDB();
    db2.loadFromJSON(json);
    expect(db2.getAll().length).toBe(2);
    expect(db2.get("a")?.path).toBe("/a");
    expect(db2.get("b")?.path).toBe("/b");
  });

  test("loadFromJSON clears existing data", () => {
    const db = new InMemoryDB();
    db.add(makeRepo({ name: "old", path: "/old" }));

    db.loadFromJSON([makeRepo({ name: "new", path: "/new" })]);

    expect(db.get("old")).toBeNull();
    expect(db.get("new")?.path).toBe("/new");
    expect(db.getAll().length).toBe(1);
  });

  test("loadFromJSON with empty array clears all", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    db.loadFromJSON([]);
    expect(db.getAll()).toEqual([]);
  });

  test("toJSON returns array (not Map)", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());
    const json = db.toJSON();
    expect(Array.isArray(json)).toBe(true);
  });

  test("round-trip preserves env file keys and metadata", () => {
    const db1 = new InMemoryDB();
    db1.add(
      makeRepo({
        envFiles: [
          makeEnvFile({
            keys: [
              {
                name: "SECRET",
                value: "abc",
                provider: "AWS",
                addedAt: "2025-01-01",
                lastRotated: "2025-06-01",
              },
            ],
          }),
        ],
      }),
    );

    const db2 = new InMemoryDB();
    db2.loadFromJSON(db1.toJSON());

    const key = db2.get("my-project")?.envFiles[0].keys[0];
    expect(key?.name).toBe("SECRET");
    expect(key?.value).toBe("abc");
    expect(key?.provider).toBe("AWS");
    expect(key?.addedAt).toBe("2025-01-01");
    expect(key?.lastRotated).toBe("2025-06-01");
  });
});

// ---------------------------------------------------------------------------
// addEnvFile
// ---------------------------------------------------------------------------

describe("addEnvFile", () => {
  test("adds a new env file to an existing repo", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());

    db.addEnvFile(
      "my-project",
      makeEnvFile({
        filename: ".env.local",
        absolutePath: "/project/.env.local",
        rawContent: "LOCAL=true\n",
        keys: [{ name: "LOCAL", value: "true" }],
      }),
    );

    const repo = db.get("my-project");
    expect(repo?.envFiles.length).toBe(2);
    expect(repo?.envFiles[1].filename).toBe(".env.local");
  });

  test("no-op for unknown repo", () => {
    const db = new InMemoryDB();
    db.addEnvFile("nonexistent", makeEnvFile());
    expect(db.get("nonexistent")).toBeNull();
  });

  test("no-op for duplicate absolutePath", () => {
    const db = new InMemoryDB();
    db.add(makeRepo());

    // Try adding a file with the same absolutePath as the existing one
    db.addEnvFile(
      "my-project",
      makeEnvFile({ absolutePath: "/project/.env", rawContent: "DUPE=yes\n" }),
    );

    const repo = db.get("my-project");
    expect(repo?.envFiles.length).toBe(1);
    // Original content unchanged
    expect(repo?.envFiles[0].rawContent).toBe("KEY=val\n");
  });
});
