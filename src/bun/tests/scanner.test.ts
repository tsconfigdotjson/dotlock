import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseEnvFile, rebuildRawContent, scanFolder } from "../scanner";

// ---------------------------------------------------------------------------
// parseEnvFile
// ---------------------------------------------------------------------------

describe("parseEnvFile", () => {
  test("parses simple KEY=VALUE pairs", () => {
    const keys = parseEnvFile("API_KEY=abc123\nDB_URL=postgres://localhost");
    expect(keys.length).toBe(2);
    expect(keys[0].name).toBe("API_KEY");
    expect(keys[0].value).toBe("abc123");
    expect(keys[1].name).toBe("DB_URL");
    expect(keys[1].value).toBe("postgres://localhost");
  });

  test("strips double quotes from values", () => {
    const keys = parseEnvFile('SECRET="my-secret-value"');
    expect(keys[0].value).toBe("my-secret-value");
  });

  test("strips single quotes from values", () => {
    const keys = parseEnvFile("SECRET='my-secret-value'");
    expect(keys[0].value).toBe("my-secret-value");
  });

  test("handles export prefix", () => {
    const keys = parseEnvFile("export API_KEY=abc123");
    expect(keys.length).toBe(1);
    expect(keys[0].name).toBe("API_KEY");
    expect(keys[0].value).toBe("abc123");
  });

  test("skips comments", () => {
    const keys = parseEnvFile("# This is a comment\nAPI_KEY=abc123\n# Another");
    expect(keys.length).toBe(1);
    expect(keys[0].name).toBe("API_KEY");
  });

  test("skips blank lines", () => {
    const keys = parseEnvFile("\n\nAPI_KEY=abc123\n\nDB_URL=pg\n\n");
    expect(keys.length).toBe(2);
  });

  test("handles empty values", () => {
    const keys = parseEnvFile("EMPTY_KEY=");
    expect(keys.length).toBe(1);
    expect(keys[0].name).toBe("EMPTY_KEY");
    expect(keys[0].value).toBe("");
  });

  test("handles values containing equals signs", () => {
    const keys = parseEnvFile("URL=postgres://host?opt=val&b=2");
    expect(keys[0].value).toBe("postgres://host?opt=val&b=2");
  });

  test("sets addedAt to today", () => {
    const today = new Date().toISOString().split("T")[0];
    const keys = parseEnvFile("KEY=val");
    expect(keys[0].addedAt).toBe(today);
  });

  test("returns empty array for empty content", () => {
    expect(parseEnvFile("")).toEqual([]);
  });

  test("returns empty array for comments-only content", () => {
    expect(parseEnvFile("# just a comment\n# another")).toEqual([]);
  });

  test("rejects invalid key names", () => {
    const keys = parseEnvFile("123BAD=val\nGOOD_KEY=val");
    expect(keys.length).toBe(1);
    expect(keys[0].name).toBe("GOOD_KEY");
  });

  test("handles keys starting with underscore", () => {
    const keys = parseEnvFile("_PRIVATE=secret");
    expect(keys.length).toBe(1);
    expect(keys[0].name).toBe("_PRIVATE");
  });
});

// ---------------------------------------------------------------------------
// rebuildRawContent
// ---------------------------------------------------------------------------

describe("rebuildRawContent", () => {
  test("builds KEY=VALUE lines with trailing newline", () => {
    const raw = rebuildRawContent([
      { name: "A", value: "1" },
      { name: "B", value: "2" },
    ]);
    expect(raw).toBe("A=1\nB=2\n");
  });

  test("handles empty keys array", () => {
    const raw = rebuildRawContent([]);
    expect(raw).toBe("\n");
  });

  test("handles single key", () => {
    const raw = rebuildRawContent([{ name: "KEY", value: "val" }]);
    expect(raw).toBe("KEY=val\n");
  });

  test("handles empty values", () => {
    const raw = rebuildRawContent([{ name: "EMPTY", value: "" }]);
    expect(raw).toBe("EMPTY=\n");
  });

  test("handles values with special characters", () => {
    const raw = rebuildRawContent([
      { name: "URL", value: "postgres://user:pass@host/db?ssl=true" },
    ]);
    expect(raw).toBe("URL=postgres://user:pass@host/db?ssl=true\n");
  });
});

// ---------------------------------------------------------------------------
// parseEnvFile ↔ rebuildRawContent round-trip
// ---------------------------------------------------------------------------

describe("parse ↔ rebuild round-trip", () => {
  test("parse then rebuild produces parseable output", () => {
    const original = "API_KEY=abc123\nDB_URL=postgres://localhost\n";
    const keys = parseEnvFile(original);
    const rebuilt = rebuildRawContent(keys);
    const reparsed = parseEnvFile(rebuilt);

    expect(reparsed.length).toBe(keys.length);
    for (let i = 0; i < keys.length; i++) {
      expect(reparsed[i].name).toBe(keys[i].name);
      expect(reparsed[i].value).toBe(keys[i].value);
    }
  });

  test("rebuild then parse preserves all keys", () => {
    const keys = [
      { name: "A", value: "1" },
      { name: "B", value: "hello world" },
      { name: "C", value: "" },
    ];
    const raw = rebuildRawContent(keys);
    const parsed = parseEnvFile(raw);

    expect(parsed.length).toBe(3);
    expect(parsed[0].name).toBe("A");
    expect(parsed[0].value).toBe("1");
    expect(parsed[1].name).toBe("B");
    expect(parsed[1].value).toBe("hello world");
    expect(parsed[2].name).toBe("C");
    expect(parsed[2].value).toBe("");
  });

  test("quoted values survive round-trip", () => {
    const original = 'TOKEN="sk-abc123"\n';
    const keys = parseEnvFile(original);
    expect(keys[0].value).toBe("sk-abc123");

    const rebuilt = rebuildRawContent(keys);
    const reparsed = parseEnvFile(rebuilt);
    expect(reparsed[0].value).toBe("sk-abc123");
  });

  test("export prefix values survive round-trip", () => {
    const original = "export SECRET=mysecret\n";
    const keys = parseEnvFile(original);
    const rebuilt = rebuildRawContent(keys);
    const reparsed = parseEnvFile(rebuilt);

    expect(reparsed[0].name).toBe("SECRET");
    expect(reparsed[0].value).toBe("mysecret");
  });
});

// ---------------------------------------------------------------------------
// scanFolder
// ---------------------------------------------------------------------------

const SCAN_DIR = join(tmpdir(), `dotlock-scanner-tests-${Date.now()}`);

beforeEach(() => {
  if (!existsSync(SCAN_DIR)) {
    mkdirSync(SCAN_DIR, { recursive: true });
  }
});

afterEach(() => {
  if (existsSync(SCAN_DIR)) {
    rmSync(SCAN_DIR, { recursive: true });
  }
});

describe("scanFolder", () => {
  test("finds .env files", async () => {
    writeFileSync(join(SCAN_DIR, ".env"), "KEY=val\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files.length).toBe(1);
    expect(files[0].filename).toBe(".env");
    expect(files[0].keys.length).toBe(1);
    expect(files[0].keys[0].name).toBe("KEY");
  });

  test("finds .env.* variant files", async () => {
    writeFileSync(join(SCAN_DIR, ".env.local"), "A=1\n");
    writeFileSync(join(SCAN_DIR, ".env.production"), "B=2\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files.length).toBe(2);
    const names = files.map((f) => f.filename).sort();
    expect(names).toEqual([".env.local", ".env.production"]);
  });

  test("ignores node_modules", async () => {
    const nm = join(SCAN_DIR, "node_modules");
    mkdirSync(nm, { recursive: true });
    writeFileSync(join(nm, ".env"), "SECRET=hidden\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files.length).toBe(0);
  });

  test("ignores .git directory", async () => {
    const git = join(SCAN_DIR, ".git");
    mkdirSync(git, { recursive: true });
    writeFileSync(join(git, ".env"), "SECRET=hidden\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files.length).toBe(0);
  });

  test("scans subdirectories", async () => {
    const sub = join(SCAN_DIR, "packages", "api");
    mkdirSync(sub, { recursive: true });
    writeFileSync(join(sub, ".env"), "NESTED=true\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files.length).toBe(1);
    expect(files[0].filename).toContain("packages/api");
  });

  test("skips empty env files (no keys)", async () => {
    writeFileSync(join(SCAN_DIR, ".env"), "# only comments\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files.length).toBe(0);
  });

  test("sets syncStatus to synced for scanned files", async () => {
    writeFileSync(join(SCAN_DIR, ".env"), "KEY=val\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files[0].syncStatus).toBe("synced");
  });

  test("stores relativePath correctly", async () => {
    writeFileSync(join(SCAN_DIR, ".env"), "KEY=val\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files[0].relativePath).toBe(".env");
  });

  test("stores relativePath correctly for nested files", async () => {
    const sub = join(SCAN_DIR, "packages", "api");
    mkdirSync(sub, { recursive: true });
    writeFileSync(join(sub, ".env"), "NESTED=true\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files[0].relativePath).toBe(join("packages", "api", ".env"));
  });

  test("stores rawContent matching file contents", async () => {
    const content = "API_KEY=abc\nDB=pg\n";
    writeFileSync(join(SCAN_DIR, ".env"), content);
    const files = await scanFolder(SCAN_DIR);
    expect(files[0].rawContent).toBe(content);
  });

  test("returns empty array for empty directory", async () => {
    const files = await scanFolder(SCAN_DIR);
    expect(files).toEqual([]);
  });

  test("skips non-env files", async () => {
    writeFileSync(join(SCAN_DIR, "config.json"), '{"key": "val"}');
    writeFileSync(join(SCAN_DIR, ".envrc"), "export A=1\n");
    writeFileSync(join(SCAN_DIR, ".env"), "KEY=val\n");
    const files = await scanFolder(SCAN_DIR);
    expect(files.length).toBe(1);
    expect(files[0].filename).toBe(".env");
  });
});
