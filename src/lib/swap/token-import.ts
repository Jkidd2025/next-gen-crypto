import { Connection, PublicKey } from '@solana/web3.js';
import { 
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  Metadata as MetadataData
} from '@metaplex-foundation/mpl-token-metadata';
import { TokenInfo, ImportedTokenInfo, TokenValidationState } from '@/types/token-swap';
import { getCachedTokenList, cacheTokenList } from './token-cache';
import { validateToken } from './token-validation';
import { isBlacklisted, getBlacklistReason } from './blacklist';

export async function importToken(
  connection: Connection,
  mintAddress: string
): Promise<ImportedTokenInfo | null> {
  try {
    const tokenInfo = await getTokenMetadata(connection, mintAddress);
    if (!tokenInfo) return null;
    
    return {
      ...tokenInfo,
      status: 'imported'
    };
  } catch (error) {
    console.error('Error importing token:', error);
    return null;
  }
}

export async function getTokenMetadata(
  connection: Connection,
  mintAddress: string
): Promise<TokenInfo | null> {
  try {
    // Check blacklist first
    if (isBlacklisted(mintAddress)) {
      const reason = getBlacklistReason(mintAddress);
      throw new Error(`Token is blacklisted: ${reason}`);
    }

    // Validate token
    const validationResult = await validateToken(connection, mintAddress);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors[0]);
    }

    // Check if token already exists in cache
    const cachedTokens = getCachedTokenList() || [];
    const existingToken = cachedTokens.find(
      t => t.mint.toLowerCase() === mintAddress.toLowerCase()
    );
    
    if (existingToken) {
      return existingToken;
    }

    // Fetch token metadata
    const mintPubkey = new PublicKey(mintAddress);
    
    // Get PDA for metadata
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPubkey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    
    const metadataAccount = await connection.getAccountInfo(metadataPDA);
    if (!metadataAccount) {
      throw new Error('Token metadata not found');
    }

    // Get metadata
    const metadata = MetadataData.deserialize(metadataAccount.data)[0];

    // Get token supply and decimals
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!mintInfo.value?.data || typeof mintInfo.value.data !== 'object') {
      throw new Error('Invalid mint info');
    }

    const { decimals } = (mintInfo.value.data as any).parsed.info;

    // Create token info
    const tokenInfo: TokenInfo = {
      mint: mintAddress,
      symbol: metadata.data.symbol.trim(),
      name: metadata.data.name.trim(),
      decimals,
      logoURI: metadata.data.uri || '',
      verified: false,
      tags: ['imported']
    };

    // Add to cached list
    const updatedTokens = [...cachedTokens, tokenInfo];
    cacheTokenList(updatedTokens);

    return tokenInfo;
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
    // Check blacklist first
    if (isBlacklisted(mintAddress)) {
      const reason = getBlacklistReason(mintAddress);
      return { valid: false, reason: `Token is blacklisted: ${reason}` };
    }

    const validationResult = await validateToken(connection, mintAddress);
    return {
      valid: validationResult.isValid,
      reason: validationResult.errors[0]
    };
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}