import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

export const connection = new Connection(SOLANA_RPC_URL);

export const createSwapTransaction = async (
  fromWallet: string,
  toToken: string,
  amount: number,
  slippage: number
): Promise<Transaction> => {
  try {
    const fromPubkey = new PublicKey(fromWallet);
    const toPubkey = new PublicKey(toToken);
    
    // For now, we'll implement a simple SOL transfer
    // In production, this should be replaced with actual DEX integration
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    transaction.feePayer = fromPubkey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    return transaction;
  } catch (error) {
    console.error('Error creating swap transaction:', error);
    throw new Error('Failed to create swap transaction');
  }
};

export const getTokenBalance = async (
  walletAddress: string,
  tokenMint?: string
): Promise<number> => {
  try {
    if (!tokenMint) {
      // Get SOL balance
      const balance = await connection.getBalance(new PublicKey(walletAddress));
      return balance / LAMPORTS_PER_SOL;
    }

    // Get SPL token balance
    const tokenAccount = await getAssociatedTokenAddress(
      new PublicKey(tokenMint),
      new PublicKey(walletAddress)
    );
    
    const balance = await connection.getTokenAccountBalance(tokenAccount);
    return Number(balance.value.amount) / Math.pow(10, balance.value.decimals);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
};