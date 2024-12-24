import { useTokenList } from './useTokenList';
import { TokenInfo } from '@/types/token';

export const useTokenUtils = () => {
  const { data: tokens } = useTokenList();

  const getTokenBySymbol = (symbol: string): TokenInfo | undefined => {
    return tokens?.find(token => token.symbol === symbol);
  };

  return {
    getTokenBySymbol
  };
};