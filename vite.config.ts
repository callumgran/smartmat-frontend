/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    deps: {
      inline: ['vuetify'],
    },
    globals: true,
    coverage: {
      provider: 'c8',
      all: true,
      include: [
        '**/src/components/**',
        '**/src/stores/**',
        '**/src/views/**',
        '**/src/router/**',
        '**/src/utils/**',
      ],
    },
  },
});
