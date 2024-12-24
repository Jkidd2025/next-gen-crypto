import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface MonitoringThresholds {
  latency_ms: number;
  error_rate: number;
  price_change_alert: number;
}

export interface SwapSettings {
  max_slippage: number;
  default_deadline_minutes: number;
  min_amount: number;
}

export interface AppConfig {
  rpc_endpoints: string[];
  monitoring_thresholds: MonitoringThresholds;
  swap_settings: SwapSettings;
}

class ConfigService {
  private config: AppConfig | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getConfig(): Promise<AppConfig> {
    if (this.config && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      return this.config;
    }

    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('key, value');

      if (error) throw error;

      const configMap = data.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);

      this.config = {
        rpc_endpoints: configMap.rpc_endpoints || [],
        monitoring_thresholds: configMap.monitoring_thresholds || {
          latency_ms: 1000,
          error_rate: 0.05,
          price_change_alert: 0.2
        },
        swap_settings: configMap.swap_settings || {
          max_slippage: 0.01,
          default_deadline_minutes: 20,
          min_amount: 0.1
        }
      };

      this.lastFetch = Date.now();
      return this.config;
    } catch (error) {
      console.error('Error fetching config:', error);
      toast({
        title: "Configuration Error",
        description: "Failed to load application configuration. Using defaults.",
        variant: "destructive",
      });
      
      // Return default config
      return {
        rpc_endpoints: ["https://api.mainnet-beta.solana.com"],
        monitoring_thresholds: {
          latency_ms: 1000,
          error_rate: 0.05,
          price_change_alert: 0.2
        },
        swap_settings: {
          max_slippage: 0.01,
          default_deadline_minutes: 20,
          min_amount: 0.1
        }
      };
    }
  }

  async updateConfig(key: string, value: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('app_config')
        .update({ value })
        .eq('key', key);

      if (error) throw error;

      // Invalidate cache
      this.config = null;
      this.lastFetch = 0;

      toast({
        title: "Configuration Updated",
        description: `Successfully updated ${key} configuration.`,
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Update Failed",
        description: `Failed to update ${key} configuration.`,
        variant: "destructive",
      });
    }
  }
}

export const configService = new ConfigService();