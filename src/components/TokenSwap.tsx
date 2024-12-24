import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";

export const TokenSwap = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Under Maintenance</AlertTitle>
        <AlertDescription>
          The token swap feature is currently being rebuilt to provide you with a better experience.
        </AlertDescription>
      </Alert>
    </div>
  );
};