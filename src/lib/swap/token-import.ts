import { Connection, PublicKey } from '@solana/web3.js';
import { 
  Metadata,
  PROGRAM_ADDRESS as TOKEN_METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';
import { TokenInfo, ImportedTokenInfo } from '@/types/token-swap';
import { getCachedTokenList, cacheTokenList } from './token-cache';
import { validateToken } from './token-validation';
import { isBlacklisted, getBlacklistReason } from './blacklist';

export async function importToken(
  connection: Connection,
  mintAddress: string
): Promise<ImportedTokenInfo | null> {
  try {
    // Check blacklist first
    if (isBlacklisted(mintAddress)) {
      const reason = getBlacklistReason(mintAddress);
      throw new Error(`Token is blacklisted: ${reason}`);
    }

    // Validate token
    const validationResult = await validateToken(connection, mintAddress);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors[0].message);
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
    
    // Get PDA for metadata
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        new PublicKey(TOKEN_METADATA_PROGRAM_ID).toBuffer(),
        mintPubkey.toBuffer(),
      ],
      new PublicKey(TOKEN_METADATA_PROGRAM_ID)
    );
    
    const metadataAccount = await connection.getAccountInfo(metadataPDA);
    if (!metadataAccount) {
      throw new Error('Token metadata not found');
    }

    // Get metadata
    const metadata = await Metadata.fromAccountAddress(connection, metadataPDA);

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
      tags: ['imported']
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
  // Check blacklist first
  if (isBlacklisted(mintAddress)) {
    const reason = getBlacklistReason(mintAddress);
    return { valid: false, reason: `Token is blacklisted: ${reason}` };
  }

  const validationResult = await validateToken(connection, mintAddress);
  return {
    valid: validationResult.isValid,
    reason: validationResult.errors[0]?.message || validationResult.warnings[0]?.message
  };
}