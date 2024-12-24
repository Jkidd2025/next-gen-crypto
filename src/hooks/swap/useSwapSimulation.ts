import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6";

interface SimulationResponse {
  success: boolean;
  error?: string;
  logs?: string[];
}

export const useSwapSimulation = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const simulateTransaction = async (
    inputMint: string,
    outputMint: string,
    amount: string,
    slippage: number
  ): Promise<SimulationResponse> => {
    if (!publicKey) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    try {
      // Get quote first
      const quoteResponse = await fetch(
        `${JUPITER_SWAP_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippage * 100}`
      );
      const quote = await quoteResponse.json();

      // Get swap transaction
      const swapResponse = await fetch(`${JUPITER_SWAP_API}/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toString(),
          wrapUnwrapSOL: true,
        }),
      });

      const swapData = await swapResponse.json();
      const transaction = Transaction.from(
        Buffer.from(swapData.swapTransaction, "base64")
      );

      // Simulate the transaction
      const simulation = await connection.simulateTransaction(transaction);

      return {
        success: simulation.value.err === null,
        logs: simulation.value.logs,
        error: simulation.value.err?.toString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  return { simulateTransaction };
};