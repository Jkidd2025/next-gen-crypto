import { useState, useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TokenInfo, PoolState } from '@/types/token-swap';
import { derivePoolAddress, getPoolState, getTickArrays } from '@/lib/swap/pool';
import { VALID_TICK_SPACINGS, VALID_FEE_TIERS } from '@/lib/swap/pool/constants';
import { useToast } from '@/hooks/use-toast';

interface PoolCache {
  [key: string]: {
    state: Omit<PoolState, 'loading' | 'error'>;
    timestamp: number;
    tickArrays: any[];
  }
}

export function usePoolManagement() {
  const { connection } = useConnection();
  const [poolCache] = useState<PoolCache>({});
  const [currentPool, setCurrentPool] = useState<PoolState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const findBestPool = useCallback(async (
    tokenA: TokenInfo,
    tokenB: TokenInfo,
  ) => {
    if (!tokenA || !tokenB) {
      console.log('Missing token information for pool discovery');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting pool discovery for', tokenA.symbol, 'and', tokenB.symbol);
      
      // Try different fee tiers to find the best pool
      for (const tickSpacing of VALID_TICK_SPACINGS) {
        for (const feeTier of VALID_FEE_TIERS) {
          console.log(`Checking pool with tick spacing ${tickSpacing} and fee tier ${feeTier}`);
          
          const poolAddress = await derivePoolAddress(
            new PublicKey(tokenA.mint),
            new PublicKey(tokenB.mint),
            tickSpacing,
            feeTier
          );

          // Check cache first
          const cacheKey = poolAddress.toBase58();
          const cached = poolCache[cacheKey];
          if (cached && Date.now() - cached.timestamp < 30000) {
            console.log('Found cached pool data');
            setCurrentPool({
              ...cached.state,
              loading: false,
              error: null
            });
            setLoading(false);
            return cached;
          }

          const poolState = await getPoolState(connection, poolAddress);
          if (poolState && poolState.liquidity.gtn(0)) {
            console.log('Found liquid pool:', poolAddress.toBase58());
            
            // Found a pool with liquidity
            const tickArrays = await getTickArrays(
              connection,
              poolAddress,
              poolState.currentTickIndex,
              tickSpacing
            );

            const poolData = {
              state: poolState,
              timestamp: Date.now(),
              tickArrays
            };

            poolCache[cacheKey] = poolData;
            setCurrentPool({
              ...poolState,
              loading: false,
              error: null
            });
            setLoading(false);
            return poolData;
          }
        }
      }

      throw new Error('No liquid pool found for token pair');
    } catch (err) {
      console.error('Pool discovery error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to find pool';
      setError(err instanceof Error ? err : new Error(errorMessage));
      setCurrentPool(null);
      
      toast({
        title: "Pool Discovery Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [connection, toast]);

  return {
    currentPool,
    loading,
    error,
    findBestPool
  };
}