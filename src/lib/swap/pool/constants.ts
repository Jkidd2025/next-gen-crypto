import { PublicKey } from '@solana/web3.js';

export const POOL_PROGRAM_ID = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
export const TICK_ARRAY_SIZE = 88;

// Pool Seeds
export const POOL_SEED = 'amm_v3';
export const TICK_ARRAY_SEED = 'tick_array';

// Valid configurations
export const VALID_TICK_SPACINGS = [1, 2, 4, 8, 16, 32, 64];
export const VALID_FEE_TIERS = [0.01, 0.05, 0.3, 1]; // Percentages

// Pool version
export const CURRENT_POOL_VERSION = 1;

// Mapping of tick spacing to corresponding fee tiers
export const TICK_SPACING_TO_FEE_TIERS: { [key: number]: number[] } = {
  1: [0.01],   // 1 bps
  2: [0.05],   // 5 bps
  8: [0.3],    // 30 bps
  64: [1]      // 100 bps
};

// Price impact thresholds
export const PRICE_IMPACT_TIERS = {
  LOW: 0.005,    // 0.5%
  MEDIUM: 0.01,  // 1%
  HIGH: 0.05     // 5%
};

// Pool caching configuration
export const POOL_CACHE_CONFIG = {
  MAX_AGE: 30_000,        // 30 seconds
  MAX_ENTRIES: 100,       // Maximum number of cached pools
  REFRESH_INTERVAL: 5000  // 5 seconds
};