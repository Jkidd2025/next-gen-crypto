import { Jupiter } from '@jup-ag/core';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSwapTransactions = () => {
  const { publicKey, signTransaction } = useWallet();
  const { toast } = useToast();
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  const setupJupiter = async () => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    return await Jupiter.load({
      connection,
      cluster: 'mainnet-beta',
      user: publicKey
    });
  };

  const getTokenDecimals = async (mintAddress: string): Promise<number> => {
    try {
      const { data: tokens } = await supabase
        .from('tokens')
        .select('decimals')
        .eq('mint_address', mintAddress)
        .single();
      
      return tokens?.decimals || 9; // Default to 9 (SOL) if not found
    } catch (error) {
      console.error('Error fetching token decimals:', error);
      return 9; // Default to 9 (SOL) decimals
    }
  };

  const handleSwap = async (
    fromToken: string,
    toToken: string,
    fromAmount: string,
    toAmount: string,
    slippage: number,
    userId: string
  ) => {
    try {
      if (!publicKey || !signTransaction) {
        throw new Error('Wallet not connected');
      }

      const jupiter = await setupJupiter();
      const inputDecimals = await getTokenDecimals(fromToken);
      
      // Get routes
      const routes = await jupiter.computeRoutes({
        inputMint: new PublicKey(fromToken),
        outputMint: new PublicKey(toToken),
        amount: parseFloat(fromAmount) * Math.pow(10, inputDecimals),
        slippageBps: Math.floor(slippage * 100),
      });

      if (!routes.routesInfos.length) {
        throw new Error('No routes found for swap');
      }

      // Execute swap with best route
      const { execute } = await jupiter.exchange({
        routeInfo: routes.routesInfos[0],
      });

      const swapResult = await execute();

      if ('error' in swapResult) {
        throw new Error(swapResult.error);
      }

      // Store the transaction in Supabase
      await supabase.from("swap_transactions").insert({
        user_id: userId,
        from_token: fromToken,
        to_token: toToken,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        slippage: slippage,
        status: "completed",
        gas_fee: 0, // Jupiter handles fees dynamically
        swap_route: routes.routesInfos[0].marketInfos.map(m => ({
          label: m.label,
          inputMint: m.inputMint.toString(),
          outputMint: m.outputMint.toString()
        }))
      });

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      });

      return swapResult.txid;
    } catch (error) {
      console.error('Error executing swap:', error);
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "There was an error processing your swap",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleSwap,
    gasFee: 0, // Jupiter handles fees dynamically
  };
};