import { Connection, PublicKey } from '@solana/web3.js';
import { configService } from '@/services/config/appConfig';

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
    
    return baseFee * congestionMultiplier;
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
  const config = await configService.getConfig();
  
  // Check if price impact exceeds threshold
  if (Math.abs(priceImpact) > config.monitoring_thresholds.price_change_alert) {
    return true;
  }
  
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