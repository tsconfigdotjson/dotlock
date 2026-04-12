import { join } from "node:path";
import { getRepoRoot } from "./repoRoots";

/**
 * Resolve a repo-relative env file path to an absolute path on this machine.
 * Returns null if the repo has no local root mapping (i.e. it's unlinked).
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
  return join(root, relativePath);
}
