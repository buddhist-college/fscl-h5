import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/h5/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    target: 'es2018',
    cssTarget: 'chrome61',
  },
  server: {
    port: 3000,
    proxy: {
      "/app": {
        target: 'https://www.fashuihd.org/',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  },
  preview: {
    host: '0.0.0.0',
  }
})
