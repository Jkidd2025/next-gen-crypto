import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { SwapErrorTypes } from '@/types/errors';
import type { MarketInfo, Json } from '@/types/token';
import { getConnection } from '@/utils/swap/connection';
import { checkBalance } from '@/utils/swap/balanceChecker';
import { getQuote, getSwapTransaction } from '@/utils/swap/jupiterApi';

const MAX_RETRIES = 3;
const TRANSACTION_TIMEOUT = 60000; // 60 seconds

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

      const connection = await getConnection(primaryConnection);
      const hasBalance = await checkBalance(connection, publicKey, fromToken, parseFloat(fromAmount));
      
      if (!hasBalance) {
        throw new Error('Insufficient balance for swap');
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

      await simulateTransaction(connection, swapTransaction);
      
      const signedTransaction = await signTransaction(swapTransaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      const confirmation = await Promise.race([
        connection.confirmTransaction(signature),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Transaction timeout')), TRANSACTION_TIMEOUT))
      ]) as { value?: { err: any } };

      if (confirmation?.value?.err) {
        throw new Error('Transaction failed');
      }

      const swapRouteJson: Json = quote.data.marketInfos.map(info => ({
        amm: { label: info.amm.label },
        inputMint: info.inputMint,
        outputMint: info.outputMint
      }));

      const estimatedGasFee = await connection.getRecentBlockhash()
        .then(({ feeCalculator }) => feeCalculator.lamportsPerSignature / 1e9)
        .catch(() => 0.000005); // Fallback to default estimate

      await supabase.from("swap_transactions").insert({
        user_id: userId,
        from_token: fromToken,
        to_token: toToken,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: "completed",
        gas_fee: estimatedGasFee,
        swap_route: swapRouteJson,
        signature: signature,
        timestamp: new Date().toISOString()
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