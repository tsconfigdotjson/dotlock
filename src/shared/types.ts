import type { RPCSchema } from "electrobun/bun";

export type KeyEntry = {
  name: string;
  value: string;
  provider?: string;
  addedAt?: string;
  lastRotated?: string;
};

export type EnvFile = {
  filename: string;
  keys: KeyEntry[];
};

export type Repo = {
  name: string;
  path: string;
  envFiles: EnvFile[];
};

export type DotlockRPC = {
  bun: RPCSchema<{
    requests: {
      selectFolder: { params: Record<string, never>; response: Repo | null };
      getRepos: { params: Record<string, never>; response: Repo[] };
      getRepo: { params: { name: string }; response: Repo | null };
      removeRepo: { params: { name: string }; response: boolean };
    };
  }>;
  webview: RPCSchema;
};
