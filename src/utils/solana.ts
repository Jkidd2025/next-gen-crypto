import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

// Use devnet for development, change to mainnet-beta for production
const SOLANA_NETWORK = 'devnet';
const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');

export const getSolanaConnection = () => connection;

export const getAccountBalance = async (publicKey: string): Promise<number> => {
  try {
    const pubKey = new PublicKey(publicKey);
    const balance = await connection.getBalance(pubKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

export const sendTransaction = async (
  transaction: Transaction,
  wallet: any // Replace 'any' with your wallet type
): Promise<string> => {
  try {
    if (!wallet.publicKey) throw new Error('Wallet not connected');

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);

    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

export const transferSOL = async (
  wallet: any, // Replace 'any' with your wallet type
  recipient: string,
  amount: number
): Promise<string> => {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(recipient),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    return await sendTransaction(transaction, wallet);
  } catch (error) {
    console.error('Error transferring SOL:', error);
    throw error;
  }
};