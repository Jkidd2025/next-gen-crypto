import { TokenInfo, SwapQuote, PoolInfo } from "@/types/token-swap";
import { HIGH_PRICE_IMPACT_THRESHOLD } from "./constants";
import { getPoolInfo } from "./pools";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Decimal from "decimal.js";

export const calculatePriceImpact = async (
  amountIn: string,
  tokenIn: TokenInfo,
  tokenOut: TokenInfo
): Promise<number> => {
  try {
    const pool = await getPoolInfo(tokenIn, tokenOut);
    if (!pool) return 0;

    const amountInDecimal = new Decimal(amountIn);
    const reserveInDecimal = new Decimal(pool.tokenAReserves);
    const reserveOutDecimal = new Decimal(pool.tokenBReserves);
    
    // Calculate the expected output amount using constant product formula
    const k = reserveInDecimal.mul(reserveOutDecimal);
    const newReserveIn = reserveInDecimal.add(amountInDecimal);
    const newReserveOut = k.div(newReserveIn);
    const amountOut = reserveOutDecimal.sub(newReserveOut);
    
    // Calculate spot price before swap
    const spotPrice = reserveInDecimal.div(reserveOutDecimal);
    
    // Calculate effective price
    const effectivePrice = amountInDecimal.div(amountOut);
    
    // Calculate price impact
    const priceImpact = effectivePrice.sub(spotPrice).div(spotPrice).mul(100);
    
    return Math.abs(priceImpact.toNumber());
  } catch (error) {
    console.error("Error calculating price impact:", error);
    return 0;
  }
};

export const calculateQuote = async (
  amountIn: string,
  tokenIn: TokenInfo,
  tokenOut: TokenInfo,
  slippage: number
): Promise<SwapQuote> => {
  try {
    const pool = await getPoolInfo(tokenIn, tokenOut);
    if (!pool) {
      throw new Error("No liquidity pool found");
    }

    const amountInDecimal = new Decimal(amountIn);
    const reserveInDecimal = new Decimal(pool.tokenAReserves);
    const reserveOutDecimal = new Decimal(pool.tokenBReserves);
    
    // Calculate output amount using constant product formula
    const k = reserveInDecimal.mul(reserveOutDecimal);
    const newReserveIn = reserveInDecimal.add(amountInDecimal);
    const newReserveOut = k.div(newReserveIn);
    const amountOut = reserveOutDecimal.sub(newReserveOut);
    
    // Calculate price impact
    const priceImpact = await calculatePriceImpact(amountIn, tokenIn, tokenOut);
    
    // Calculate minimum received with slippage
    const minimumReceived = amountOut.mul(new Decimal(1).sub(new Decimal(slippage).div(100)));
    
    // Calculate execution price
    const executionPrice = amountInDecimal.div(amountOut);

    return {
      inAmount: amountIn,
      outAmount: amountOut.toString(),
      priceImpact,
      fee: pool.fee,
      route: [
        { symbol: tokenIn.symbol, mint: tokenIn.mint },
        { symbol: tokenOut.symbol, mint: tokenOut.mint }
      ],
      executionPrice: executionPrice.toNumber(),
      minimumReceived: minimumReceived.toString()
    };
  } catch (error) {
    console.error("Error calculating quote:", error);
    throw error;
  }
};

export const isHighPriceImpact = (priceImpact: number): boolean => {
  return priceImpact > HIGH_PRICE_IMPACT_THRESHOLD;
};

export const calculateMinimumReceived = (
  amount: string,
  slippage: number
): string => {
  if (!amount) return "0";
  const amountDecimal = new Decimal(amount);
  return amountDecimal.mul(new Decimal(1).sub(new Decimal(slippage).div(100))).toString();
};

export const formatPrice = (price: number, decimals: number = 6): string => {
  return new Decimal(price).toDecimalPlaces(decimals).toNumber().toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
};