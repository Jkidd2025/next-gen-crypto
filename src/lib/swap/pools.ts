import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { TokenInfo, PoolInfo } from '@/types/token-swap';

// Constants
export const POOL_PROGRAM_ID = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
export const TICK_ARRAY_SIZE = 88;

// Pool Seeds
const POOL_SEED = 'amm_v3';
const TICK_ARRAY_SEED = 'tick_array';

/**
 * Get pool information for a token pair
 */
export async function getPoolInfo(
  tokenA: TokenInfo,
  tokenB: TokenInfo
): Promise<PoolInfo | null> {
  try {
    // Mock implementation for now
    return {
      id: 'mock-pool',
      tokenA,
      tokenB,
      tokenAReserves: '1000000',
      tokenBReserves: '1000000',
      liquidity: '1000000',
      fee: 0.003,
      address: 'mock-address'
    };
  } catch (error) {
    console.error('Error getting pool info:', error);
    return null;
  }
}

/**
 * Derive pool address for a token pair
 */
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

/**
 * Parse pool state account data
 */
export async function getPoolState(
  connection: Connection,
  poolAddress: PublicKey
) {
  const accountInfo = await connection.getAccountInfo(poolAddress);
  if (!accountInfo) return null;

  const data = accountInfo.data;
  let offset = 0;

  // Skip discriminator
  offset += 8;

  // Parse pool data
  const tokenA = new PublicKey(data.slice(offset, offset + 32));
  offset += 32;
  const tokenB = new PublicKey(data.slice(offset, offset + 32));
  offset += 32;
  const tickSpacing = data.readInt16LE(offset);
  offset += 2;
  const fee = data.readUInt32LE(offset);
  offset += 4;
  const liquidity = new BN(data.slice(offset, offset + 16), 'le');
  offset += 16;
  const sqrtPriceX64 = new BN(data.slice(offset, offset + 16), 'le');
  offset += 16;
  const currentTickIndex = data.readInt32LE(offset);

  return {
    address: poolAddress,
    tokenA,
    tokenB,
    tickSpacing,
    liquidity,
    sqrtPriceX64,
    currentTickIndex,
    fee
  };
}

/**
 * Derive tick array address for a given tick index
 */
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

/**
 * Get tick arrays around the current tick
 */
export async function getTickArrays(
  connection: Connection,
  poolAddress: PublicKey,
  currentTick: number,
  tickSpacing: number,
  numArrays = 3
): Promise<Array<{
  address: PublicKey;
  startTick: number;
  ticks: Array<{
    tick: number;
    liquidityNet: BN;
    liquidityGross: BN;
  }>;
}>> {
  const tickArrays = [];
  const startTickArrayIndex = Math.floor(currentTick / (tickSpacing * TICK_ARRAY_SIZE));

  for (let i = 0; i < numArrays; i++) {
    const arrayIndex = startTickArrayIndex + (i - 1);
    const startTick = arrayIndex * tickSpacing * TICK_ARRAY_SIZE;
    const address = deriveTickArrayAddress(poolAddress, startTick, tickSpacing);

    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) continue;

    const data = accountInfo.data;
    let offset = 8; // Skip discriminator
    const ticks = [];

    for (let j = 0; j < TICK_ARRAY_SIZE; j++) {
      const liquidityNet = new BN(data.slice(offset, offset + 16), 'le');
      offset += 16;
      const liquidityGross = new BN(data.slice(offset, offset + 16), 'le');
      offset += 16;

      ticks.push({
        tick: startTick + j * tickSpacing,
        liquidityNet,
        liquidityGross
      });
    }

    tickArrays.push({
      address,
      startTick,
      ticks
    });
  }

  return tickArrays;
}

/**
 * Find nearest initialized ticks
 */
export function findNearestTicks(
  tickArrays: Array<{
    startTick: number;
    ticks: Array<{
      tick: number;
      liquidityGross: BN;
    }>;
  }>,
  currentTick: number
): { nextTick: number | null; previousTick: number | null } {
  let nextTick = null;
  let previousTick = null;

  for (const array of tickArrays) {
    for (const { tick, liquidityGross } of array.ticks) {
      if (liquidityGross.gtn(0)) {
        if (tick > currentTick && (!nextTick || tick < nextTick)) {
          nextTick = tick;
        }
        if (tick < currentTick && (!previousTick || tick > previousTick)) {
          previousTick = tick;
        }
      }
    }
  }

  return { nextTick, previousTick };
}