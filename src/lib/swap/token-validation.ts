export function isValidMintAddress(address: string): boolean {
  try {
    // Basic validation for Solana addresses (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  } catch {
    return false;
  }
}