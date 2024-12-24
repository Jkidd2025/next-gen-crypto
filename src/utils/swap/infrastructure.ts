import { Connection, PublicKey } from '@solana/web3.js';

const CIRCUIT_BREAKER_THRESHOLD = 10; // 10% price change
const PRIORITY_FEE_MULTIPLIER = 1.5;

export const estimateGasFee = async (connection: Connection): Promise<number> => {
  try {
    const { feeCalculator } = await connection.getRecentBlockhash();
    const baseFee = feeCalculator.lamportsPerSignature;
    
    // Add priority fee based on network congestion
    const slot = await connection.getSlot();
    const blockTime = await connection.getBlockTime(slot);
    const prevBlockTime = await connection.getBlockTime(slot - 1);
    
    if (!blockTime || !prevBlockTime) return baseFee;
    
    const blockTimeDiff = blockTime - prevBlockTime;
    const congestionMultiplier = Math.max(1, blockTimeDiff / 0.4); // 0.4s is target block time
    
    return baseFee * congestionMultiplier * PRIORITY_FEE_MULTIPLIER;
  } catch (error) {
    console.error('Error estimating gas fee:', error);
    return 5000; // Default fee in lamports
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