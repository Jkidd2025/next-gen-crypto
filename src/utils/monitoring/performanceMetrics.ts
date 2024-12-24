import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/services/logging/logger";

interface PerformanceMetric {
  endpoint: string;
  latency: number;
  success: boolean;
  errorMessage?: string;
  errorType?: string;
}

export const trackPerformanceMetric = async (metric: PerformanceMetric) => {
  try {
    await supabase.from('performance_metrics').insert([{
      endpoint: metric.endpoint,
      latency: metric.latency,
      success: metric.success,
      error_message: metric.errorMessage,
      error_type: metric.errorType,
    }]);
  } catch (error) {
    logError(error as Error, { context: 'trackPerformanceMetric', metric });
  }
};

export const measureEndpointPerformance = async <T>(
  endpoint: string,
  operation: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await operation();
    const latency = Math.round(performance.now() - startTime);
    
    await trackPerformanceMetric({
      endpoint,
      latency,
      success: true,
    });
    
    return result;
  } catch (error) {
    const latency = Math.round(performance.now() - startTime);
    
    await trackPerformanceMetric({
      endpoint,
      latency,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
    });
    
    throw error;
  }
};