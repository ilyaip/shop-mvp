import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  // Base URL for GitHub Pages - update 'shop-mvp' to your repository name
  base: process.env.NODE_ENV === 'production' ? '/shop-mvp/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@/pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@/widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
      '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@/entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
      '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI components chunk
          'ui-components': [
            './src/shared/ui/Button.vue',
            './src/shared/ui/Card.vue',
            './src/shared/ui/Input.vue',
            './src/shared/ui/Modal.vue',
            './src/shared/ui/Skeleton.vue',
            './src/shared/ui/Notification.vue'
          ],
          // Entities chunk
          'entities': [
            './src/entities/product/ui/ProductCard.vue',
            './src/entities/cart/ui/CartItem.vue',
            './src/entities/order/ui/OrderCard.vue'
          ]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'esbuild',
    // Source maps for production debugging (optional)
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})
