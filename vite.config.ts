import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "stream": "stream-browserify",
      "crypto": "crypto-browserify",
      "http": "stream-http",
      "https": "https-browserify",
      "os": "os-browserify/browser",
      "process": "process/browser",
      "events": "events"
    },
    mainFields: ['browser', 'module', 'main']
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: { 
        bigint: true 
      },
      define: {
        global: 'globalThis'
      },
    },
    include: [
      '@jup-ag/core',
      '@solana/web3.js',
      'react',
      'react-dom',
      '@tanstack/react-query'
    ]
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: false,
    cssMinify: false,
    chunkSizeWarningLimit: 1600,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['@jup-ag/common'],
      output: {
        globals: {
          '@jup-ag/common': 'JupiterCommon'
        },
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            '@solana/web3.js',
            '@jup-ag/core'
          ]
        }
      }
    }
  }
});