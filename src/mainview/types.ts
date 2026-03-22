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
  envFiles: EnvFile[];
};

export type Theme = "light" | "dark" | "system";
