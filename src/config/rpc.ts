interface RPCEndpoint {
  url: string;
  apiKey?: string;
  weight: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

export const RPC_CONFIG = {
  ENDPOINTS: [
    {
      url: import.meta.env.VITE_PRIMARY_RPC_URL,
      apiKey: import.meta.env.VITE_PRIMARY_RPC_API_KEY,
      weight: 1,
    },
    {
      url: import.meta.env.VITE_BACKUP_RPC_URL,
      apiKey: import.meta.env.VITE_BACKUP_RPC_API_KEY,
      weight: 2,
    },
    {
      url: import.meta.env.VITE_FALLBACK_RPC_URL,
      apiKey: import.meta.env.VITE_FALLBACK_RPC_API_KEY,
      weight: 3,
    },
  ].filter(endpoint => endpoint.url) as RPCEndpoint[],

  RATE_LIMIT: {
    maxRequests: Number(import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS) || 100,
    windowMs: Number(import.meta.env.VITE_RATE_LIMIT_WINDOW_MS) || 60000,
    blockDurationMs: Number(import.meta.env.VITE_RATE_LIMIT_BLOCK_DURATION_MS) || 300000,
  } as RateLimitConfig,

  CONNECTION: {
    timeout: Number(import.meta.env.VITE_CONNECTION_TIMEOUT_MS) || 30000,
    maxRetries: Number(import.meta.env.VITE_MAX_RETRIES) || 3,
    retryDelay: Number(import.meta.env.VITE_RETRY_DELAY_MS) || 1000,
  },

  MONITORING: {
    enabled: import.meta.env.VITE_ENABLE_MONITORING === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
    metricsEndpoint: import.meta.env.VITE_METRICS_ENDPOINT,
  },

  getEndpointUrl: (endpoint: RPCEndpoint): string => {
    const url = new URL(endpoint.url);
    if (endpoint.apiKey) {
      url.searchParams.append('api-key', endpoint.apiKey);
    }
    return url.toString();
  },
};

// Rate limiting implementation
class RateLimiter {
  private requests: number[] = [];
  private isBlocked: boolean = false;
  private blockTimeout: NodeJS.Timeout | null = null;

  constructor(private config: RateLimitConfig) {}

  async checkLimit(): Promise<boolean> {
    if (this.isBlocked) {
      return false;
    }

    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.config.windowMs);

    if (this.requests.length >= this.config.maxRequests) {
      this.block();
      return false;
    }

    this.requests.push(now);
    return true;
  }

  private block(): void {
    this.isBlocked = true;
    if (this.blockTimeout) {
      clearTimeout(this.blockTimeout);
    }
    this.blockTimeout = setTimeout(() => {
      this.isBlocked = false;
      this.requests = [];
    }, this.config.blockDurationMs);
  }
}

export const rateLimiter = new RateLimiter(RPC_CONFIG.RATE_LIMIT);