import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: ['.blink.new'],
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});