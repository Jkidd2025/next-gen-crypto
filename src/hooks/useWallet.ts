import { useWalletConnection } from './useWalletConnection';
import { useWalletEvents } from './useWalletEvents';
import { useEffect } from 'react';

export const useWallet = () => {
  const {
    account,
    isConnecting,
    connect,
    disconnect,
    checkIfWalletIsConnected
  } = useWalletConnection();

  useWalletEvents(account => {
    if (account !== null) {
      checkIfWalletIsConnected();
    }
  });

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  return {
    account,
    isConnecting,
    connect,
    disconnect,
  };
};