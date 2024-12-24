import { supabase } from '@/integrations/supabase/client';
import { logError } from '../logging/logger';
import { captureException } from '../monitoring/sentry';

export interface Alert {
  type: 'error' | 'warning' | 'info';
  message: string;
  metadata?: Record<string, any>;
}

export const sendAlert = async (alert: Alert) => {
  try {
    // Log to our monitoring system
    if (alert.type === 'error') {
      captureException(new Error(alert.message), alert.metadata);
    }

    // Log to our logging system
    logError(new Error(alert.message), alert.metadata);

    // Store in Supabase for historical tracking
    const { error } = await supabase
      .from('system_alerts')
      .insert({
        type: alert.type,
        message: alert.message,
        metadata: alert.metadata,
        created_at: new Date().toISOString()
      });

    if (error) throw error;

  } catch (error) {
    console.error('Failed to send alert:', error);
    captureException(error as Error);
  }
};

export const checkSystemHealth = async () => {
  try {
    // Check RPC endpoint health
    const { data: healthMetrics } = await supabase
      .from('rpc_health_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1);

    if (healthMetrics?.[0]?.status === 'failed') {
      await sendAlert({
        type: 'error',
        message: 'RPC endpoint health check failed',
        metadata: healthMetrics[0]
      });
    }

    // Check for extreme market conditions
    const { data: priceData } = await supabase
      .from('price_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (priceData?.[0]?.price_change_24h && Math.abs(priceData[0].price_change_24h) > 20) {
      await sendAlert({
        type: 'warning',
        message: 'Extreme market movement detected',
        metadata: priceData[0]
      });
    }

  } catch (error) {
    console.error('Health check failed:', error);
    captureException(error as Error);
  }
};