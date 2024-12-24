import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { COMMON_TOKENS } from '@/constants/tokens';
import { supabase } from "@/integrations/supabase/client";

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';

// RPC endpoints for fallback
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.g.alchemy.com/v2/your-api-key',
  'https://solana-mainnet.rpc.extrnode.com',
];

interface QuoteResponse {
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

interface SwapTransactionResponse {
  swapTransaction: string;
}

export const useSwapTransactions = () => {
  const { connection: primaryConnection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToast();

  // Get a connection with fallback support
  const getConnection = async (): Promise<Connection> => {
    try {
      await primaryConnection.getSlot();
      return primaryConnection;
    } catch (error) {
      for (const endpoint of RPC_ENDPOINTS) {
        try {
          const fallbackConnection = new Connection(endpoint);
          await fallbackConnection.getSlot();
          return fallbackConnection;
        } catch (error) {
          console.warn(`Failed to connect to ${endpoint}`, error);
          continue;
        }
      }
      throw new Error('All RPC endpoints failed');
    }
  };

  const checkBalance = async (connection: Connection, token: string, amount: number): Promise<boolean> => {
    if (!publicKey) throw new Error('Wallet not connected');

    try {
      if (token === COMMON_TOKENS.SOL.address) {
        const balance = await connection.getBalance(publicKey);
        return balance >= amount * 1e9;
      } else {
        const tokenBalance = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: new PublicKey(token) });
        if (tokenBalance.value.length === 0) return false;
        const balance = tokenBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        return balance >= amount;
      }
    } catch (error) {
      console.error('Error checking balance:', error);
      throw new Error('Failed to check balance');
    }
  };

  const getQuote = async (
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
      console.error('Quote fetch failed:', errorData);
      throw new Error('Failed to get quote');
    }
    return await response.json();
  };

  const getSwapTransaction = async (quoteResponse: QuoteResponse): Promise<SwapTransactionResponse> => {
    if (!publicKey) throw new Error('Wallet not connected');

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
      console.error('Swap transaction fetch failed:', errorData);
      throw new Error('Failed to get swap transaction');
    }
    
    return await response.json();
  };

  const simulateTransaction = async (connection: Connection, transaction: Transaction): Promise<void> => {
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

      // Validate slippage
      if (slippage < 0.1 || slippage > 50) {
        throw new Error('Invalid slippage value');
      }

      const connection = await getConnection();

      // Check balance
      const hasBalance = await checkBalance(connection, fromToken, parseFloat(fromAmount));
      if (!hasBalance) {
        throw new Error('Insufficient balance');
      }

      // Get quote with retries
      let quote: QuoteResponse;
      for (let i = 0; i < 3; i++) {
        try {
          quote = await getQuote(
            fromToken,
            toToken,
            parseFloat(fromAmount),
            Math.floor(slippage * 100)
          );
          break;
        } catch (error) {
          if (i === 2) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      }

      if (!quote?.data) {
        throw new Error('No route found for swap');
      }

      // Check price impact
      if (quote.data.priceImpactPct >= 5) {
        throw new Error('Price impact too high');
      }

      // Get swap transaction
      const swapResult = await getSwapTransaction(quote);
      
      // Deserialize transaction
      const swapTransaction = Transaction.from(
        Buffer.from(swapResult.swapTransaction, 'base64')
      );

      // Simulate transaction
      await simulateTransaction(connection, swapTransaction);
      
      // Sign and send transaction
      const signedTransaction = await signTransaction(swapTransaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation with timeout
      const confirmation = await Promise.race([
        connection.confirmTransaction(signature),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Transaction timeout')), 60000))
      ]) as { value?: { err: any } };

      if (confirmation?.value?.err) {
        throw new Error('Transaction failed');
      }

      // Store the transaction in the database
      await supabase.from("swap_transactions").insert({
        user_id: userId,
        from_token: fromToken,
        to_token: toToken,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: "completed",
        gas_fee: 0, // We'll update this later when we can calculate it
        swap_route: quote.data.marketInfos
      });

      toast({
        title: 'Swap successful',
        description: `Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      });

      return signature;
    } catch (error) {
      console.error('Swap failed:', error);
      toast({
        title: 'Swap failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    handleSwap,
  };
};