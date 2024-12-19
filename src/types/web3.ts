export interface Web3ContextType {
  account: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey: { toString: () => string };
      signTransaction: (transaction: any) => Promise<any>;
      sendTransaction: (transaction: any, connection?: any) => Promise<string>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    };
  }
}