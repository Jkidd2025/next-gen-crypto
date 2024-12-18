import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/",  // Ensure proper base URL
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
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['@jup-ag/common'],
      output: {
        format: 'es',
        globals: {
          '@jup-ag/common': 'JupiterCommon'
        },
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      }
    }
  }
}));