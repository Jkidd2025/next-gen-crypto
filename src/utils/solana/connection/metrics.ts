import { supabase } from "@/integrations/supabase/client";
import { logError } from '@/services/logging/logger';

export async function logConnectionMetrics(
  endpoint: string,
  latency: number | null,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  try {
    await supabase.from('rpc_connection_logs').insert({
      endpoint,
      latency,
      success,
      error_message: errorMessage,
    });
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Failed to log metrics'), {
      context: 'connection_metrics'
    });
  }
}