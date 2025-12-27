import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import { useThemeStore } from './app/stores/theme'
import { useProductsStore } from './app/stores/products'
import './app/styles/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize stores before mounting the app
// Load theme settings and products in parallel
const themeStore = useThemeStore()
const productsStore = useProductsStore()

Promise.all([
  themeStore.loadSettings(),
  productsStore.loadProducts()
]).then(() => {
  app.mount('#app')
}).catch((error) => {
  console.error('Failed to initialize app:', error)
  // Mount app anyway with fallback data
  app.mount('#app')
})
