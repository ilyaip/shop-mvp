import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import { useThemeStore } from './app/stores/theme'
import './app/styles/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize theme before mounting the app
const themeStore = useThemeStore()
themeStore.loadSettings().then(() => {
  app.mount('#app')
})
