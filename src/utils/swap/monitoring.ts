import { Connection } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import { configService } from '@/services/config/appConfig';

export interface SwapMetrics {
  success: boolean;
  fromToken: string;
  toToken: string;
  amount: number;
  priceImpact: number | null;
  duration: number | null;
  error?: string;
}

export const checkRPCHealth = async (connection: Connection): Promise<boolean> => {
  const config = await configService.getConfig();
  const start = Date.now();
  
  try {
    await connection.getSlot();
    const latency = Date.now() - start;
    
    await supabase.from('rpc_health_metrics').insert([{
      endpoint: connection.rpcEndpoint,
      latency,
      status: 'healthy',
      timestamp: new Date().toISOString()
    }]);
    
    return latency < config.monitoring_thresholds.latency_ms;
  } catch (error) {
    await supabase.from('rpc_health_metrics').insert([{
      endpoint: connection.rpcEndpoint,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }]);
    
    return false;
  }
};

export const logSwapMetrics = async (metrics: SwapMetrics): Promise<void> => {
  await supabase.from('swap_metrics').insert([{
    success: metrics.success,
    from_token: metrics.fromToken,
    to_token: metrics.toToken,
    amount: metrics.amount,
    price_impact: metrics.priceImpact,
    duration: metrics.duration,
    error: metrics.error,
    timestamp: new Date().toISOString()
  }]);
};