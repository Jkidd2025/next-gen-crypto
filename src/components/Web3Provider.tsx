import { createContext, useContext } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Web3ContextType } from '@/types/web3';

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnecting: false,
  connect: async () => {},
  disconnect: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet();

  return (
    <Web3Context.Provider value={wallet}>
      {children}
    </Web3Context.Provider>
  );
};