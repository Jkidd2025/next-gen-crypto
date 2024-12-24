import { Connection, PublicKey } from '@solana/web3.js';
import { COMMON_TOKENS } from '@/constants/tokens';

export const checkBalance = async (
  connection: Connection,
  publicKey: PublicKey,
  token: string,
  amount: number
): Promise<boolean> => {
  try {
    if (token === COMMON_TOKENS.SOL.address) {
      const balance = await connection.getBalance(publicKey);
      return balance >= amount * 1e9;
    }

    const tokenBalance = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { mint: new PublicKey(token) }
    );

    if (tokenBalance.value.length === 0) return false;
    
    const balance = tokenBalance.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return balance >= amount;
  } catch (error) {
    console.error('Error checking balance:', error);
    throw new Error('Failed to check balance');
  }
};