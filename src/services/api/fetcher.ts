interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  backoff?: {
    initial: number;
    max: number;
    factor: number;
  };
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchWithFallback(
  endpoints: string[],
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeout = 5000,
    retries = 3,
    backoff = { initial: 1000, max: 10000, factor: 2 },
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let retry = 0; retry < retries; retry++) {
    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(endpoint, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new APIError(
            `HTTP error! status: ${response.status}`,
            response.status,
            endpoint
          );
        }

        return response;
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error);
        lastError = error as Error;
        
        const delay = Math.min(
          backoff.initial * Math.pow(backoff.factor, retry),
          backoff.max
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All endpoints failed');
}