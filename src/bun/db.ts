import type { Repo } from "../shared/types";

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
      if (repo.path === path) return repo;
    }
    return null;
  }
}

export const db = new InMemoryDB();
