import { PublicKey } from '@solana/web3.js';
import { POOL_PROGRAM_ID, POOL_SEED, TICK_ARRAY_SEED } from './constants';

export async function derivePoolAddress(
  tokenA: PublicKey,
  tokenB: PublicKey,
  tickSpacing: number
): Promise<PublicKey> {
  // Sort tokens to ensure consistent ordering
  const [token0, token1] = tokenA.toBuffer().compare(tokenB.toBuffer()) < 0
    ? [tokenA, tokenB]
    : [tokenB, tokenA];

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(POOL_SEED),
      token0.toBuffer(),
      token1.toBuffer(),
      Buffer.from([tickSpacing])
    ],
    POOL_PROGRAM_ID
  )[0];
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