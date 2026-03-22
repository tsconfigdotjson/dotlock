import type { EnvFile, Repo, SyncStatus } from "../shared/types";

class InMemoryDB {
  private repos = new Map<string, Repo>();

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

  findByPath(path: string): Repo | null {
    for (const repo of this.repos.values()) {
      if (repo.path === path) {
        return repo;
      }
    }
    return null;
  }

  /** Update sync status for a specific env file within a repo. */
  updateSyncStatus(
    repoName: string,
    absolutePath: string,
    status: SyncStatus,
  ): void {
    const repo = this.repos.get(repoName);
    if (!repo) {
      return;
    }
    const file = repo.envFiles.find((f) => f.absolutePath === absolutePath);
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
      (f) => f.absolutePath === updated.absolutePath,
    );
    if (idx !== -1) {
      repo.envFiles[idx] = updated;
    }
  }

  /** Get all absolute paths for a repo's env files. */
  getWatchPaths(repoName: string): string[] {
    const repo = this.repos.get(repoName);
    if (!repo) {
      return [];
    }
    return repo.envFiles.map((f) => f.absolutePath);
  }
}

export const db = new InMemoryDB();
