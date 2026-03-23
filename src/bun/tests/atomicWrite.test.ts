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
import { atomicWrite } from "../atomicWrite";

const TEST_DIR = join(tmpdir(), `dotlock-atomic-tests-${Date.now()}`);
let counter = 0;

function testPath(): string {
  counter++;
  return join(TEST_DIR, `test-file-${counter}`);
}

beforeEach(() => {
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true });
  }
});

afterEach(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
});

describe("atomicWrite", () => {
  test("writes string data to file", async () => {
    const path = testPath();
    await atomicWrite(path, "hello world");
    expect(readFileSync(path, "utf-8")).toBe("hello world");
  });

  test("writes Uint8Array data to file", async () => {
    const path = testPath();
    const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
    await atomicWrite(path, data);
    expect(readFileSync(path, "utf-8")).toBe("Hello");
  });

  test("no .tmp file remains after write", async () => {
    const path = testPath();
    await atomicWrite(path, "data");
    expect(existsSync(`${path}.tmp`)).toBe(false);
  });

  test("overwrites existing file", async () => {
    const path = testPath();
    writeFileSync(path, "old content");
    await atomicWrite(path, "new content");
    expect(readFileSync(path, "utf-8")).toBe("new content");
  });

  test("creates file in existing directory", async () => {
    const path = testPath();
    expect(existsSync(path)).toBe(false);
    await atomicWrite(path, "created");
    expect(existsSync(path)).toBe(true);
  });

  test("writes empty string", async () => {
    const path = testPath();
    await atomicWrite(path, "");
    expect(readFileSync(path, "utf-8")).toBe("");
  });

  test("writes empty Uint8Array", async () => {
    const path = testPath();
    await atomicWrite(path, new Uint8Array(0));
    expect(readFileSync(path, "utf-8")).toBe("");
  });

  test("handles large data", async () => {
    const path = testPath();
    const large = "x".repeat(1_000_000); // 1MB
    await atomicWrite(path, large);
    expect(readFileSync(path, "utf-8").length).toBe(1_000_000);
  });
});
