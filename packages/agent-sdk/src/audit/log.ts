/**
 * HashChainedAuditLog — append-only log where each entry's hash includes
 * the previous entry's hash. Tampering with any past entry breaks the
 * chain at that point and every entry after it.
 *
 * Format: JSON Lines (one entry per line). Each line is:
 *   { "seq": N, "ts": "...", "prevHash": "...", "hash": "...", "data": {...} }
 *
 * Genesis entry has prevHash = "0".repeat(64).
 *
 * Storage adapters: file (Node only, default) or in-memory (for tests).
 * Verify with verify() — walks from genesis, recomputes every hash.
 */

import { createHash } from "node:crypto";

export interface AuditEntry {
  seq: number;
  ts: string;
  prevHash: string;
  hash: string;
  data: unknown;
}

export interface AuditStorage {
  read(): Promise<string>;
  append(line: string): Promise<void>;
}

export class InMemoryStorage implements AuditStorage {
  private buf = "";
  async read(): Promise<string> {
    return this.buf;
  }
  async append(line: string): Promise<void> {
    this.buf += line + "\n";
  }
  /** Test helper — corrupts an existing entry to verify detection works. */
  tamper(replacer: (existing: string) => string): void {
    this.buf = replacer(this.buf);
  }
}

export class FileStorage implements AuditStorage {
  constructor(private path: string) {}
  async read(): Promise<string> {
    const { readFile } = await import("node:fs/promises");
    try {
      return await readFile(this.path, "utf8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return "";
      throw err;
    }
  }
  async append(line: string): Promise<void> {
    const { appendFile, mkdir } = await import("node:fs/promises");
    const { dirname } = await import("node:path");
    await mkdir(dirname(this.path), { recursive: true });
    await appendFile(this.path, line + "\n", { mode: 0o600 });
  }
}

export interface AuditLogOptions {
  storage?: AuditStorage;
  /** File path; ignored if storage is provided. */
  path?: string;
}

const GENESIS = "0".repeat(64);

export class HashChainedAuditLog {
  private storage: AuditStorage;
  private nextSeq = 0;
  private lastHash = GENESIS;
  private bootstrapped = false;

  constructor(opts: AuditLogOptions = {}) {
    if (opts.storage) {
      this.storage = opts.storage;
    } else if (opts.path) {
      this.storage = new FileStorage(opts.path);
    } else {
      this.storage = new InMemoryStorage();
    }
  }

  /** Append a new entry, returning the resulting entry. Thread-safe per instance. */
  async append(data: unknown): Promise<AuditEntry> {
    await this.bootstrap();
    const seq = this.nextSeq;
    const ts = new Date().toISOString();
    const prevHash = this.lastHash;
    const hash = hashEntry({ seq, ts, prevHash, data });
    const entry: AuditEntry = { seq, ts, prevHash, hash, data };
    await this.storage.append(JSON.stringify(entry));
    this.nextSeq = seq + 1;
    this.lastHash = hash;
    return entry;
  }

  /**
   * Walk every entry from genesis and recompute hashes. Returns:
   *   { ok: true, count }  on success
   *   { ok: false, brokenAtSeq, expected, found } on first breakage
   */
  async verify(): Promise<VerifyResult> {
    const text = await this.storage.read();
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    let prevHash = GENESIS;
    let expectedSeq = 0;
    for (const line of lines) {
      let entry: AuditEntry;
      try {
        entry = JSON.parse(line);
      } catch {
        return { ok: false, brokenAtSeq: expectedSeq, reason: "invalid JSON" };
      }
      if (entry.seq !== expectedSeq) {
        return { ok: false, brokenAtSeq: expectedSeq, reason: `seq mismatch (got ${entry.seq})` };
      }
      if (entry.prevHash !== prevHash) {
        return {
          ok: false,
          brokenAtSeq: entry.seq,
          reason: "prevHash mismatch",
          expected: prevHash,
          found: entry.prevHash,
        };
      }
      const recomputed = hashEntry({
        seq: entry.seq,
        ts: entry.ts,
        prevHash: entry.prevHash,
        data: entry.data,
      });
      if (recomputed !== entry.hash) {
        return {
          ok: false,
          brokenAtSeq: entry.seq,
          reason: "hash mismatch (entry was modified)",
          expected: recomputed,
          found: entry.hash,
        };
      }
      prevHash = entry.hash;
      expectedSeq += 1;
    }
    return { ok: true, count: expectedSeq };
  }

  /** Read everything as parsed entries. Convenience for callers that need to display the log. */
  async entries(): Promise<AuditEntry[]> {
    const text = await this.storage.read();
    return text
      .split("\n")
      .filter((l) => l.trim().length > 0)
      .map((l) => JSON.parse(l) as AuditEntry);
  }

  private async bootstrap(): Promise<void> {
    if (this.bootstrapped) return;
    const text = await this.storage.read();
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length > 0) {
      const last = JSON.parse(lines[lines.length - 1]) as AuditEntry;
      this.nextSeq = last.seq + 1;
      this.lastHash = last.hash;
    }
    this.bootstrapped = true;
  }
}

export type VerifyResult =
  | { ok: true; count: number }
  | {
      ok: false;
      brokenAtSeq: number;
      reason: string;
      expected?: string;
      found?: string;
    };

function hashEntry(input: { seq: number; ts: string; prevHash: string; data: unknown }): string {
  const canonical = JSON.stringify({
    seq: input.seq,
    ts: input.ts,
    prevHash: input.prevHash,
    data: input.data,
  });
  return createHash("sha256").update(canonical).digest("hex");
}
