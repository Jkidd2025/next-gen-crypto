import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      toast({
        title: "Web3 Wallet Required",
        description: "Please install MetaMask or another Web3 wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      toast({
        title: "Wallet Connected",
        description: "Your Web3 wallet has been successfully connected.",
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your Web3 wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    setAccount(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your Web3 wallet has been disconnected.",
    });
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return {
    account,
    isConnecting,
    connect,
    disconnect,
  };
};