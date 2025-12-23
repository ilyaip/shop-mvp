/**
 * useTheme composable
 * Provides theme functionality to components
 * Initializes theme on mount and updates page title
 */

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/app/stores/theme'

export const useTheme = () => {
  const themeStore = useThemeStore()
  
  // Use storeToRefs to maintain reactivity when destructuring
  const { settings, colors, brand, hero, isLoading, currentPreset } = storeToRefs(themeStore)

  // Initialize theme when component mounts
  onMounted(async () => {
    // Load settings if not already loaded
    if (!themeStore.settings) {
      await themeStore.loadSettings()
    }

    // Update page title with brand name
    if (themeStore.brand) {
      themeStore.updatePageTitle(themeStore.brand.name)
    }
  })

  return {
    settings,
    colors,
    brand,
    hero,
    isLoading,
    applyPreset: themeStore.applyPreset,
    currentPreset,
  }
}
