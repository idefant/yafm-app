import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    checker({
      typescript: true,
      enableBuild: false,
      eslint: {
        lintCommand: 'eslint -c .eslintrc.json --ext .js,.jsx,.ts,.tsx src',
        dev: {
          logLevel: ['error'],
        },
      },
      stylelint: {
        lintCommand: 'stylelint "**/*.(s)?css"',
        dev: {
          logLevel: ['error'],
        },
      },
    }),
    svgr({ include: '**/*.svg?react', exclude: '' }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not availeable
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './src'),
      '#api': path.resolve(__dirname, './src/api'),
      '#components': path.resolve(__dirname, './src/components'),
      '#configs': path.resolve(__dirname, './src/configs'),
      '#data': path.resolve(__dirname, './src/data'),
      '#hooks': path.resolve(__dirname, './src/hooks'),
      '#modules': path.resolve(__dirname, './src/modules'),
      '#pages': path.resolve(__dirname, './src/pages'),
      '#schema': path.resolve(__dirname, './src/schema'),
      '#store': path.resolve(__dirname, './src/store'),
      '#templates': path.resolve(__dirname, './src/templates'),
      '#svg': path.resolve(__dirname, './src/svg'),
      '#types': path.resolve(__dirname, './src/types'),
      '#ui': path.resolve(__dirname, './src/ui'),
      '#utils': path.resolve(__dirname, './src/utils'),
      '#workers': path.resolve(__dirname, './src/workers'),
    },
  },
}));
