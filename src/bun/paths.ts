import { isAbsolute, join, relative, resolve } from "node:path";
import { getRepoRoot } from "./repoRoots";

/**
 * Resolve a repo-relative env file path to an absolute path on this machine.
 * Returns null if the repo has no local root mapping (i.e. it's unlinked),
 * or if the relativePath would escape the root (e.g. "../../etc/passwd").
 */
export async function resolveEnvFilePath(
  vaultPath: string,
  repoName: string,
  relativePath: string,
): Promise<string | null> {
  const root = await getRepoRoot(vaultPath, repoName);
  if (!root) {
    return null;
  }
  if (isAbsolute(relativePath)) {
    return null;
  }
  const absolute = resolve(root, relativePath);
  const rel = relative(root, absolute);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    return null;
  }
  return join(root, relativePath);
}
