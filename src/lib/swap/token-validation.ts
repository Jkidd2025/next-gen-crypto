import { Connection, PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@/types/token-swap';
import bs58 from 'bs58';

// Known malicious or spam token addresses
const BLACKLISTED_TOKENS: Set<string> = new Set([
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
]);

// Maximum allowed decimals for a token
const MAX_DECIMALS = 18;

// Minimum required token name length
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;

export interface TokenValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateToken(
  connection: Connection,
  mintAddress: string,
  tokenInfo?: Partial<TokenInfo>
): Promise<TokenValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check if token is blacklisted
    if (BLACKLISTED_TOKENS.has(mintAddress)) {
      errors.push('Token is blacklisted');
      return { isValid: false, errors, warnings };
    }

    // Validate address format
    if (!isValidAddressFormat(mintAddress)) {
      errors.push('Invalid token address format');
      return { isValid: false, errors, warnings };
    }

    // Create PublicKey object
    const mintPubkey = new PublicKey(mintAddress);

    // Check if account exists
    const accountInfo = await connection.getAccountInfo(mintPubkey);
    if (!accountInfo) {
      errors.push('Token mint account not found');
      return { isValid: false, errors, warnings };
    }

    // Validate mint account data
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!mintInfo.value?.data || typeof mintInfo.value.data !== 'object') {
      errors.push('Invalid mint account data');
      return { isValid: false, errors, warnings };
    }

    // Check decimals
    const { decimals } = (mintInfo.value.data as any).parsed.info;
    if (!isValidDecimals(decimals)) {
      errors.push(`Invalid decimals: ${decimals}. Must be between 0 and ${MAX_DECIMALS}`);
    }

    // Validate token metadata if provided
    if (tokenInfo) {
      const metadataErrors = validateTokenMetadata(tokenInfo);
      errors.push(...metadataErrors);
    }

    // Add warnings for potential issues
    if (accountInfo.owner.toString() !== 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
      warnings.push('Non-standard token program owner');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    return { isValid: false, errors, warnings };
  }
}

export function isValidAddressFormat(address: string): boolean {
  try {
    const decoded = bs58.decode(address);
    return decoded.length === 32;
  } catch {
    return false;
  }
}

export function isValidDecimals(decimals: number): boolean {
  return Number.isInteger(decimals) && decimals >= 0 && decimals <= MAX_DECIMALS;
}

function validateTokenMetadata(tokenInfo: Partial<TokenInfo>): string[] {
  const errors: string[] = [];

  if (tokenInfo.name) {
    if (tokenInfo.name.length < MIN_NAME_LENGTH || tokenInfo.name.length > MAX_NAME_LENGTH) {
      errors.push(`Token name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`);
    }
  }

  if (tokenInfo.symbol) {
    if (!/^[A-Za-z0-9]+$/.test(tokenInfo.symbol)) {
      errors.push('Token symbol must contain only letters and numbers');
    }
  }

  if (tokenInfo.decimals !== undefined && !isValidDecimals(tokenInfo.decimals)) {
    errors.push(`Invalid decimals: ${tokenInfo.decimals}`);
  }

  return errors;
}

export function formatWithDecimals(amount: number | string, decimals: number): string {
  if (!isValidDecimals(decimals)) {
    throw new Error('Invalid decimals');
  }

  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return (value / Math.pow(10, decimals)).toFixed(decimals);
}

export function parseWithDecimals(amount: string, decimals: number): bigint {
  if (!isValidDecimals(decimals)) {
    throw new Error('Invalid decimals');
  }

  const [whole, fraction = ''] = amount.split('.');
  const fractionPadded = fraction.padEnd(decimals, '0');
  const value = `${whole}${fractionPadded}`;
  return BigInt(value);
}