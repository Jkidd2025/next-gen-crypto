export const RPC_CONFIG = {
  ENDPOINTS: [
    {
      url: import.meta.env.VITE_PRIMARY_RPC_URL || 'https://api.mainnet-beta.solana.com',
      weight: 1,
    },
    {
      url: import.meta.env.VITE_BACKUP_RPC_URL || 'https://solana-api.projectserum.com',
      weight: 2,
    },
    {
      url: import.meta.env.VITE_FALLBACK_RPC_URL || 'https://rpc.ankr.com/solana',
      weight: 3,
    },
  ],
  TIMEOUT: Number(import.meta.env.VITE_CONNECTION_TIMEOUT) || 30000,
  MAX_RETRIES: Number(import.meta.env.VITE_MAX_RETRIES) || 3,
  RATE_LIMIT: {
    MAX_REQUESTS: Number(import.meta.env.VITE_RATE_LIMIT_REQUESTS) || 100,
    TIME_WINDOW: Number(import.meta.env.VITE_RATE_LIMIT_WINDOW) || 60000,
  },
};