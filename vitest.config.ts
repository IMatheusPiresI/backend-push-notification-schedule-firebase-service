import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './',
    include: ['./src/**/*.spec.ts'],
    exclude: ['**/*e2e.spec.ts', 'node_modules', 'dist'],
  },
  plugins: [
    swc.vite({
      module: {
        type: 'es6',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: false,
});
