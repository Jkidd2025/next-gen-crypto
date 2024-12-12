import { useEffect } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { useWalletEvents } from './useWalletEvents';

export const useWallet = () => {
  const {
    account,
    isConnecting,
    connect,
    disconnect,
    checkIfWalletIsConnected,
    setAccount
  } = useWalletConnection();

  useWalletEvents(setAccount);

  useEffect(() => {
    console.log("Checking wallet connection...");
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  return {
    account,
    isConnecting,
    connect,
    disconnect,
  };
};