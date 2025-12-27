/**
 * Theme store
 * Manages dynamic theming with settings loaded from API
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FrontSettings, ThemePreset, ThemeColors } from '@/shared/types/theme'
import { fetchSiteSettings } from '@/shared/api/site-settings'
import { getPresetTheme } from '@/shared/api/theme-data'

export const useThemeStore = defineStore('theme', () => {
  // State
  const settings = ref<FrontSettings | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPreset = ref<ThemePreset>('light')

  // Computed
  const colors = computed(() => settings.value?.colors)
  const brand = computed(() => settings.value?.brand)
  const hero = computed(() => settings.value?.hero)

  // Actions

  /**
   * Load theme settings from API
   * Falls back to default light theme on error
   * 
   * Requirements:
   * - 5.1: Use fetchSiteSettings API instead of mock data
   * - 5.2: Apply theme through applyTheme on success
   * - 5.3: Apply default light theme on error
   * - 5.4: Set isLoading: true before request
   * - 5.5: Set isLoading: false after request
   * - 5.6: Save error in state for debugging
   */
  const loadSettings = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Fetch settings from backend API
      const data = await fetchSiteSettings()
      settings.value = data
      applyTheme(data.colors)
    } catch (err) {
      // Save error for debugging
      error.value = err instanceof Error ? err.message : 'Failed to load settings'
      console.error('Failed to load theme settings:', err)
      // Fallback to default light theme
      applyPreset('light')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Apply theme colors by updating CSS variables on document root
   * @param colors - Theme colors to apply
   */
  const applyTheme = (colors: ThemeColors) => {
    const root = document.documentElement

    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-primary-hover', colors.primaryHover)
    root.style.setProperty('--color-primary-light', colors.primaryLight)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-secondary-hover', colors.secondaryHover)
    root.style.setProperty('--color-text', colors.text)
    root.style.setProperty('--color-text-light', colors.textLight)
    root.style.setProperty('--color-text-lighter', colors.textLighter)
    root.style.setProperty('--color-bg', colors.background)
    root.style.setProperty('--color-bg-secondary', colors.backgroundSecondary)
    root.style.setProperty('--color-bg-tertiary', colors.backgroundTertiary)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--color-border-light', colors.borderLight)
    root.style.setProperty('--color-success', colors.success)
    root.style.setProperty('--color-error', colors.error)
    root.style.setProperty('--color-warning', colors.warning)
    
    // Update glass effect based on theme brightness
    // Detect if theme is dark by checking background color brightness
    const isDark = isColorDark(colors.background)
    if (isDark) {
      root.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.85)')
    } else {
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.85)')
    }
  }
  
  /**
   * Check if a color is dark
   * @param color - Hex color string
   * @returns true if color is dark
   */
  const isColorDark = (color: string): boolean => {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    
    return luminance < 0.5
  }

  /**
   * Apply a preset theme (for demo/debugging)
   * @param preset - Theme preset to apply
   */
  const applyPreset = (preset: ThemePreset) => {
    currentPreset.value = preset
    const presetSettings = getPresetTheme(preset)
    settings.value = presetSettings
    applyTheme(presetSettings.colors)
  }

  /**
   * Update page title
   * @param title - New page title
   */
  const updatePageTitle = (title: string) => {
    document.title = title
  }

  return {
    // State
    settings,
    isLoading,
    error,
    currentPreset,
    // Computed
    colors,
    brand,
    hero,
    // Actions
    loadSettings,
    applyTheme,
    applyPreset,
    updatePageTitle,
  }
})
