import { Connection } from '@solana/web3.js';
import { ConnectionPool } from './ConnectionPool';
import { logConnectionMetrics } from './metrics';

export class HealthMonitor {
  private static healthCheckInterval: NodeJS.Timeout | null = null;
  private static readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

  static async initializeHealthCheck(): Promise<void> {
    if (!this.healthCheckInterval) {
      this.healthCheckInterval = setInterval(() => {
        this.runHealthChecks();
        ConnectionPool.cleanupStaleConnections();
      }, this.HEALTH_CHECK_INTERVAL);
    }
  }

  static async runHealthChecks(): Promise<void> {
    const connections = ConnectionPool.getAllConnections();
    for (const [endpoint, pool] of connections.entries()) {
      try {
        const startTime = Date.now();
        await pool.connection.getRecentBlockhash();
        const latency = Date.now() - startTime;
        
        ConnectionPool.updateHealth(endpoint, true);
        await logConnectionMetrics(endpoint, latency, true);
      } catch (error) {
        ConnectionPool.updateHealth(endpoint, false);
        await logConnectionMetrics(
          endpoint,
          null,
          false,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    }
  }

  static cleanup(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}