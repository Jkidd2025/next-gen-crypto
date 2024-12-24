import React from "react";
import { logError } from '@/services/logging/logger';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BaseError } from "@/types/errors";

interface Props {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails = {
      type: error instanceof BaseError ? error.type : 'UNKNOWN',
      code: error instanceof BaseError ? error.code : 'UNKNOWN_ERROR',
      componentStack: errorInfo.componentStack,
      timestamp: Date.now()
    };

    logError(error, {
      context: 'error_boundary',
      ...errorDetails
    });

    this.setState({ errorInfo });
  }

  public resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private getErrorMessage(): string {
    const { error } = this.state;
    if (!error) return "An unexpected error occurred";
    
    if (error instanceof BaseError) {
      return `${error.message} (${error.code})`;
    }
    
    return error.message || "An unexpected error occurred";
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.FallbackComponent) {
        return <this.props.FallbackComponent 
          error={this.state.error!} 
          resetErrorBoundary={this.resetErrorBoundary}
        />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-md">
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                {this.getErrorMessage()}
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <Button
                onClick={this.resetErrorBoundary}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}