import { renameSync } from "node:fs";
import type { VaultData, VaultState } from "../shared/types";
import {
  type KDFParams,
  decrypt,
  deriveKey,
  encrypt,
  newKDFParams,
  parseVaultFile,
  serializeVaultFile,
} from "./crypto";
import { InMemoryDB } from "./db";

export class VaultManager {
  private state: VaultState = "no_vault";
  private vaultPath: string | null = null;
  private derivedKey: Uint8Array | null = null;
  private kdfParams: KDFParams | null = null;
  private db = new InMemoryDB();
  private saveLock: Promise<void> = Promise.resolve();

  getState(): VaultState {
    return this.state;
  }

  getVaultPath(): string | null {
    return this.vaultPath;
  }

  /** Returns the InMemoryDB. Throws if vault is not unlocked. */
  getDB(): InMemoryDB {
    if (this.state !== "unlocked") {
      throw new Error("Vault is not unlocked");
    }
    return this.db;
  }

  /** Create a new vault file at the given path and unlock it. */
  async createVault(path: string, password: string): Promise<void> {
    const kdfParams = newKDFParams();
    const key = deriveKey(password, kdfParams);

    const vaultData: VaultData = {
      version: 1,
      repos: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const plaintext = new TextEncoder().encode(JSON.stringify(vaultData));
    const { iv, authTag, ciphertext } = encrypt(plaintext, key);
    const fileData = serializeVaultFile(kdfParams, iv, authTag, ciphertext);

    // Atomic write: tmp → rename
    const tmpPath = `${path}.tmp`;
    await Bun.write(tmpPath, fileData);
    renameSync(tmpPath, path);

    this.vaultPath = path;
    this.derivedKey = key;
    this.kdfParams = kdfParams;
    this.db = new InMemoryDB();
    this.state = "unlocked";
  }

  /** Open and decrypt an existing vault file. */
  async openVault(path: string, password: string): Promise<void> {
    const file = Bun.file(path);
    const arrayBuf = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuf);
    const parsed = parseVaultFile(fileData);

    const key = deriveKey(password, parsed.kdfParams);

    // decrypt throws on wrong password (GCM auth tag mismatch)
    const plaintext = decrypt(
      parsed.ciphertext,
      key,
      parsed.iv,
      parsed.authTag,
    );

    const vaultData: VaultData = JSON.parse(
      new TextDecoder().decode(plaintext),
    );

    this.db = new InMemoryDB();
    this.db.loadFromJSON(vaultData.repos);
    this.vaultPath = path;
    this.derivedKey = key;
    this.kdfParams = parsed.kdfParams;
    this.state = "unlocked";
  }

  /** Re-encrypt and atomically write the vault to disk. Serializes concurrent calls. */
  async save(): Promise<void> {
    // Queue behind any in-flight save to prevent .tmp file races
    const prev = this.saveLock;
    let resolve: () => void;
    this.saveLock = new Promise<void>((r) => {
      resolve = r;
    });

    try {
      await prev;
      await this._doSave();
    } finally {
      resolve!();
    }
  }

  private async _doSave(): Promise<void> {
    if (
      this.state !== "unlocked" ||
      !this.vaultPath ||
      !this.derivedKey ||
      !this.kdfParams
    ) {
      throw new Error("Cannot save: vault is not unlocked");
    }

    const vaultData: VaultData = {
      version: 1,
      repos: this.db.toJSON(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const plaintext = new TextEncoder().encode(JSON.stringify(vaultData));
    const { iv, authTag, ciphertext } = encrypt(plaintext, this.derivedKey);
    const fileData = serializeVaultFile(
      this.kdfParams,
      iv,
      authTag,
      ciphertext,
    );

    const tmpPath = `${this.vaultPath}.tmp`;
    await Bun.write(tmpPath, fileData);
    renameSync(tmpPath, this.vaultPath);
  }

  /** Lock the vault: clear sensitive data from memory. */
  lock(): void {
    this.derivedKey = null;
    this.kdfParams = null;
    this.db = new InMemoryDB(); // fresh empty db
    if (this.vaultPath) {
      this.state = "locked";
    } else {
      this.state = "no_vault";
    }
  }
}
