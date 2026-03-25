import { init } from "@instantdb/react";

const APP_ID = import.meta.env.VITE_INSTANTDB_APP_ID;

if (!APP_ID) {
  throw new Error("Missing VITE_INSTANTDB_APP_ID in your .env file");
}

export const db = init({ appId: APP_ID });
