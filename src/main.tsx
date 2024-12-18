import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

console.log("Initializing application...");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        },
      },
    },
  },
})

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

console.log("Creating React root...");

try {
  const app = (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  console.log("Mounting application...");
  createRoot(root).render(app);
} catch (error) {
  console.error("Error mounting application:", error);
}