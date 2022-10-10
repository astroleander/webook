import { defineConfig } from 'vite';
// plugins - lib
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import solid from 'vite-plugin-solid';
// plugins - custom
import { consolePathsPrintPlugin } from './plugins';
// system

import { input_folders } from './utils';
import { OUT_DIR, ROOT } from '../shared.config';
import { svelte } from '@sveltejs/vite-plugin-svelte';


// blocked by https://github.com/vitejs/vite/issues/6921
// blocked by https://github.com/vitejs/vite/pull/6202

// https://vitejs.dev/config/
export default defineConfig({
  root: ROOT,
  define: {
    __BUILD__: JSON.stringify("vite"),
    global: 'window' // for react-native-web
  },
  resolve: {
    alias: {
      // '@/': path.resolve('./src'),
      'react-native': 'react-native-web', // ref https://github.com/vitejs/vite/discussions/8195#discussioncomment-3053838
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
    // templates
    vue(),
    svelte(),
    // tsx
    react({
      babel: {
        configFile: true,
      }
    }),
    solid({
      // temprary solution util I can make plugin-react.exclude working
      extensions: ['.solid'],
    }),
    // custom
    consolePathsPrintPlugin(),
  ],
  server: {
    watch: {
    
    }
  }
});