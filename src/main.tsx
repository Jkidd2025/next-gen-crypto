import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
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

// Global error handlers with more detailed logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  console.error('Error details:', {
    message: event.error.message,
    stack: event.error.stack,
    type: event.type,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  console.error('Rejection details:', {
    message: event.reason.message,
    stack: event.reason.stack,
  });
});

const root = document.getElementById("root");

if (!root) {
  console.error("Root element not found in the DOM");
  throw new Error("Root element not found");
}

console.log("Creating React root...");

try {
  const app = (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );

  console.log("Mounting application...");
  const rootInstance = createRoot(root);
  rootInstance.render(app);
  console.log("Application mounted successfully");
} catch (error) {
  console.error("Critical error mounting application:", error);
  // Display error to user with more details
  root.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1 style="color: #ef4444; margin-bottom: 16px;">Application Error</h1>
      <p style="color: #374151; margin-bottom: 16px;">
        An error occurred while loading the application. Please check the console for details.
      </p>
      <button onclick="window.location.reload()" style="
        background-color: #3b82f6;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
      ">
        Reload Application
      </button>
    </div>
  `;
}