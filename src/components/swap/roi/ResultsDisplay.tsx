interface ResultsDisplayProps {
  currentPrice: number;
  tokenAmount: number | null;
  estimatedReturns: number | null;
  investment: string;
}

export const ResultsDisplay = ({ 
  currentPrice, 
  tokenAmount, 
  estimatedReturns, 
  investment 
}: ResultsDisplayProps) => {
  if (!estimatedReturns || !tokenAmount) return null;

  return (
    <div className="pt-4 border-t">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Token Amount</p>
        <p className="text-lg font-semibold">
          {tokenAmount.toLocaleString()} tokens
        </p>
        
        <p className="text-sm text-muted-foreground">Estimated Returns</p>
        <p className="text-2xl font-bold text-primary">
          ${estimatedReturns.toFixed(2)}
        </p>
        <p className="text-sm text-muted-foreground">
          Potential profit: ${(estimatedReturns - parseFloat(investment)).toFixed(2)}
        </p>
      </div>
    </div>
  );
};