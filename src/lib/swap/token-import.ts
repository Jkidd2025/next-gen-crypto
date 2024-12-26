import { Connection, PublicKey } from '@solana/web3.js';
import { 
  Metadata,
  findMetadataPda
} from '@metaplex-foundation/mpl-token-metadata';
import { TokenInfo, ImportedTokenInfo } from '@/types/token-swap';
import { getCachedTokenList, cacheTokenList } from './token-cache';
import { isValidMintAddress } from './token-validation';

export async function importToken(
  connection: Connection,
  mintAddress: string
): Promise<ImportedTokenInfo | null> {
  try {
    if (!isValidMintAddress(mintAddress)) {
      throw new Error('Invalid mint address');
    }

    // Check if token already exists in cache
    const cachedTokens = getCachedTokenList() || [];
    const existingToken = cachedTokens.find(
      t => t.mint.toLowerCase() === mintAddress.toLowerCase()
    );
    if (existingToken) {
      return { ...existingToken, status: 'existing' };
    }

    // Fetch token metadata
    const mintPubkey = new PublicKey(mintAddress);
    const [metadataPDA] = findMetadataPda({ mint: mintPubkey });
    
    const metadataAccount = await connection.getAccountInfo(metadataPDA);
    if (!metadataAccount) {
      throw new Error('Token metadata not found');
    }

    const metadata = Metadata.deserialize(metadataAccount.data)[0];

    // Get token supply and decimals
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!mintInfo.value?.data || typeof mintInfo.value.data !== 'object') {
      throw new Error('Invalid mint info');
    }

    const { decimals } = (mintInfo.value.data as any).parsed.info;

    // Create token info
    const newToken: TokenInfo = {
      mint: mintAddress,
      symbol: metadata.symbol.trim(),
      name: metadata.name.trim(),
      decimals,
      logoURI: metadata.uri || '',
      verified: false,
      tags: ['imported'],
      balance: 0,
      usdPrice: 0
    };

    // Add to cached list
    const updatedTokens = [...cachedTokens, newToken];
    cacheTokenList(updatedTokens);

    return { ...newToken, status: 'imported' };
  } catch (error) {
    console.error('Error importing token:', error);
    return null;
  }
}

export async function validateImportedToken(
  connection: Connection,
  mintAddress: string
): Promise<{ valid: boolean; reason?: string }> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    
    // Check if account exists
    const accountInfo = await connection.getAccountInfo(mintPubkey);
    if (!accountInfo) {
      return { valid: false, reason: 'Token mint account not found' };
    }

    // Check if it's a valid mint account
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!mintInfo.value?.data || typeof mintInfo.value.data !== 'object') {
      return { valid: false, reason: 'Invalid mint account' };
    }

    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      reason: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}