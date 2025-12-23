<template>
  <div class="theme-switcher">
    <h3 class="theme-switcher__title">Выбор темы (демо)</h3>
    <p class="theme-switcher__description">
      В финальной версии тема будет загружаться с бэкенда
    </p>
    
    <div 
      class="theme-switcher__grid"
      role="group"
      aria-label="Выбор цветовой темы"
    >
      <button
        v-for="preset in presets"
        :key="preset"
        :class="[
          'theme-button',
          { 'theme-button--active': currentPreset === preset }
        ]"
        :aria-label="`Выбрать тему ${getThemeLabel(preset)}`"
        :aria-pressed="currentPreset === preset"
        type="button"
        @click="selectTheme(preset)"
      >
        <div class="theme-button__preview" :data-theme="preset" aria-hidden="true"></div>
        <span class="theme-button__label">{{ getThemeLabel(preset) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/app/stores/theme'
import type { ThemePreset } from '@/shared/types/theme'
import { getAvailablePresets } from '@/shared/api/theme-data'

const themeStore = useThemeStore()
const presets = getAvailablePresets()
const currentPreset = computed(() => themeStore.currentPreset)

const selectTheme = (preset: ThemePreset) => {
  themeStore.applyPreset(preset)
}

const getThemeLabel = (preset: ThemePreset): string => {
  const labels: Record<ThemePreset, string> = {
    light: 'Светлая',
    dark: 'Темная',
    blue: 'Океан',
    green: 'Эко'
  }
  return labels[preset]
}
</script>

<style scoped>
.theme-switcher {
  background: var(--color-bg);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.theme-switcher__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.theme-switcher__description {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
}

.theme-switcher__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.theme-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.theme-button:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.theme-button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-color: var(--color-primary);
}

.theme-button--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.theme-button__preview {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.theme-button__preview[data-theme="light"] {
  background: linear-gradient(135deg, #4F46E5 0%, #8B5CF6 50%, #E0E7FF 100%);
}

.theme-button__preview[data-theme="dark"] {
  background: linear-gradient(135deg, #0F0A1E 0%, #A78BFA 50%, #F472B6 100%);
}

.theme-button__preview[data-theme="blue"] {
  background: linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #CFFAFE 100%);
}

.theme-button__preview[data-theme="green"] {
  background: linear-gradient(135deg, #059669 0%, #84CC16 50%, #D1FAE5 100%);
}

.theme-button__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}
</style>
