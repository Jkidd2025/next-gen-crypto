import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-inline' 'unsafe-eval';"
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "stream": "stream-browserify",
      "crypto": "crypto-browserify",
      "http": "stream-http",
      "https": "https-browserify",
      "os": "os-browserify/browser",
      "process": "process/browser",
      "events": "events",
      "vm": "vm-browserify"
    },
    mainFields: ['browser', 'module', 'main'],
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
    },
    include: ['@jup-ag/core'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['@jup-ag/common'],
      output: {
        format: 'es',
        globals: {
          '@jup-ag/common': 'JupiterCommon'
        }
      }
    }
  }
}));