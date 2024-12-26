import { useCallback } from 'react';
import { PoolState, PoolQuote, TokenInfo } from '@/types/token-swap';
import { calculateQuote } from '@/lib/swap/pool/quote';
import { useToast } from '@/hooks/use-toast';
import { useConnection } from '@solana/wallet-adapter-react';

export function usePoolQuote() {
  const { toast } = useToast();
  const { connection } = useConnection();

  const calculatePoolQuote = useCallback(async (
    pool: PoolState,
    amountIn: string,
    tokenIn: TokenInfo,
    tokenOut: TokenInfo,
    slippage: number
  ): Promise<PoolQuote | null> => {
    try {
      if (!pool || !amountIn || !tokenIn || !tokenOut) {
        console.log('Missing required parameters for quote calculation');
        return null;
      }

      const quote = await calculateQuote(
        pool,
        amountIn,
        tokenIn.decimals,
        tokenOut.decimals,
        slippage,
        connection
      );

      return {
        metrics: {
          priceImpact: quote.priceImpact,
          expectedOutput: quote.expectedOutput,
          minimumReceived: quote.minimumOutput,
          fee: {
            amount: quote.fee,
            percentage: pool.fee
          }
        },
        route: {
          poolAddress: pool.address.toBase58(),
          tokenIn,
          tokenOut,
          tickArrays: quote.tickArrays
        }
      };
    } catch (error) {
      console.error('Error calculating pool quote:', error);
      toast({
        title: "Quote Calculation Error",
        description: error instanceof Error ? error.message : "Failed to calculate quote",
        variant: "destructive"
      });
      return null;
    }
  }, [connection, toast]);

  return { calculatePoolQuote };
}