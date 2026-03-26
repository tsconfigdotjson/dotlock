const [type] = Bun.argv.slice(2);
const APP_ID = process.env.VITE_INSTANTDB_APP_ID;

if (!type || !["schema", "perms"].includes(type)) {
  console.error("Usage: bun scripts/push-instant.ts <schema|perms>");
  process.exit(1);
}

if (!APP_ID) {
  console.error("Missing VITE_INSTANTDB_APP_ID env var");
  process.exit(1);
}

const args = ["bunx", "instant-cli", "push", type, "--app", APP_ID, "-y"];

if (process.env.INSTANTDB_ADMIN_TOKEN) {
  args.push("--token", process.env.INSTANTDB_ADMIN_TOKEN);
}

const proc = Bun.spawn(args, { stdio: ["inherit", "inherit", "inherit"] });
process.exit(await proc.exited);
