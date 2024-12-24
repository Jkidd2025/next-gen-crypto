import { fetchWithFallback } from './fetcher';

export const JUPITER_ENDPOINTS = {
  QUOTE: [
    'https://quote-api.jup.ag/v6',
    'https://jupiter-quote.solanafm.com/v6'
  ],
  PRICE: [
    'https://price.jup.ag/v4',
    'https://jupiter-price.solanafm.com/v4'
  ]
};

export class JupiterAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'JupiterAPIError';
  }
}

export const getTokenPrice = async (tokenMint: string): Promise<number> => {
  try {
    const params = new URLSearchParams({
      ids: tokenMint
    });

    const response = await fetchWithFallback(
      JUPITER_ENDPOINTS.PRICE.map(endpoint => `${endpoint}/price?${params}`),
      {
        timeout: 5000,
        retries: 3,
        backoff: { initial: 1000, max: 10000, factor: 2 }
      }
    );

    const data = await response.json();
    
    if (!data.data?.[tokenMint]?.price) {
      throw new JupiterAPIError(
        'Price data not available',
        'PRICE_UNAVAILABLE',
        { tokenMint }
      );
    }

    return data.data[tokenMint].price;
  } catch (error) {
    if (error instanceof JupiterAPIError) {
      throw error;
    }
    
    throw new JupiterAPIError(
      'Failed to fetch token price',
      'PRICE_FETCH_ERROR',
      { tokenMint, error }
    );
  }
};

export const getSwapQuote = async (
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps: number
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount,
      slippageBps: slippageBps.toString()
    });

    const response = await fetchWithFallback(
      JUPITER_ENDPOINTS.QUOTE.map(endpoint => `${endpoint}/quote?${params}`),
      {
        timeout: 5000,
        retries: 3,
        backoff: { initial: 1000, max: 10000, factor: 2 }
      }
    );

    const data = await response.json();
    
    if (!data.data) {
      throw new JupiterAPIError(
        'Quote data not available',
        'QUOTE_UNAVAILABLE',
        { inputMint, outputMint, amount }
      );
    }

    return data.data;
  } catch (error) {
    if (error instanceof JupiterAPIError) {
      throw error;
    }
    
    throw new JupiterAPIError(
      'Failed to fetch swap quote',
      'QUOTE_FETCH_ERROR',
      { inputMint, outputMint, amount, error }
    );
  }
};

export const executeSwap = async (
  quoteResponse: any,
  userPublicKey: string
): Promise<any> => {
  try {
    const response = await fetchWithFallback(
      JUPITER_ENDPOINTS.QUOTE.map(endpoint => `${endpoint}/swap`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey,
          wrapUnwrapSOL: true
        }),
        timeout: 10000,
        retries: 2,
        backoff: { initial: 1000, max: 5000, factor: 2 }
      }
    );

    const data = await response.json();
    
    if (!data.swapTransaction) {
      throw new JupiterAPIError(
        'Swap transaction data not available',
        'SWAP_UNAVAILABLE',
        { quoteResponse, userPublicKey }
      );
    }

    return data;
  } catch (error) {
    if (error instanceof JupiterAPIError) {
      throw error;
    }
    
    throw new JupiterAPIError(
      'Failed to execute swap',
      'SWAP_EXECUTION_ERROR',
      { quoteResponse, userPublicKey, error }
    );
  }
};