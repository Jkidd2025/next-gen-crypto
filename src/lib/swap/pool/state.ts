import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface PoolState {
  address: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  tickSpacing: number;
  liquidity: BN;
  sqrtPriceX64: BN;
  currentTickIndex: number;
  fee: number;
}

export async function getPoolState(
  connection: Connection,
  poolAddress: PublicKey
): Promise<PoolState | null> {
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