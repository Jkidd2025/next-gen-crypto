import { TokenMetadata, TokenBalance } from "./types";
import { COMMON_TOKENS } from "@/constants/tokens";
import JSBI from "jsbi";

/**
 * Converts a human-readable token amount to base units (lamports/wei)
 */
export const convertToBaseUnits = (
  amount: string,
  decimals: number
): string => {
  try {
    if (!amount) return "0";
    
    // Remove any commas from the input
    const cleanAmount = amount.replace(/,/g, "");
    
    // Split on decimal point
    const [whole, fraction = ""] = cleanAmount.split(".");
    
    // Pad with zeros or truncate fraction to match decimals
    const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
    
    // Combine whole and fraction, remove leading zeros
    const combinedAmount = `${whole}${paddedFraction}`.replace(/^0+/, "");
    
    return combinedAmount || "0";
  } catch (error) {
    console.error("Error converting to base units:", error);
    return "0";
  }
};

/**
 * Converts base units (lamports/wei) to human-readable format
 */
export const convertFromBaseUnits = (
  amount: string,
  decimals: number
): string => {
  try {
    if (!amount) return "0";

    const amountStr = amount.padStart(decimals + 1, "0");
    const decimalIndex = amountStr.length - decimals;
    
    const whole = amountStr.slice(0, decimalIndex);
    const fraction = amountStr.slice(decimalIndex).replace(/0+$/, "");
    
    return fraction ? `${whole}.${fraction}` : whole;
  } catch (error) {
    console.error("Error converting from base units:", error);
    return "0";
  }
};

/**
 * Formats a token balance for display
 */
export const formatTokenBalance = (balance: TokenBalance): string => {
  const amount = convertFromBaseUnits(balance.amount, balance.decimals);
  return parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: balance.decimals
  });
};

/**
 * Gets token metadata by symbol
 */
export const getTokenMetadata = (symbol: string): TokenMetadata | undefined => {
  const token = COMMON_TOKENS[symbol as keyof typeof COMMON_TOKENS];
  return token ? {
    symbol: token.symbol,
    address: token.address,
    decimals: token.decimals,
    name: token.name
  } : undefined;
};

/**
 * Validates if an amount string is a valid token amount
 */
export const isValidTokenAmount = (amount: string): boolean => {
  if (!amount) return false;
  
  // Remove commas and check format
  const cleanAmount = amount.replace(/,/g, "");
  return /^\d*\.?\d*$/.test(cleanAmount) && parseFloat(cleanAmount) >= 0;
};