import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';

export const useSwapTransactions = () => {
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToast();
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number
  ) => {
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
    return await response.json();
  };

  const getSwapTransaction = async (quoteResponse: any) => {
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
      throw new Error('Failed to get swap transaction');
    }
    return await response.json();
  };

  const handleSwap = async (
    fromToken: string,
    toToken: string,
    fromAmount: string,
    toAmount: string,
    slippage: number,
    userId: string
  ) => {
    try {
      if (!publicKey || !signTransaction) {
        throw new Error('Wallet not connected');
      }

      // Get quote
      const quote = await getQuote(
        fromToken,
        toToken,
        parseFloat(fromAmount),
        Math.floor(slippage * 100)
      );

      if (!quote.data) {
        throw new Error('No route found for swap');
      }

      // Get swap transaction
      const swapResult = await getSwapTransaction(quote);
      
      // Deserialize and sign transaction
      const swapTransaction = Transaction.from(
        Buffer.from(swapResult.swapTransaction, 'base64')
      );
      
      const signedTransaction = await signTransaction(swapTransaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      // Store the transaction in Supabase
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
      console.error('Error executing swap:', error);
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "There was an error processing your swap",
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