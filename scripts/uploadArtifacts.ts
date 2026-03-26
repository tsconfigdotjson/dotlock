import { readdir } from "node:fs/promises";
import { join } from "node:path";

const ARTIFACTS_DIR = join(import.meta.dir, "..", "artifacts");

const required = [
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_ENDPOINT",
  "R2_BUCKET",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const client = new Bun.S3Client({
  accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  endpoint: process.env.R2_ENDPOINT as string,
  region: "auto",
  bucket: process.env.R2_BUCKET as string,
});

const files = await readdir(ARTIFACTS_DIR);

for (const filename of files) {
  const filePath = join(ARTIFACTS_DIR, filename);
  const file = Bun.file(filePath);
  await client.file(filename).write(file);
  console.log(`Uploaded: ${filename}`);
}

console.log(`Done. Uploaded ${files.length} artifacts.`);
