export const RPC_CONFIG = {
  ENDPOINTS: [
    {
      url: import.meta.env.VITE_PRIMARY_RPC_URL || 'https://api.mainnet-beta.solana.com',
      weight: 1,
    },
    {
      url: 'https://solana-api.projectserum.com',
      weight: 2,
    },
    {
      url: 'https://rpc.ankr.com/solana',
      weight: 3,
    },
  ],
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    TIME_WINDOW: 60000, // 1 minute
  },
};