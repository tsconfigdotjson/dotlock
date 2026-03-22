import { existsSync, type FSWatcher, watch } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { db } from "./db";

const DEBOUNCE_MS = 300;

/**
 * Watches parent directories (not individual files) for changes.
 *
 * On macOS, fs.watch on a *directory* uses FSEvents which survives atomic
 * saves (write-tmp + rename). Watching individual files uses kqueue, which
 * breaks when the inode changes — that's why the old approach failed after
 * the first import.
 */
class FileWatcher {
  /** repo name → list of directory watchers */
  private dirWatchers = new Map<string, FSWatcher[]>();
  /** Set of absolute paths we care about, per repo */
  private trackedFiles = new Map<string, Set<string>>();
  /** debounce timers keyed by absolutePath */
  private timers = new Map<string, Timer>();
  /** Called when a file's sync status changes */
  private onChange: ((repoName: string) => void) | null = null;

  setOnChange(cb: (repoName: string) => void): void {
    this.onChange = cb;
  }

  watchRepo(repoName: string, filePaths: string[]): void {
    this.unwatchRepo(repoName);

    const tracked = new Set(filePaths);
    this.trackedFiles.set(repoName, tracked);

    // Group files by parent directory
    const dirToFiles = new Map<string, Set<string>>();
    for (const fp of filePaths) {
      const dir = dirname(fp);
      if (!dirToFiles.has(dir)) {
        dirToFiles.set(dir, new Set());
      }
      dirToFiles.get(dir)?.add(basename(fp));
    }

    const watchers: FSWatcher[] = [];

    for (const [dir, fileNames] of dirToFiles) {
      try {
        const fsw = watch(dir, (_event, changedFile) => {
          // changedFile is the basename of whatever changed in this directory
          if (changedFile && fileNames.has(changedFile)) {
            const absolutePath = join(dir, changedFile);
            this.scheduleCheck(repoName, absolutePath);
          }
        });

        fsw.on("error", () => {
          // Directory removed or inaccessible — will be caught by checkFile
        });

        watchers.push(fsw);
      } catch {
        // Directory doesn't exist — mark all its files as missing
        for (const name of fileNames) {
          db.updateSyncStatus(repoName, join(dir, name), "missing");
        }
      }
    }

    this.dirWatchers.set(repoName, watchers);
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
    if (tracked) {
      for (const fp of tracked) {
        const timer = this.timers.get(fp);
        if (timer) {
          clearTimeout(timer);
          this.timers.delete(fp);
        }
      }
      this.trackedFiles.delete(repoName);
    }
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
      }, DEBOUNCE_MS),
    );
  }

  private async checkFile(
    repoName: string,
    absolutePath: string,
  ): Promise<void> {
    const repo = db.get(repoName);
    if (!repo) {
      return;
    }

    const envFile = repo.envFiles.find((f) => f.absolutePath === absolutePath);
    if (!envFile) {
      return;
    }

    const prevStatus = envFile.syncStatus;

    if (!existsSync(absolutePath)) {
      db.updateSyncStatus(repoName, absolutePath, "missing");
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

      db.updateSyncStatus(repoName, absolutePath, newStatus);
      if (newStatus !== prevStatus) {
        this.notify(repoName);
      }
    } catch {
      db.updateSyncStatus(repoName, absolutePath, "missing");
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
