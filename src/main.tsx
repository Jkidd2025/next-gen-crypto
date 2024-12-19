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

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const root = document.getElementById("root");

if (!root) {
  console.error("Root element not found in the DOM");
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
  console.log("Application mounted successfully");
} catch (error) {
  console.error("Critical error mounting application:", error);
  // Display error to user
  root.innerHTML = `
    <div style="padding: 20px; color: red;">
      An error occurred while loading the application. Please check the console for details.
    </div>
  `;
}