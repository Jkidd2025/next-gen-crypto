import { Connection } from '@solana/web3.js';
import BN from 'bn.js';
import { PoolState } from '@/types/token-swap';
import { QuoteResult } from '@/types/pool';
import { getTickArrays } from './ticks';
import { calculatePrice } from '../price';

export async function calculateQuote(
  pool: PoolState,
  amountIn: string,
  decimalsIn: number,
  decimalsOut: number,
  slippage: number,
  connection: Connection
): Promise<QuoteResult> {
  // Input validation
  if (!pool.liquidity.gt(new BN(0))) {
    throw new Error('Pool has no liquidity');
  }
  
  const amount = new BN(amountIn).mul(new BN(10).pow(new BN(decimalsIn)));
  if (amount.lte(new BN(0))) {
    throw new Error('Invalid input amount');
  }

  // Get tick arrays with basic retry logic
  let tickArrays = null;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      tickArrays = await getTickArrays(
        connection,
        pool.address,
        pool.currentTickIndex,
        pool.tickSpacing
      );
      break;
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) throw error;
      console.warn('Retrying tick array fetch:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Calculate expected output with improved precision
  const sqrtPriceX64 = pool.sqrtPriceX64;
  const spotPrice = calculatePrice(sqrtPriceX64, decimalsIn, decimalsOut);
  
  // Use big number arithmetic for better precision
  const expectedOutput = calculateOutputWithSlippage(
    amount,
    spotPrice,
    pool.liquidity,
    decimalsIn,
    decimalsOut
  );

  // Calculate minimum output with safety checks
  const minimumOutput = applySlippage(expectedOutput, slippage);
  
  // Calculate accurate price impact
  const priceImpact = calculatePriceImpact(
    amount,
    expectedOutput,
    spotPrice,
    pool.liquidity
  );

  // Validate results
  validateQuoteResults(expectedOutput, minimumOutput, priceImpact);

  return {
    expectedOutput: expectedOutput.toString(),
    minimumOutput: minimumOutput.toString(),
    priceImpact,
    fee: calculateFee(amount, pool.fee).toString(),
    tickArrays,
    spotPrice: spotPrice.toString(),
    executionPrice: (expectedOutput.toNumber() / amount.toNumber()).toString()
  };
}

function calculateOutputWithSlippage(
  amountIn: BN,
  spotPrice: number,
  liquidity: BN,
  decimalsIn: number,
  decimalsOut: number
): BN {
  const expectedOutput = amountIn.mul(new BN(Math.floor(spotPrice * 1e6))).div(new BN(1e6));
  return adjustForLiquidity(expectedOutput, liquidity, decimalsOut);
}

function adjustForLiquidity(output: BN, liquidity: BN, decimals: number): BN {
  if (output.gt(liquidity)) {
    const adjustment = liquidity.mul(new BN(95)).div(new BN(100));
    return BN.min(output, adjustment);
  }
  return output;
}

function calculatePriceImpact(
  amountIn: BN,
  amountOut: BN,
  spotPrice: number,
  liquidity: BN
): number {
  const executionPrice = amountOut.toNumber() / amountIn.toNumber();
  const impact = (executionPrice - spotPrice) / spotPrice;
  return Math.min(Math.abs(impact), 0.99);
}

function validateQuoteResults(
  expectedOutput: BN,
  minimumOutput: BN,
  priceImpact: number
): void {
  if (expectedOutput.lte(new BN(0))) {
    throw new Error('Invalid expected output: must be greater than 0');
  }
  if (minimumOutput.lte(new BN(0))) {
    throw new Error('Invalid minimum output: must be greater than 0');
  }
  if (priceImpact < -1 || priceImpact > 1) {
    throw new Error('Invalid price impact: must be between -100% and 100%');
  }
}

function calculateFee(amount: BN, feePercentage: number): BN {
  return amount.mul(new BN(feePercentage)).div(new BN(10000));
}

function applySlippage(amount: BN, slippage: number): BN {
  const slippageFactor = new BN(Math.floor((1 - slippage / 100) * 10000));
  return amount.mul(slippageFactor).div(new BN(10000));
}