export interface Token {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
  logoURI?: string;
}

export interface TokenPair {
  from: Token;
  to: Token;
}