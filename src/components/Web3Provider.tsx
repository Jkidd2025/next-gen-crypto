import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { Web3ContextType } from '@/types/web3';
import { toast } from '@/hooks/use-toast';

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnecting: false,
  connect: async () => {},
  disconnect: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const metamaskWallet = useWallet();
  const { isWalletConnected: isPhantomConnected, handleConnectWallet: connectPhantom } = usePhantomWallet();
  const [activeWallet, setActiveWallet] = useState<'metamask' | 'phantom' | null>(null);

  const handleConnect = async () => {
    try {
      // Try Phantom first
      await connectPhantom();
      setActiveWallet('phantom');
    } catch (phantomError) {
      console.log("Phantom connection failed, trying MetaMask...");
      try {
        await metamaskWallet.connect();
        setActiveWallet('metamask');
      } catch (metamaskError) {
        console.error("Both wallet connections failed:", { phantomError, metamaskError });
        toast({
          title: "Connection Failed",
          description: "Failed to connect to any wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDisconnect = async () => {
    if (activeWallet === 'metamask') {
      await metamaskWallet.disconnect();
    }
    setActiveWallet(null);
  };

  const isConnected = isPhantomConnected || !!metamaskWallet.account;
  const account = activeWallet === 'metamask' ? metamaskWallet.account : null;

  return (
    <Web3Context.Provider value={{
      account: isConnected ? (account || 'phantom-wallet') : null,
      isConnecting: metamaskWallet.isConnecting,
      connect: handleConnect,
      disconnect: handleDisconnect,
    }}>
      {children}
    </Web3Context.Provider>
  );
};