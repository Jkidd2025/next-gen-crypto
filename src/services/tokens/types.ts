import { TokenSymbol } from "@/constants/tokens";

export interface TokenMetadata {
  symbol: TokenSymbol;
  address: string;
  decimals: number;
  name: string;
  logoURI?: string;
}

export interface TokenBalance {
  amount: string;
  uiAmount: number;
  decimals: number;
}