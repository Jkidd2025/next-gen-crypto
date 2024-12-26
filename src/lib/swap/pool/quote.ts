import { PoolState } from '@/types/token-swap';
import BN from 'bn.js';
import { getTickArrays } from './ticks';
import { calculatePrice } from '../price';

interface QuoteResult {
  expectedOutput: string;
  minimumOutput: string;
  priceImpact: number;
  fee: string;
  tickArrays: any[];
}

export async function calculateQuote(
  pool: PoolState,
  amountIn: string,
  decimalsIn: number,
  decimalsOut: number,
  slippage: number
): Promise<QuoteResult> {
  // Convert amount to BN with proper decimals
  const amount = new BN(amountIn).mul(new BN(10).pow(new BN(decimalsIn)));
  
  // Get relevant tick arrays for the swap
  const tickArrays = await getTickArrays(
    pool.address,
    pool.currentTickIndex,
    pool.tickSpacing
  );

  // Calculate expected output based on pool state and tick data
  const spotPrice = calculatePrice(pool.sqrtPriceX64, decimalsIn, decimalsOut);
  const expectedOutput = amount.mul(new BN(spotPrice)).div(new BN(10).pow(new BN(decimalsIn)));
  
  // Calculate minimum output with slippage
  const minimumOutput = expectedOutput.mul(new BN(10000 - Math.floor(slippage * 100)))
    .div(new BN(10000));

  // Calculate fee amount
  const feeAmount = amount.mul(new BN(pool.fee)).div(new BN(10000));

  // Calculate price impact (simplified version)
  const priceImpact = amount.gt(new BN(0)) 
    ? (expectedOutput.toNumber() / amount.toNumber() - spotPrice) / spotPrice * 100
    : 0;

  return {
    expectedOutput: expectedOutput.toString(),
    minimumOutput: minimumOutput.toString(),
    priceImpact: Math.abs(priceImpact),
    fee: feeAmount.toString(),
    tickArrays
  };
}