import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface QuoteResult {
  expectedOutput: string;
  minimumOutput: string;
  priceImpact: number;
  fee: string;
  tickArrays: any[];
  spotPrice: string;
  executionPrice: string;
}

export interface CachedPoolData {
  data: any;
  timestamp: number;
  accessCount: number;
}