import { useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { formatWalletAddress } from '@/utils/walletUtils';

export const useWalletEvents = (
  setAccount: (account: string | null) => void
) => {
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toast({
          title: "Account Changed",
          description: `Connected to: ${formatWalletAddress(accounts[0])}`,
        });
      } else {
        setAccount(null);
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const handleDisconnect = () => {
      setAccount(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
        window.ethereum?.removeListener('disconnect', handleDisconnect);
      };
    }

    return undefined;
  }, [setAccount]);
};