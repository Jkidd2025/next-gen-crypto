import { Connection, PublicKey } from '@solana/web3.js';
import { getPoolState } from './state';
import { supabase } from "@/integrations/supabase/client";

export interface PoolHealthMetrics {
  liquidity: number;
  volume24h: number;
  fees24h: number;
  priceChange24h: number;
  tvl: number;
}

export class PoolMonitor {
  private metricsCache: Map<string, PoolHealthMetrics> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(
    private connection: Connection,
    private updateFrequency: number = 60000 // 1 minute
  ) {}

  async startMonitoring(poolAddress: PublicKey): Promise<void> {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    await this.updateMetrics(poolAddress);
    this.updateInterval = setInterval(
      () => this.updateMetrics(poolAddress),
      this.updateFrequency
    ) as unknown as NodeJS.Timeout;
  }

  async updateMetrics(poolAddress: PublicKey): Promise<void> {
    try {
      const pool = await getPoolState(this.connection, poolAddress);
      if (!pool) {
        console.warn(`Pool not found: ${poolAddress.toBase58()}`);
        return;
      }

      const metrics = await this.calculateMetrics(pool);
      this.metricsCache.set(poolAddress.toBase58(), metrics);

      // Store metrics in Supabase for historical tracking
      await this.persistMetrics(poolAddress.toBase58(), metrics);
    } catch (error) {
      console.error('Failed to update pool metrics:', error);
      throw error;
    }
  }

  private async calculateMetrics(pool: any): Promise<PoolHealthMetrics> {
    // Get 24h historical data from Supabase
    const { data: historicalData } = await supabase
      .from('swap_metrics')
      .select('*')
      .eq('from_token', pool.tokenA.toBase58())
      .eq('to_token', pool.tokenB.toBase58())
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });

    const volume24h = historicalData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
    const fees24h = volume24h * (pool.fee / 10000); // fee is in basis points

    return {
      liquidity: pool.liquidity.toNumber(),
      volume24h,
      fees24h,
      priceChange24h: this.calculatePriceChange(historicalData),
      tvl: this.calculateTVL(pool)
    };
  }

  private calculatePriceChange(historicalData: any[]): number {
    if (!historicalData?.length) return 0;
    
    const oldestPrice = historicalData[historicalData.length - 1].price_impact || 0;
    const newestPrice = historicalData[0].price_impact || 0;
    
    return ((newestPrice - oldestPrice) / oldestPrice) * 100;
  }

  private calculateTVL(pool: any): number {
    // Simplified TVL calculation
    return pool.liquidity.toNumber() * 2; // Multiply by 2 since it's a balanced pool
  }

  private async persistMetrics(poolAddress: string, metrics: PoolHealthMetrics): Promise<void> {
    try {
      await supabase.from('swap_metrics').insert({
        success: true,
        from_token: poolAddress,
        to_token: poolAddress,
        amount: metrics.volume24h,
        price_impact: metrics.priceChange24h
      });
    } catch (error) {
      console.error('Failed to persist metrics:', error);
    }
  }

  getMetrics(poolAddress: string): PoolHealthMetrics | null {
    return this.metricsCache.get(poolAddress) || null;
  }

  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}