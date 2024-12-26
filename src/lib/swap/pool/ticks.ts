import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { TICK_ARRAY_SIZE } from './constants';
import { deriveTickArrayAddress } from './address';

export interface TickData {
  tick: number;
  liquidityNet: BN;
  liquidityGross: BN;
}

export interface TickArray {
  address: PublicKey;
  startTick: number;
  ticks: TickData[];
}

interface TickArrayCache {
  [key: string]: {
    data: TickArray;
    timestamp: number;
  }
}

const tickArrayCache: TickArrayCache = {};
const CACHE_DURATION = 30_000; // 30 seconds

export function parseTickArray(data: Buffer): TickArray {
  let offset = 8; // Skip discriminator
  const ticks: TickData[] = [];

  for (let i = 0; i < TICK_ARRAY_SIZE; i++) {
    const liquidityNet = new BN(data.slice(offset, offset + 16), 'le');
    offset += 16;
    const liquidityGross = new BN(data.slice(offset, offset + 16), 'le');
    offset += 16;

    ticks.push({
      tick: i,
      liquidityNet,
      liquidityGross
    });
  }

  return {
    address: PublicKey.default,
    startTick: 0,
    ticks
  };
}

export async function getTickArrays(
  connection: Connection,
  poolAddress: PublicKey,
  currentTick: number,
  tickSpacing: number,
  numArrays = 3
): Promise<TickArray[]> {
  const tickArrayAddresses: PublicKey[] = [];
  const startArrayIndex = Math.floor(currentTick / (tickSpacing * TICK_ARRAY_SIZE));

  // Get addresses
  for (let i = 0; i < numArrays; i++) {
    const arrayIndex = startArrayIndex + (i - 1);
    const startTick = arrayIndex * tickSpacing * TICK_ARRAY_SIZE;
    const address = deriveTickArrayAddress(poolAddress, startTick, tickSpacing);
    tickArrayAddresses.push(address);
  }

  // Fetch in parallel with caching
  const tickArrays = await Promise.all(
    tickArrayAddresses.map(async (address) => {
      const cacheKey = address.toBase58();
      const cached = tickArrayCache[cacheKey];
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      try {
        const accountInfo = await connection.getAccountInfo(address);
        if (!accountInfo?.data) return null;

        const tickArray = parseTickArray(accountInfo.data);
        tickArray.address = address;
        
        tickArrayCache[cacheKey] = {
          data: tickArray,
          timestamp: Date.now()
        };

        return tickArray;
      } catch (error) {
        console.error(`Failed to fetch tick array ${address.toBase58()}:`, error);
        return null;
      }
    })
  );

  return tickArrays.filter((array): array is TickArray => array !== null);
}

export function findNearestTicks(
  tickArrays: TickArray[],
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