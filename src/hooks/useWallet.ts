import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useWallet = () => {
  const { 
    connected,
    connecting,
    disconnect: walletDisconnect,
    connect: walletConnect,
    publicKey,
    wallet 
  } = useSolanaWallet();
  
  const { toast } = useToast();

  const connect = useCallback(async () => {
    if (!wallet) {
      toast({
        title: "No Wallet Found",
        description: "Please install a Solana wallet extension",
        variant: "destructive",
      });
      return;
    }

    try {
      await walletConnect();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  }, [wallet, walletConnect, toast]);

  const disconnect = useCallback(async () => {
    try {
      await walletDisconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  }, [walletDisconnect, toast]);

  return {
    connected,
    connecting,
    publicKey,
    wallet,
    connect,
    disconnect
  };
};