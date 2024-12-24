import { Connection, PublicKey, Transaction, SimulateTransactionConfig } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { COMMON_TOKENS, TokenSymbol } from "@/constants/tokens";
import { SwapErrorTypes } from "@/types/errors";

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';

interface QuoteResponse {
  data: {
    routeMap: any;
    outAmount: string;
    otherAmountThreshold: string;
  };
}

interface SwapResponse {
  swapTransaction: string;
}

const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.g.alchemy.com/v2/your-api-key',
  'https://solana-mainnet.rpc.extrnode.com',
];

const API_RATE_LIMIT = 10;
let requestCount = 0;
let lastRequestTime = Date.now();

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useSwapTransactions = () => {
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToast();
  
  const getConnection = async (): Promise<Connection> => {
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        const connection = new Connection(endpoint);
        await connection.getSlot();
        return connection;
      } catch (error) {
        console.warn(`Failed to connect to ${endpoint}`, error);
        continue;
      }
    }
    throw new Error('All RPC endpoints failed');
  };

  const checkRateLimit = async () => {
    const now = Date.now();
    if (now - lastRequestTime >= 1000) {
      requestCount = 0;
      lastRequestTime = now;
    }
    
    if (requestCount >= API_RATE_LIMIT) {
      const waitTime = 1000 - (now - lastRequestTime);
      await wait(waitTime);
      requestCount = 0;
      lastRequestTime = Date.now();
    }
    
    requestCount++;
  };

  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number
  ): Promise<QuoteResponse> => {
    await checkRateLimit();

    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: (amount * 1e9).toString(),
      slippageBps: slippageBps.toString(),
    });

    const response = await fetch(`${JUPITER_API_V6}/quote?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to get quote: ${response.statusText}`);
    }
    return response.json();
  };

  const getSwapTransaction = async (quoteResponse: QuoteResponse): Promise<SwapResponse> => {
    await checkRateLimit();

    const response = await fetch(`${JUPITER_API_V6}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: publicKey?.toString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get swap transaction: ${response.statusText}`);
    }
    return response.json();
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

  const simulateTransaction = async (connection: Connection, transaction: Transaction): Promise<void> => {
    try {
      const simulation = await connection.simulateTransaction(transaction, {
        sigVerify: false,
        replaceRecentBlockhash: true,
      } as SimulateTransactionConfig);

      if (simulation.value.err) {
        throw new Error(`Transaction simulation failed: ${simulation.value.err.toString()}`);
      }

      const estimatedFee = simulation.value.unitsConsumed 
        ? (simulation.value.unitsConsumed * 5000) / 1e9 
        : 0;

      console.log('Estimated transaction fee:', estimatedFee, 'SOL');
    } catch (error) {
      console.error('Simulation error:', error);
      throw new Error('Transaction simulation failed');
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

      const connection = await getConnection();

      const hasBalance = await checkBalance(connection, fromToken, parseFloat(fromAmount));
      if (!hasBalance) {
        throw new Error('Insufficient balance');
      }

      if (slippage < 0.1 || slippage > 50) {
        throw new Error('Invalid slippage value');
      }

      let quote: QuoteResponse | undefined;
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
          await wait(1000 * Math.pow(2, i));
        }
      }

      if (!quote?.data) {
        throw new Error('No route found for swap');
      }

      const swapResult = await getSwapTransaction(quote);
      
      const swapTransaction = Transaction.from(
        Buffer.from(swapResult.swapTransaction, 'base64')
      );

      await simulateTransaction(connection, swapTransaction);
      
      const signedTransaction = await signTransaction(swapTransaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      const confirmation = await Promise.race([
        connection.confirmTransaction(signature, 'confirmed'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Transaction timeout')), 60000))
      ]);

      if (confirmation.value?.err) {
        throw new Error('Transaction failed');
      }

      await supabase.from("swap_transactions").insert({
        user_id: userId,
        from_token: fromToken,
        to_token: toToken,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: "completed",
        gas_fee: 0,
        swap_route: quote.data.routeMap
      });

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      });

      return signature;
    } catch (error) {
      console.error('Swap failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      toast({
        title: "Swap Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    handleSwap,
    gasFee: 0, // Jupiter handles fees dynamically
  };
};