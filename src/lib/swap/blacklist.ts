import { PublicKey } from '@solana/web3.js';

interface BlacklistEntry {
  address: string;
  reason: string;
  addedAt: number;
}

const BLACKLIST_STORAGE_KEY = 'tokenBlacklist';

// Built-in blacklist
const BUILT_IN_BLACKLIST = new Set([
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Token Program ID (not a token)
  // Add more known malicious tokens here
]);

export function getBlacklist(): BlacklistEntry[] {
  try {
    const stored = localStorage.getItem(BLACKLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToBlacklist(address: string, reason: string): void {
  try {
    // Validate address
    new PublicKey(address);
    
    const blacklist = getBlacklist();
    if (!blacklist.some(entry => entry.address === address)) {
      blacklist.push({
        address,
        reason,
        addedAt: Date.now()
      });
      localStorage.setItem(BLACKLIST_STORAGE_KEY, JSON.stringify(blacklist));
    }
  } catch (error) {
    console.error('Error adding to blacklist:', error);
    throw new Error('Invalid token address');
  }
}

export function removeFromBlacklist(address: string): void {
  const blacklist = getBlacklist();
  const filtered = blacklist.filter(entry => entry.address !== address);
  localStorage.setItem(BLACKLIST_STORAGE_KEY, JSON.stringify(filtered));
}

export function isBlacklisted(address: string): boolean {
  if (BUILT_IN_BLACKLIST.has(address)) {
    return true;
  }
  
  const blacklist = getBlacklist();
  return blacklist.some(entry => entry.address === address);
}

export function getBlacklistReason(address: string): string | null {
  if (BUILT_IN_BLACKLIST.has(address)) {
    return 'Built-in blacklist: Known malicious token';
  }
  
  const blacklist = getBlacklist();
  const entry = blacklist.find(entry => entry.address === address);
  return entry ? entry.reason : null;
}