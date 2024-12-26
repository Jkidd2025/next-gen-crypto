import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

// Constants
const CURRENT_POOL_VERSION = 1;

export interface PoolStateData {
  version: number;
  tokenA: PublicKey;
  tokenB: PublicKey;
  tickSpacing: number;
  fee: number;
  liquidity: BN;
  sqrtPriceX64: BN;
  currentTickIndex: number;
  feeGrowthGlobalA: BN;
  feeGrowthGlobalB: BN;
  protocolFeesA: BN;
  protocolFeesB: BN;
}

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

function validatePublicKey(key: PublicKey, fieldName: string) {
  if (!(key instanceof PublicKey)) {
    throw new Error(`Invalid ${fieldName}: Must be a valid PublicKey`);
  }
}

function validateNumber(value: number, fieldName: string, min?: number, max?: number) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`Invalid ${fieldName}: Must be a valid number`);
  }
  if (min !== undefined && value < min) {
    throw new Error(`Invalid ${fieldName}: Must be >= ${min}`);
  }
  if (max !== undefined && value > max) {
    throw new Error(`Invalid ${fieldName}: Must be <= ${max}`);
  }
}

function validateBN(value: BN, fieldName: string) {
  if (!(value instanceof BN)) {
    throw new Error(`Invalid ${fieldName}: Must be a valid BN instance`);
  }
}

export async function parsePoolState(data: Buffer): Promise<PoolStateData> {
  try {
    let offset = 0;
    
    // Version check
    const version = data.readUInt8(offset);
    if (version !== CURRENT_POOL_VERSION) {
      throw new Error(`Unsupported pool version: ${version}`);
    }
    offset += 1;

    // Parse token addresses
    const tokenA = new PublicKey(data.slice(offset, offset + 32));
    validatePublicKey(tokenA, 'tokenA');
    offset += 32;

    const tokenB = new PublicKey(data.slice(offset, offset + 32));
    validatePublicKey(tokenB, 'tokenB');
    offset += 32;

    // Parse tick spacing and fee
    const tickSpacing = data.readInt16LE(offset);
    validateNumber(tickSpacing, 'tickSpacing', 1);
    offset += 2;

    const fee = data.readUInt32LE(offset);
    validateNumber(fee, 'fee', 0, 10000); // Max 100% (10000 basis points)
    offset += 4;

    // Parse liquidity and price
    const liquidity = new BN(data.slice(offset, offset + 16), 'le');
    validateBN(liquidity, 'liquidity');
    offset += 16;

    const sqrtPriceX64 = new BN(data.slice(offset, offset + 16), 'le');
    validateBN(sqrtPriceX64, 'sqrtPriceX64');
    offset += 16;

    // Parse tick index
    const currentTickIndex = data.readInt32LE(offset);
    offset += 4;

    // Parse fee growth and protocol fees
    const feeGrowthGlobalA = new BN(data.slice(offset, offset + 16), 'le');
    validateBN(feeGrowthGlobalA, 'feeGrowthGlobalA');
    offset += 16;

    const feeGrowthGlobalB = new BN(data.slice(offset, offset + 16), 'le');
    validateBN(feeGrowthGlobalB, 'feeGrowthGlobalB');
    offset += 16;

    const protocolFeesA = new BN(data.slice(offset, offset + 16), 'le');
    validateBN(protocolFeesA, 'protocolFeesA');
    offset += 16;

    const protocolFeesB = new BN(data.slice(offset, offset + 16), 'le');
    validateBN(protocolFeesB, 'protocolFeesB');
    offset += 16;

    return {
      version,
      tokenA,
      tokenB,
      tickSpacing,
      fee,
      liquidity,
      sqrtPriceX64,
      currentTickIndex,
      feeGrowthGlobalA,
      feeGrowthGlobalB,
      protocolFeesA,
      protocolFeesB
    };
  } catch (error) {
    throw new Error(`Failed to parse pool state: ${error.message}`);
  }
}

export async function getPoolState(
  connection: Connection,
  poolAddress: PublicKey
): Promise<PoolState | null> {
  const accountInfo = await connection.getAccountInfo(poolAddress);
  if (!accountInfo) return null;

  const poolState = await parsePoolState(accountInfo.data);
  
  return {
    address: poolAddress,
    tokenA: poolState.tokenA,
    tokenB: poolState.tokenB,
    tickSpacing: poolState.tickSpacing,
    liquidity: poolState.liquidity,
    sqrtPriceX64: poolState.sqrtPriceX64,
    currentTickIndex: poolState.currentTickIndex,
    fee: poolState.fee
  };
}