import { PublicKey } from '@solana/web3.js';

export const POOL_PROGRAM_ID = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
export const TICK_ARRAY_SIZE = 88;

// Pool Seeds
export const POOL_SEED = 'amm_v3';
export const TICK_ARRAY_SEED = 'tick_array';

// Valid configurations
export const VALID_TICK_SPACINGS = [1, 2, 4, 8, 16, 32, 64];
export const VALID_FEE_TIERS = [0.01, 0.05, 0.3, 1]; // Percentages