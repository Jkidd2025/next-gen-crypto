import { PublicKey } from '@solana/web3.js';

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';

export interface QuoteResponse {
  data: {
    outAmount: string;
    priceImpactPct: number;
    marketInfos: {
      amm: {
        label: string;
      };
      inputMint: string;
      outputMint: string;
    }[];
  };
}

export interface SwapResponse {
  swapTransaction: string;
}

export const getQuote = async (
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number
): Promise<QuoteResponse> => {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: (amount * 1e9).toString(),
    slippageBps: slippageBps.toString(),
  });

  const response = await fetch(`${JUPITER_API_V6}/quote?${params}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to get quote: ${JSON.stringify(errorData)}`);
  }
  return response.json();
};

export const getSwapTransaction = async (
  quoteResponse: QuoteResponse,
  publicKey: PublicKey
): Promise<SwapResponse> => {
  const response = await fetch(`${JUPITER_API_V6}/swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: publicKey.toString(),
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to get swap transaction: ${JSON.stringify(errorData)}`);
  }
  
  return response.json();
};