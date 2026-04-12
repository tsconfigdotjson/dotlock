import { existsSync, type FSWatcher, watch } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import type { InMemoryDB } from "./db";
import { isEnvFilename } from "./scanner";

const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Watches parent directories (not individual files) for changes.
 *
 * On macOS, fs.watch on a *directory* uses FSEvents which survives atomic
 * saves (write-tmp + rename). Watching individual files uses kqueue, which
 * breaks when the inode changes — that's why the old approach failed after
 * the first import.
 *
 * The watcher receives an absolute rootPath per repo + a list of repo-relative
 * file paths. Internally it works with absolute paths (fs.watch needs them),
 * but translates back to relative paths for DB lookups.
 */
class FileWatcher {
  /** repo name → list of directory watchers */
  private dirWatchers = new Map<string, FSWatcher[]>();
  /** repo name → absolute root path on this machine */
  private repoRoots = new Map<string, string>();
  /** repo name → Set of tracked relative paths */
  private trackedFiles = new Map<string, Set<string>>();
  /** debounce timers keyed by absolutePath */
  private timers = new Map<string, Timer>();
  /** Called when a file's sync status changes */
  private onChange: ((repoName: string) => void) | null = null;
  /** Called when a new .env file appears in a watched directory */
  private onNewEnvFile:
    | ((repoName: string, relativePath: string) => Promise<boolean>)
    | null = null;
  /** Callback to get the current InMemoryDB (provided by VaultManager) */
  private getDB: (() => InMemoryDB) | null = null;
  private debounceMs = DEFAULT_DEBOUNCE_MS;

  setGetDB(fn: () => InMemoryDB): void {
    this.getDB = fn;
  }

  setOnChange(cb: (repoName: string) => void): void {
    this.onChange = cb;
  }

  setOnNewEnvFile(
    cb: ((repoName: string, relativePath: string) => Promise<boolean>) | null,
  ): void {
    this.onNewEnvFile = cb;
  }

  setDebounceMs(ms: number): void {
    this.debounceMs = ms;
  }

  private db(): InMemoryDB | null {
    if (!this.getDB) {
      return null;
    }
    try {
      return this.getDB();
    } catch {
      return null;
    }
  }

  watchRepo(repoName: string, rootPath: string, relativePaths: string[]): void {
    this.unwatchRepo(repoName);

    this.repoRoots.set(repoName, rootPath);
    const tracked = new Set(relativePaths);
    this.trackedFiles.set(repoName, tracked);

    // Group files by parent directory (absolute dirs for fs.watch)
    const dirToFiles = new Map<string, Set<string>>();
    for (const rp of relativePaths) {
      const absolute = join(rootPath, rp);
      const dir = dirname(absolute);
      if (!dirToFiles.has(dir)) {
        dirToFiles.set(dir, new Set());
      }
      dirToFiles.get(dir)?.add(basename(absolute));
    }

    const watchers: FSWatcher[] = [];

    for (const [dir, fileNames] of dirToFiles) {
      try {
        const fsw = watch(dir, (_event, changedFile) => {
          if (!changedFile) {
            return;
          }

          if (fileNames.has(changedFile)) {
            // Known tracked file changed — check for drift
            const absolutePath = join(dir, changedFile);
            this.scheduleCheck(repoName, absolutePath);
          } else if (isEnvFilename(changedFile)) {
            // New .env file appeared in a watched directory
            const absolutePath = join(dir, changedFile);
            this.scheduleNewFileCheck(
              repoName,
              absolutePath,
              fileNames,
              tracked,
            );
          }
        });

        fsw.on("error", () => {
          // Directory removed or inaccessible — will be caught by checkFile
        });

        watchers.push(fsw);
      } catch {
        // Directory doesn't exist — mark all its files as missing
        const currentDB = this.db();
        if (currentDB) {
          for (const name of fileNames) {
            const absolutePath = join(dir, name);
            const rp = relative(rootPath, absolutePath);
            currentDB.updateSyncStatus(repoName, rp, "missing");
          }
        }
      }
    }

    this.dirWatchers.set(repoName, watchers);

    // Verify all tracked files against disk immediately.
    // This catches changes made while the app was closed.
    for (const rp of relativePaths) {
      this.scheduleCheck(repoName, join(rootPath, rp));
    }
  }

  unwatchRepo(repoName: string): void {
    const watchers = this.dirWatchers.get(repoName);
    if (watchers) {
      for (const w of watchers) {
        w.close();
      }
      this.dirWatchers.delete(repoName);
    }

    // Clean up any pending timers for this repo's files
    const tracked = this.trackedFiles.get(repoName);
    const root = this.repoRoots.get(repoName);
    if (tracked && root) {
      for (const rp of tracked) {
        const absolutePath = join(root, rp);
        const timer = this.timers.get(absolutePath);
        if (timer) {
          clearTimeout(timer);
          this.timers.delete(absolutePath);
        }
      }
    }
    this.trackedFiles.delete(repoName);
    this.repoRoots.delete(repoName);
  }

  unwatchAll(): void {
    for (const repoName of this.dirWatchers.keys()) {
      this.unwatchRepo(repoName);
    }
  }

  private scheduleCheck(repoName: string, absolutePath: string): void {
    const existing = this.timers.get(absolutePath);
    if (existing) {
      clearTimeout(existing);
    }

    this.timers.set(
      absolutePath,
      setTimeout(() => {
        this.timers.delete(absolutePath);
        this.checkFile(repoName, absolutePath);
      }, this.debounceMs),
    );
  }

  /**
   * Debounced handler for a new .env file appearing in a watched directory.
   * If onNewEnvFile returns true (file was added to vault), the file is
   * promoted to the tracked set so future modifications go through normal
   * drift detection.
   */
  private scheduleNewFileCheck(
    repoName: string,
    absolutePath: string,
    dirFileNames: Set<string>,
    repoTracked: Set<string>,
  ): void {
    const existing = this.timers.get(absolutePath);
    if (existing) {
      clearTimeout(existing);
    }

    this.timers.set(
      absolutePath,
      setTimeout(async () => {
        this.timers.delete(absolutePath);

        // Repo was unwatched while timer was pending
        if (!this.dirWatchers.has(repoName)) {
          return;
        }

        const root = this.repoRoots.get(repoName);
        if (!root) {
          return;
        }
        const relativePath = relative(root, absolutePath);

        // File must exist and not already be tracked
        if (!existsSync(absolutePath) || repoTracked.has(relativePath)) {
          return;
        }

        if (this.onNewEnvFile) {
          const added = await this.onNewEnvFile(repoName, relativePath);
          if (added) {
            repoTracked.add(relativePath);
            dirFileNames.add(basename(absolutePath));
            this.notify(repoName);
          }
        }
      }, this.debounceMs),
    );
  }

  private async checkFile(
    repoName: string,
    absolutePath: string,
  ): Promise<void> {
    const currentDB = this.db();
    if (!currentDB) {
      return;
    }

    const repo = currentDB.get(repoName);
    if (!repo) {
      return;
    }

    const root = this.repoRoots.get(repoName);
    if (!root) {
      return;
    }
    const relativePath = relative(root, absolutePath);

    const envFile = repo.envFiles.find((f) => f.relativePath === relativePath);
    if (!envFile) {
      return;
    }

    const prevStatus = envFile.syncStatus;

    if (!existsSync(absolutePath)) {
      currentDB.updateSyncStatus(repoName, relativePath, "missing");
      if (prevStatus !== "missing") {
        this.notify(repoName);
      }
      return;
    }

    try {
      const diskContent = await readFile(absolutePath, "utf-8");
      const vaultNormalized = envFile.rawContent.trimEnd();
      const diskNormalized = diskContent.trimEnd();

      const newStatus =
        vaultNormalized !== diskNormalized ? "disk_changed" : "synced";

      currentDB.updateSyncStatus(repoName, relativePath, newStatus);
      if (newStatus !== prevStatus) {
        this.notify(repoName);
      }
    } catch {
      currentDB.updateSyncStatus(repoName, relativePath, "missing");
      if (prevStatus !== "missing") {
        this.notify(repoName);
      }
    }
  }

  private notify(repoName: string): void {
    if (this.onChange) {
      this.onChange(repoName);
    }
  }
}

export const fileWatcher = new FileWatcher();
