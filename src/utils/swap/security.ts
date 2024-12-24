import { PublicKey } from '@solana/web3.js';
import { COMMON_TOKENS } from '@/constants/tokens';
import { SwapError, SwapErrorTypes } from '@/types/errors';

// Minimum amounts in USD value
const MIN_SWAP_AMOUNT_USD = 0.1;
const MAX_SWAP_AMOUNT_USD = 100000;
const MAX_SLIPPAGE = 50; // 50%
const PRICE_IMPACT_WARNING = 3; // 3%
const PRICE_IMPACT_CRITICAL = 5; // 5%
const CIRCUIT_BREAKER_THRESHOLD = 10; // 10% price change

export const validateTokenAddress = (address: string): boolean => {
  try {
    // Validate address format
    new PublicKey(address);
    
    // Check against whitelist
    return Object.values(COMMON_TOKENS).some(token => token.address === address);
  } catch {
    return false;
  }
};

export const validateSwapAmount = async (
  amount: number,
  tokenPrice: number
): Promise<void> => {
  const usdValue = amount * tokenPrice;
  
  if (usdValue < MIN_SWAP_AMOUNT_USD) {
    throw new SwapError(
      SwapErrorTypes.VALIDATION,
      `Minimum swap amount is $${MIN_SWAP_AMOUNT_USD}`
    );
  }
  
  if (usdValue > MAX_SWAP_AMOUNT_USD) {
    throw new SwapError(
      SwapErrorTypes.VALIDATION,
      `Maximum swap amount is $${MAX_SWAP_AMOUNT_USD}`
    );
  }
};

export const validateSlippage = (slippage: number): void => {
  if (slippage <= 0 || slippage > MAX_SLIPPAGE) {
    throw new SwapError(
      SwapErrorTypes.VALIDATION,
      `Slippage must be between 0 and ${MAX_SLIPPAGE}%`
    );
  }
};

export const validatePriceImpact = (priceImpact: number): void => {
  if (priceImpact >= PRICE_IMPACT_CRITICAL) {
    throw new SwapError(
      SwapErrorTypes.PRICE_IMPACT_HIGH,
      `Price impact is too high (${priceImpact.toFixed(2)}%)`
    );
  }
};

export const checkCircuitBreaker = async (
  fromToken: string,
  toToken: string,
  priceImpact: number
): Promise<boolean> => {
  // Check if price impact exceeds threshold
  if (Math.abs(priceImpact) > CIRCUIT_BREAKER_THRESHOLD) {
    return true;
  }
  
  // Additional checks can be added here
  return false;
};

export const validateTransactionSignature = (signature: string): boolean => {
  try {
    // Check if signature is valid base58
    return /^[1-9A-HJ-NP-Za-km-z]{88}$/.test(signature);
  } catch {
    return false;
  }
};