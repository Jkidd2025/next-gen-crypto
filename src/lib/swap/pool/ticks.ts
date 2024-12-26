import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { TICK_ARRAY_SIZE } from './constants';
import { deriveTickArrayAddress } from './address';

export interface TickArrayData {
  address: PublicKey;
  startTick: number;
  ticks: Array<{
    tick: number;
    liquidityNet: BN;
    liquidityGross: BN;
  }>;
}

export async function getTickArrays(
  connection: Connection,
  poolAddress: PublicKey,
  currentTick: number,
  tickSpacing: number,
  numArrays = 3
): Promise<TickArrayData[]> {
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

export function findNearestTicks(
  tickArrays: TickArrayData[],
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