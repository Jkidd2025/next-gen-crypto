import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const TokenSwap = () => {
  return (
    <div className="py-20 bg-gray-50" id="swap">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Swap Tokens</h2>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">From (SOL)</label>
              <Input type="number" placeholder="0.0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To (MEME)</label>
              <Input type="number" placeholder="0.0" readOnly />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Connect Wallet to Swap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};