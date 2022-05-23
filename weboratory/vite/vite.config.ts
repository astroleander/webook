import { defineConfig } from 'vite';
// plugins - lib
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue'
// plugins - custom
import { consolePathsPrintPlugin } from './plugins';
// system
import path from 'path';

import { input_folders } from './utils';
import { OUT_DIR, ROOT } from '../shared.config';

// https://vitejs.dev/config/
export default defineConfig({
  root: ROOT,
  define: {
    __BUILD__: JSON.stringify("vite"),
  },
  resolve: {
    alias: {
      // '@/': path.resolve('./src'),
    }
  },
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        ...input_folders,
      }
    }
  },
  plugins: [
    react(),
    vue(),
    consolePathsPrintPlugin(),
  ],
  server: {
    watch: {
    
    }
  }
});