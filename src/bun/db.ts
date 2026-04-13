import type { EnvFile, Repo, SyncStatus } from "../shared/types";

export class InMemoryDB {
  private repos = new Map<string, Repo>();

  /** Serialize all repos for vault persistence. */
  toJSON(): Repo[] {
    return Array.from(this.repos.values());
  }

  /** Clear and hydrate from a serialized repo array. */
  loadFromJSON(repos: Repo[]): void {
    this.repos.clear();
    for (const repo of repos) {
      this.repos.set(repo.name, repo);
    }
  }

  getAll(): Repo[] {
    return Array.from(this.repos.values());
  }

  get(name: string): Repo | null {
    return this.repos.get(name) ?? null;
  }

  add(repo: Repo): void {
    this.repos.set(repo.name, repo);
  }

  remove(name: string): boolean {
    return this.repos.delete(name);
  }

  /** Update sync status for a specific env file within a repo. */
  updateSyncStatus(
    repoName: string,
    relativePath: string,
    status: SyncStatus,
  ): void {
    const repo = this.repos.get(repoName);
    if (!repo) {
      return;
    }
    const file = repo.envFiles.find((f) => f.relativePath === relativePath);
    if (file) {
      file.syncStatus = status;
    }
  }

  /** Replace an env file's content (used by import). */
  updateEnvFile(repoName: string, updated: EnvFile): void {
    const repo = this.repos.get(repoName);
    if (!repo) {
      return;
    }
    const idx = repo.envFiles.findIndex(
      (f) => f.relativePath === updated.relativePath,
    );
    if (idx !== -1) {
      repo.envFiles[idx] = updated;
    }
  }

  /** Add a new env file to an existing repo. No-op if repo not found or file already exists. */
  addEnvFile(repoName: string, envFile: EnvFile): void {
    const repo = this.repos.get(repoName);
    if (!repo) {
      return;
    }
    if (repo.envFiles.some((f) => f.relativePath === envFile.relativePath)) {
      return;
    }
    repo.envFiles.push(envFile);
  }

  /** Get all relative paths for a repo's env files. */
  getWatchPaths(repoName: string): string[] {
    const repo = this.repos.get(repoName);
    if (!repo) {
      return [];
    }
    return repo.envFiles.map((f) => f.relativePath);
  }
}

// No singleton — VaultManager owns the InMemoryDB instance.
