import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { getConnection } from '@/utils/swap/connection';
import { checkBalance } from '@/utils/swap/balanceChecker';
import { getQuote, getSwapTransaction } from '@/utils/swap/jupiterApi';
import { useSwapErrors } from './useSwapErrors';
import type { SwapErrorTypes } from '@/types/errors';

export const useSwapTransactions = () => {
  const { connection: primaryConnection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToast();
  const { setError } = useSwapErrors();

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
        setError({ type: SwapErrorTypes.VALIDATION, message: 'Wallet not connected' });
        throw new Error('Wallet not connected');
      }

      if (slippage < 0.1 || slippage > 50) {
        setError({ type: SwapErrorTypes.VALIDATION, message: 'Invalid slippage value' });
        throw new Error('Invalid slippage value');
      }

      const connection = await getConnection(primaryConnection).catch(error => {
        setError({ type: SwapErrorTypes.NETWORK_ERROR, message: error.message });
        throw error;
      });

      const hasBalance = await checkBalance(
        connection,
        publicKey,
        fromToken,
        parseFloat(fromAmount)
      ).catch(error => {
        setError({ type: SwapErrorTypes.INSUFFICIENT_BALANCE, message: error.message });
        throw error;
      });

      if (!hasBalance) {
        setError({ type: SwapErrorTypes.INSUFFICIENT_BALANCE, message: 'Insufficient balance for swap' });
        throw new Error('Insufficient balance');
      }

      const quote = await getQuote(
        fromToken,
        toToken,
        parseFloat(fromAmount),
        Math.floor(slippage * 100)
      ).catch(error => {
        setError({ type: SwapErrorTypes.API_ERROR, message: error.message });
        throw error;
      });

      if (quote.data.priceImpactPct >= 5) {
        setError({ type: SwapErrorTypes.PRICE_IMPACT_HIGH, message: 'Price impact too high' });
        throw new Error('Price impact too high');
      }

      const swapResult = await getSwapTransaction(quote, publicKey).catch(error => {
        setError({ type: SwapErrorTypes.API_ERROR, message: error.message });
        throw error;
      });

      const swapTransaction = Transaction.from(Buffer.from(swapResult.swapTransaction, 'base64'));

      await simulateTransaction(connection, swapTransaction).catch(error => {
        setError({ type: SwapErrorTypes.SIMULATION_FAILED, message: error.message });
        throw error;
      });

      const signedTransaction = await signTransaction(swapTransaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      const confirmation = await Promise.race([
        connection.confirmTransaction(signature),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction timeout')), 60000)
        )
      ]) as { value?: { err: any } };

      if (confirmation?.value?.err) {
        setError({ type: SwapErrorTypes.UNKNOWN, message: 'Transaction failed' });
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
        swap_route: quote.data.marketInfos
      });

      toast({
        title: 'Swap successful',
        description: `Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      });

      return signature;
    } catch (error) {
      console.error('Swap failed:', error);
      throw error;
    }
  };

  return {
    handleSwap,
  };
};