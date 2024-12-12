import { useState, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { checkWalletAvailability, handleWalletError, formatWalletAddress } from '@/utils/walletUtils';

export const useWalletConnection = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const checkIfWalletIsConnected = useCallback(async () => {
    if (!checkWalletAvailability()) {
      setAccount(null);
      return;
    }

    try {
      const accounts = await window.ethereum!.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Found an authorized account:", accounts[0]);
      } else {
        console.log("No authorized account found");
        setAccount(null);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setAccount(null);
    }
  }, []);

  const connect = async () => {
    if (!checkWalletAvailability()) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum!.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected with address: ${formatWalletAddress(accounts[0])}`,
        });
      }
    } catch (error: any) {
      handleWalletError(error);
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    setAccount(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return {
    account,
    isConnecting,
    connect,
    disconnect,
    checkIfWalletIsConnected,
    setAccount
  };
};