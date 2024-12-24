export interface Web3ContextType {
  account: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}