import { PublicKey } from '@solana/web3.js';

export interface TokenInfo {
  mint: PublicKey;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

export interface TokenImportError {
  code: string;
  message: string;
  mintAddress?: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  lastChecked: number;
}

export interface ImportedTokenInfo extends TokenInfo {
  status: 'existing' | 'imported' | 'failed';
  verified?: boolean;
  tags?: string[];
}