import { init } from "@instantdb/admin";
import schema from "../../../instant.schema";

export function getAdminDb(env: Env) {
  const APP_ID = env.VITE_INSTANTDB_APP_ID;
  const ADMIN_TOKEN = env.INSTANTDB_ADMIN_TOKEN;

  if (!APP_ID) {
    throw new Error("Missing VITE_INSTANTDB_APP_ID");
  }

  return init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
    schema,
  });
}
