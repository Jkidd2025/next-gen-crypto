import { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { getTokenMetadata } from "@/lib/swap/token-import";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Loader2 } from "lucide-react";
import { isValidMintAddress } from "@/lib/swap/tokens";

export const TokenImport = () => {
  const { connection } = useConnection();
  const { toast } = useToast();
  const [mintAddress, setMintAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImportToken = async () => {
    if (!mintAddress) {
      setError("Please enter a token address");
      return;
    }

    if (!isValidMintAddress(mintAddress)) {
      setError("Invalid token address format");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenMetadata = await getTokenMetadata(connection, mintAddress);
      
      if (!tokenMetadata) {
        throw new Error("Token metadata not found");
      }
      
      toast({
        title: "Token imported successfully",
        description: `Imported ${tokenMetadata.symbol} (${tokenMetadata.name})`,
      });
      
      setMintAddress("");
      // You can add additional handling here, like updating a token list
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to import token";
      setError(errorMessage);
      toast({
        title: "Failed to import token",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="mintAddress" className="text-sm font-medium">
          Token Address
        </label>
        <div className="flex gap-2">
          <Input
            id="mintAddress"
            placeholder="Enter token mint address"
            value={mintAddress}
            onChange={(e) => {
              setMintAddress(e.target.value);
              setError(null);
            }}
            className={error ? "border-destructive" : ""}
          />
          <Button 
            onClick={handleImportToken}
            disabled={isLoading || !mintAddress}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
};