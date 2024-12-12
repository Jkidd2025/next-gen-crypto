import { createContext, useContext, useState } from 'react';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { toast } from '@/hooks/use-toast';

type Web3ContextType = {
  account: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnecting: false,
  connect: async () => {},
  disconnect: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { isWalletConnected, publicKey, handleConnectWallet, handleDisconnectWallet } = usePhantomWallet();

  const connect = async () => {
    try {
      setIsConnecting(true);
      await handleConnectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Phantom wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await handleDisconnectWallet();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <Web3Context.Provider value={{
      account: isWalletConnected ? publicKey : null,
      isConnecting,
      connect,
      disconnect,
    }}>
      {children}
    </Web3Context.Provider>
  );
};