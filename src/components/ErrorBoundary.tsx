import React from "react";
import { logError } from '@/services/logging/logger';

interface Props {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, {
      context: 'error_boundary',
      componentStack: errorInfo.componentStack
    });
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.FallbackComponent) {
        return <this.props.FallbackComponent 
          error={this.state.error!} 
          resetErrorBoundary={this.resetErrorBoundary}
        />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              onClick={this.resetErrorBoundary}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}