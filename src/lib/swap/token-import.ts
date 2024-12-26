import { Connection, PublicKey } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { TokenInfo, ImportedTokenInfo } from '@/types/token-swap';
import { toast } from '@/hooks/use-toast';
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
    const cachedTokens = getCachedTokenList();
    if (cachedTokens) {
      const existingToken = cachedTokens.find(
        t => t.mint.toLowerCase() === mintAddress.toLowerCase()
      );
      if (existingToken) {
        toast({
          title: "Token already exists",
          description: `${existingToken.symbol} is already in your token list`,
        });
        return { ...existingToken, status: 'existing' };
      }
    }

    // Validate token before import
    const validation = await validateImportedToken(connection, mintAddress);
    if (!validation.valid) {
      toast({
        title: "Invalid token",
        description: validation.reason || "Failed to validate token",
        variant: "destructive",
      });
      return null;
    }

    // Fetch token metadata
    const mintPubkey = new PublicKey(mintAddress);
    const metadataPDA = await Metadata.getPDA(mintPubkey);
    const metadata = await Metadata.fromAccountAddress(connection, metadataPDA);
    
    if (!metadata) {
      throw new Error('Token metadata not found');
    }

    // Get token supply and decimals
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
    if (!mintInfo.value?.data || typeof mintInfo.value.data !== 'object') {
      throw new Error('Invalid mint info');
    }

    const { decimals } = (mintInfo.value.data as any).parsed.info;

    // Create token info
    const newToken: TokenInfo = {
      mint: mintAddress,
      symbol: metadata.data.symbol.trim(),
      name: metadata.data.name.trim(),
      decimals,
      logoURI: metadata.data.uri || '',
      verified: false,
      tags: ['imported'],
      balance: 0,
      usdPrice: 0
    };

    // Add to cached list
    const currentTokens = cachedTokens || [];
    const updatedTokens = [...currentTokens, newToken];
    cacheTokenList(updatedTokens);

    toast({
      title: "Token imported successfully",
      description: `${newToken.symbol} has been added to your token list`,
    });

    return { ...newToken, status: 'imported' };
  } catch (error) {
    console.error('Error importing token:', error);
    toast({
      title: "Failed to import token",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
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