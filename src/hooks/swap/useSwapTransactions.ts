import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { SwapErrorTypes } from '@/types/errors';
import { COMMON_TOKENS } from '@/constants/tokens';
import type { MarketInfo, Json } from '@/types/token';

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';

interface QuoteResponse {
  data: {
    outAmount: string;
    priceImpactPct: number;
    marketInfos: MarketInfo[];
  };
}

interface SwapResponse {
  swapTransaction: string;
}

export const useSwapTransactions = () => {
  const { connection: primaryConnection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToast();

  const simulateTransaction = async (connection: Connection, transaction: Transaction) => {
    const simulation = await connection.simulateTransaction(transaction);
    if (simulation.value.err) {
      throw new Error(`Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`);
    }
  };

  const handleSwap = async (
    fromToken: string,
    toToken: string,
    fromAmount: string,
    toAmount: string,
    slippage: number,
    userId: string
  ): Promise<string> => {
    try {
      if (!publicKey || !signTransaction) {
        throw new Error('Wallet not connected');
      }

      if (slippage < 0.1 || slippage > 50) {
        throw new Error('Invalid slippage value');
      }

      const quote = await getQuote(
        fromToken,
        toToken,
        parseFloat(fromAmount),
        Math.floor(slippage * 100)
      );

      if (quote.data.priceImpactPct >= 5) {
        throw new Error('Price impact too high');
      }

      const swapResult = await getSwapTransaction(quote, publicKey);
      const swapTransaction = Transaction.from(Buffer.from(swapResult.swapTransaction, 'base64'));

      await simulateTransaction(primaryConnection, swapTransaction);
      
      const signedTransaction = await signTransaction(swapTransaction);
      const signature = await primaryConnection.sendRawTransaction(signedTransaction.serialize());
      
      const confirmation = await Promise.race([
        primaryConnection.confirmTransaction(signature),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Transaction timeout')), 60000))
      ]) as { value?: { err: any } };

      if (confirmation?.value?.err) {
        throw new Error('Transaction failed');
      }

      const swapRouteJson: Json = quote.data.marketInfos.map(info => ({
        amm: { label: info.amm.label },
        inputMint: info.inputMint,
        outputMint: info.outputMint
      }));

      await supabase.from("swap_transactions").insert({
        user_id: userId,
        from_token: fromToken,
        to_token: toToken,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: "completed",
        gas_fee: 0,
        swap_route: swapRouteJson
      });

      return signature;
    } catch (error) {
      console.error('Swap failed:', error);
      throw error;
    }
  };

  return {
    handleSwap,
    gasFee: "0.000005" // Estimated gas fee in SOL
  };
};

async function getQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number
): Promise<QuoteResponse> {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: (amount * 1e9).toString(),
    slippageBps: slippageBps.toString(),
  });

  const response = await fetch(`${JUPITER_API_V6}/quote?${params}`);
  if (!response.ok) {
    throw new Error('Failed to get quote');
  }
  return response.json();
}

async function getSwapTransaction(
  quoteResponse: QuoteResponse,
  publicKey: PublicKey
): Promise<SwapResponse> {
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
    throw new Error('Failed to get swap transaction');
  }
  
  return response.json();
}
