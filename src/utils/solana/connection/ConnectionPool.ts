import { Connection, ConnectionConfig } from '@solana/web3.js';
import { logConnectionMetrics } from './metrics';

interface ConnectionPoolEntry {
  connection: Connection;
  lastUsed: number;
  health: boolean;
  endpoint: string;
}

export class ConnectionPool {
  private static pool: Map<string, ConnectionPoolEntry> = new Map();
  private static readonly POOL_SIZE = 3;
  private static readonly CONNECTION_TTL = 300000; // 5 minutes

  static async addConnection(
    endpoint: string, 
    connection: Connection, 
    latency: number | null
  ): Promise<void> {
    this.pool.set(endpoint, {
      connection,
      lastUsed: Date.now(),
      health: true,
      endpoint
    });

    await logConnectionMetrics(endpoint, latency, true);

    // Maintain pool size
    if (this.pool.size > this.POOL_SIZE) {
      const oldestEntry = Array.from(this.pool.entries())
        .sort(([, a], [, b]) => a.lastUsed - b.lastUsed)[0];
      if (oldestEntry) {
        this.pool.delete(oldestEntry[0]);
      }
    }
  }

  static getConnection(endpoint: string): ConnectionPoolEntry | undefined {
    const entry = this.pool.get(endpoint);
    if (entry) {
      entry.lastUsed = Date.now();
    }
    return entry;
  }

  static getAllConnections(): Map<string, ConnectionPoolEntry> {
    return this.pool;
  }

  static updateHealth(endpoint: string, isHealthy: boolean): void {
    const entry = this.pool.get(endpoint);
    if (entry) {
      entry.health = isHealthy;
    }
  }

  static cleanupStaleConnections(): void {
    const now = Date.now();
    for (const [endpoint, entry] of this.pool.entries()) {
      if ((now - entry.lastUsed) > this.CONNECTION_TTL) {
        this.pool.delete(endpoint);
      }
    }
  }

  static clear(): void {
    this.pool.clear();
  }
}