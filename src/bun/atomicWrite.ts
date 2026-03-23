import { renameSync } from "node:fs";

/** Write data to a file atomically via tmp + rename. */
export async function atomicWrite(
  path: string,
  data: Uint8Array | string,
): Promise<void> {
  const tmpPath = `${path}.tmp`;
  await Bun.write(tmpPath, data);
  renameSync(tmpPath, path);
}
