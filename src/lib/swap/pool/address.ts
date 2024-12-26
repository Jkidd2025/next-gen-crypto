import { Connection, PublicKey } from '@solana/web3.js';
import { 
  POOL_PROGRAM_ID, 
  POOL_SEED, 
  TICK_ARRAY_SEED, 
  TICK_ARRAY_SIZE,
  VALID_TICK_SPACINGS,
  VALID_FEE_TIERS
} from './constants';

export async function derivePoolAddress(
  tokenA: PublicKey,
  tokenB: PublicKey,
  tickSpacing: number,
  feeTier: number = 0.3 // Default fee tier
): Promise<PublicKey> {
  // Validate inputs
  if (!VALID_TICK_SPACINGS.includes(tickSpacing)) {
    throw new Error(`Invalid tick spacing: ${tickSpacing}`);
  }
  if (!VALID_FEE_TIERS.includes(feeTier)) {
    throw new Error(`Invalid fee tier: ${feeTier}`);
  }

  // Sort tokens to ensure consistent ordering
  const [token0, token1] = tokenA.toBuffer().compare(tokenB.toBuffer()) < 0
    ? [tokenA, tokenB]
    : [tokenB, tokenA];

  try {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(POOL_SEED),
        token0.toBuffer(),
        token1.toBuffer(),
        Buffer.from([tickSpacing]),
        Buffer.from([Math.floor(feeTier * 100)]) // Convert percentage to basis points
      ],
      POOL_PROGRAM_ID
    )[0];
  } catch (error) {
    throw new Error(`Failed to derive pool address: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function deriveTickArrayAddress(
  poolAddress: PublicKey,
  startTick: number,
  tickSpacing: number
): PublicKey {
  const startTickIndex = Math.floor(startTick / (tickSpacing * TICK_ARRAY_SIZE)) * (tickSpacing * TICK_ARRAY_SIZE);
  
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(TICK_ARRAY_SEED),
      poolAddress.toBuffer(),
      Buffer.from(startTickIndex.toString())
    ],
    POOL_PROGRAM_ID
  )[0];
}

export async function validatePoolAddress(
  connection: Connection,
  poolAddress: PublicKey
): Promise<boolean> {
  const accountInfo = await connection.getAccountInfo(poolAddress);
  if (!accountInfo) return false;
  
  // Verify program owner
  return accountInfo.owner.equals(POOL_PROGRAM_ID);
}

export function calculateFeeTierFromBps(basisPoints: number): number {
  return basisPoints / 10000; // Convert from basis points to percentage
}