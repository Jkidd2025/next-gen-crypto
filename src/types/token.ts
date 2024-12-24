export type TokenSymbol = 'SOL' | 'USDC' | 'USDT';

export interface Token {
  symbol: TokenSymbol;
  address: string;
  decimals: number;
  name: string;
  logoURI?: string;
}

export interface TokenPair {
  from: Token;
  to: Token;
}

export interface MarketInfo {
  amm: {
    label: string;
  };
  inputMint: string;
  outputMint: string;
}

export interface Route {
  marketInfos: MarketInfo[];
}