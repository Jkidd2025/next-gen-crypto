import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@/types/token-swap';
import { derivePoolAddress } from './pool';
import BN from 'bn.js';

const Q64 = new BN(1).shln(64);

export function calculatePrice(
  sqrtPriceX64: BN,
  decimalsA: number,
  decimalsB: number
): number {
  const price = sqrtPriceX64.mul(sqrtPriceX64).div(Q64);
  const adjustedPrice = price.toNumber() / Math.pow(10, decimalsA - decimalsB);
  return adjustedPrice;
}

export function calculatePriceImpact(
  inputAmount: number,
  outputAmount: number,
  spotPrice: number
): number {
  const expectedOutput = inputAmount * spotPrice;
  const impact = ((expectedOutput - outputAmount) / expectedOutput) * 100;
  return Math.max(0, impact);
}

export function formatPrice(
  price: number,
  significantDigits: number = 6
): string {
  if (price < 0.0001) {
    return price.toExponential(significantDigits - 1);
  }
  return price.toPrecision(significantDigits);
}

export function calculateSpotPrice(
  reserveA: BN,
  reserveB: BN,
  decimalsA: number,
  decimalsB: number
): number {
  if (reserveA.isZero() || reserveB.isZero()) {
    return 0;
  }
  
  const adjustedReserveA = reserveA.mul(new BN(10).pow(new BN(decimalsB)));
  const adjustedReserveB = reserveB.mul(new BN(10).pow(new BN(decimalsA)));
  
  return adjustedReserveB.toNumber() / adjustedReserveA.toNumber();
}

export function getMinimumAmountOut(
  amountOut: BN,
  slippageTolerance: number
): BN {
  const slippageFactor = new BN(Math.floor((1 - slippageTolerance / 100) * 10000));
  return amountOut.mul(slippageFactor).div(new BN(10000));
}

export function getMaximumAmountIn(
  amountIn: BN,
  slippageTolerance: number
): BN {
  const slippageFactor = new BN(Math.floor((1 + slippageTolerance / 100) * 10000));
  return amountIn.mul(slippageFactor).div(new BN(10000));
}

export async function getPriceFromPool(
  tokenA: TokenInfo,
  tokenB: TokenInfo,
  tickSpacing: number = 64
): Promise<number | null> {
  try {
    const poolAddress = await derivePoolAddress(
      new PublicKey(tokenA.mint),
      new PublicKey(tokenB.mint),
      tickSpacing
    );
    
    // TODO: Fetch actual pool data and calculate price
    // This is a placeholder until pool data fetching is implemented
    return null;
  } catch (error) {
    console.error('Error getting price from pool:', error);
    return null;
  }
}

export function calculateAmountOut(
  amountIn: BN,
  reserveIn: BN,
  reserveOut: BN,
  fee: number = 0.003 // 0.3% default fee
): BN {
  const amountInWithFee = amountIn.mul(new BN(Math.floor((1 - fee) * 10000))).div(new BN(10000));
  const numerator = amountInWithFee.mul(reserveOut);
  const denominator = reserveIn.add(amountInWithFee);
  return numerator.div(denominator);
}

export function calculateAmountIn(
  amountOut: BN,
  reserveIn: BN,
  reserveOut: BN,
  fee: number = 0.003 // 0.3% default fee
): BN {
  const numerator = reserveIn.mul(amountOut).mul(new BN(10000));
  const denominator = (reserveOut.sub(amountOut)).mul(new BN(Math.floor((1 - fee) * 10000)));
  return numerator.div(denominator).add(new BN(1));
}