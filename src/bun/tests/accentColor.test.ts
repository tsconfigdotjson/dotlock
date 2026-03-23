import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { chmodSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getAccentColor, isHelperAvailable } from "../keychain";

const TEST_DIR = join(tmpdir(), "dotlock-accent-tests", `run-${Date.now()}`);

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

/** Create a tiny shell script that behaves like the helper. */
function createMockHelper(name: string, script: string): string {
  const path = join(TEST_DIR, name);
  writeFileSync(path, `#!/bin/sh\n${script}\n`);
  chmodSync(path, 0o755);
  return path;
}

describe("getAccentColor", () => {
  test("returns hex string when called with default helper", async () => {
    const result = await getAccentColor();
    if (isHelperAvailable()) {
      expect(result).toMatch(/^#[0-9a-f]{6}$/);
    } else {
      expect(result).toBeNull();
    }
  });

  test("returns null when helper path does not exist", async () => {
    const result = await getAccentColor("/nonexistent/helper");
    expect(result).toBeNull();
  });

  test("returns hex string from helper stdout", async () => {
    const helper = createMockHelper("accent-ok", 'printf "#e05415"');
    const result = await getAccentColor(helper);
    expect(result).toBe("#e05415");
  });

  test("returns null when helper exits non-zero", async () => {
    const helper = createMockHelper("accent-fail", "exit 1");
    const result = await getAccentColor(helper);
    expect(result).toBeNull();
  });

  test("returns null when helper outputs empty string", async () => {
    const helper = createMockHelper("accent-empty", 'printf ""');
    const result = await getAccentColor(helper);
    expect(result).toBeNull();
  });
});

describe("isHelperAvailable", () => {
  test("returns a boolean", () => {
    expect(typeof isHelperAvailable()).toBe("boolean");
  });
});
