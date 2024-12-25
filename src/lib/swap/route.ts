import { TokenInfo, RouteStep, SwapQuote, PoolInfo } from '@/types/token-swap';
import { getPoolInfo } from './pools';
import { calculateQuote } from './price';
import { calculateMinimumReceived } from './price';
import Decimal from 'decimal.js';
import { MINIMUM_LIQUIDITY, MAX_HOPS } from './constants';

interface RouteNode {
  token: TokenInfo;
  visited: boolean;
  previousToken: TokenInfo | null;
  totalOutput: Decimal;
  path: TokenInfo[];
}

export const findBestRoute = async (
  tokenIn: TokenInfo,
  tokenOut: TokenInfo,
  amountIn: string,
  maxHops: number = MAX_HOPS
): Promise<RouteStep[]> => {
  try {
    // Direct pool check first
    const directPool = await getPoolInfo(tokenIn, tokenOut);
    if (directPool && hasEnoughLiquidity(directPool, amountIn)) {
      return [
        { symbol: tokenIn.symbol, mint: tokenIn.mint },
        { symbol: tokenOut.symbol, mint: tokenOut.mint }
      ];
    }

    // Initialize route finding
    const routes = await findAllRoutes(tokenIn, tokenOut, amountIn, maxHops);
    
    // Find best route by simulating swaps
    let bestRoute: RouteStep[] | null = null;
    let bestOutput = new Decimal(0);

    for (const route of routes) {
      try {
        const simulatedOutput = await simulateRouteOutput(route, amountIn);
        if (simulatedOutput.gt(bestOutput)) {
          bestOutput = simulatedOutput;
          bestRoute = route.map(token => ({
            symbol: token.symbol,
            mint: token.mint
          }));
        }
      } catch (error) {
        console.warn("Error simulating route:", error);
        continue;
      }
    }

    if (!bestRoute) {
      throw new Error("No valid route found");
    }

    return bestRoute;
  } catch (error) {
    console.error("Error finding best route:", error);
    throw error;
  }
};

const findAllRoutes = async (
  tokenIn: TokenInfo,
  tokenOut: TokenInfo,
  amountIn: string,
  maxHops: number
): Promise<TokenInfo[][]> => {
  const routes: TokenInfo[][] = [];
  const visited = new Set<string>();
  
  const findRoutes = async (
    currentToken: TokenInfo,
    currentPath: TokenInfo[],
    remainingHops: number
  ) => {
    if (remainingHops < 0) return;
    
    visited.add(currentToken.mint);
    currentPath.push(currentToken);

    if (currentToken.mint === tokenOut.mint && currentPath.length > 1) {
      routes.push([...currentPath]);
    } else if (remainingHops > 0) {
      const pools = await getConnectedPools(currentToken);
      for (const pool of pools) {
        const nextToken = pool.tokenA.mint === currentToken.mint ? pool.tokenB : pool.tokenA;
        if (!visited.has(nextToken.mint)) {
          await findRoutes(nextToken, [...currentPath], remainingHops - 1);
        }
      }
    }

    visited.delete(currentToken.mint);
  };

  await findRoutes(tokenIn, [], maxHops);
  return routes;
};

const simulateRouteOutput = async (
  route: TokenInfo[],
  amountIn: string
): Promise<Decimal> => {
  let currentAmount = new Decimal(amountIn);

  for (let i = 0; i < route.length - 1; i++) {
    const tokenIn = route[i];
    const tokenOut = route[i + 1];
    
    const quote = await calculateQuote(
      currentAmount.toString(),
      tokenIn,
      tokenOut,
      0.5 // Default slippage for simulation
    );
    
    currentAmount = new Decimal(quote.outAmount);
  }

  return currentAmount;
};

const hasEnoughLiquidity = (pool: PoolInfo, amountIn: string): boolean => {
  const reserveIn = new Decimal(pool.tokenAReserves);
  const amountInDecimal = new Decimal(amountIn);
  return reserveIn.gte(amountInDecimal.mul(MINIMUM_LIQUIDITY));
};

const getConnectedPools = async (token: TokenInfo): Promise<PoolInfo[]> => {
  try {
    // This is a mock implementation. In a real DEX, you would:
    // 1. Query the DEX contract for all pools containing this token
    // 2. Filter pools with sufficient liquidity
    // 3. Return the valid pools
    const connectedTokens = await getConnectedTokens(token);
    const pools: PoolInfo[] = [];
    
    for (const connectedToken of connectedTokens) {
      const pool = await getPoolInfo(token, connectedToken);
      if (pool) {
        pools.push(pool);
      }
    }
    
    return pools;
  } catch (error) {
    console.error("Error getting connected pools:", error);
    return [];
  }
};

// Mock function to get connected tokens
const getConnectedTokens = async (token: TokenInfo): Promise<TokenInfo[]> => {
  // This would be replaced with actual DEX contract calls
  return [];
};

export const estimateRoute = async (
  route: RouteStep[],
  amountIn: string,
  slippage: number = 0.5
): Promise<SwapQuote | null> => {
  try {
    if (route.length < 2) return null;

    let currentAmount = amountIn;
    let totalPriceImpact = new Decimal(0);
    let totalFee = new Decimal(0);
    
    // Simulate the entire route
    for (let i = 0; i < route.length - 1; i++) {
      const tokenIn: TokenInfo = { mint: route[i].mint, symbol: route[i].symbol } as TokenInfo;
      const tokenOut: TokenInfo = { mint: route[i + 1].mint, symbol: route[i + 1].symbol } as TokenInfo;
      
      const quote = await calculateQuote(currentAmount, tokenIn, tokenOut, slippage);
      
      currentAmount = quote.outAmount;
      totalPriceImpact = totalPriceImpact.add(quote.priceImpact);
      totalFee = totalFee.add(quote.fee);
    }

    return {
      inAmount: amountIn,
      outAmount: currentAmount,
      priceImpact: totalPriceImpact.toNumber(),
      fee: totalFee.toNumber(),
      route,
      executionPrice: new Decimal(currentAmount).div(amountIn).toNumber(),
      minimumReceived: calculateMinimumReceived(currentAmount, slippage)
    };
  } catch (error) {
    console.error("Error estimating route:", error);
    return null;
  }
};