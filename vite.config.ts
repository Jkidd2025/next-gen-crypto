import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
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
      '@jup-ag/common',
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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            '@solana/web3.js',
            '@jup-ag/core',
            '@jup-ag/common'
          ]
        }
      }
    }
  }
});