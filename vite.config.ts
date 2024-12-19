import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
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
      target: 'esnext',
      supported: { 
        bigint: true 
      },
      define: {
        global: 'globalThis'
      },
    },
    include: ['@jup-ag/core'],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: mode === 'production',
    cssMinify: mode === 'production',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            '@jup-ag/core'
          ]
        }
      }
    }
  }
}));