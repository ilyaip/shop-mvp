# Документ дизайна: Система динамической темизации и улучшения UI/UX

## Обзор

Система динамической темизации превращает Vue E-commerce приложение в конструктор интернет-магазинов, где все визуальные настройки управляются через API. Включает новую посадочную страницу, улучшенный UI с liquid glass эффектами в стиле Apple, и полностью кастомизируемую цветовую схему.

### Ключевые возможности

- Динамическое применение цветовых схем через CSS-переменные
- Настройка бренда (логотип, название, описание) с бэкенда
- Новая посадочная страница с hero-секцией
- Liquid glass эффекты (backdrop-filter, blur)
- Улучшенные карточки товаров с закругленными углами
- Упрощенные фильтры (только по цене)
- Переключатель тем для демо/отладки

## Архитектура

### Новые компоненты в FSD структуре

```
src/
├── app/
│   └── stores/
│       └── theme.ts              # Новый store для темизации
│
├── pages/
│   └── landing/
│       └── LandingPage.vue       # Новая посадочная страница
│
├── widgets/
│   └── theme-switcher/
│       ├── ui/
│       │   └── ThemeSwitcher.vue # Переключатель тем
│       └── index.ts
│
├── features/
│   └── apply-theme/
│       ├── model/
│       │   └── useTheme.ts       # Composable для применения темы
│       └── index.ts
│
└── shared/
    ├── api/
    │   └── theme-data.ts         # Моковые данные тем
    └── types/
        └── theme.ts              # Типы для темизации
```

## Компоненты и интерфейсы

### Типы данных

#### Theme Types (shared/types/theme.ts)

```typescript
export interface ThemeColors {
  primary: string
  primaryHover: string
  primaryLight: string
  secondary: string
  secondaryHover: string
  text: string
  textLight: string
  textLighter: string
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  border: string
  borderLight: string
  success: string
  error: string
  warning: string
}

export interface BrandSettings {
  name: string
  logo: string
  description: string
  tagline?: string
}

export interface HeroSettings {
  image: string
  title: string
  subtitle: string
  ctaText: string
}

export interface FrontSettings {
  colors: ThemeColors
  brand: BrandSettings
  hero: HeroSettings
}

export type ThemePreset = 'light' | 'dark' | 'blue' | 'green'
```

### Pinia Store

#### useThemeStore (app/stores/theme.ts)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FrontSettings, ThemePreset } from '@/shared/types/theme'
import { fetchThemeSettings, getPresetTheme } from '@/shared/api/theme-data'

export const useThemeStore = defineStore('theme', () => {
  const settings = ref<FrontSettings | null>(null)
  const isLoading = ref(false)
  const currentPreset = ref<ThemePreset>('light')

  const colors = computed(() => settings.value?.colors)
  const brand = computed(() => settings.value?.brand)
  const hero = computed(() => settings.value?.hero)

  // Загрузка настроек с API (моковые данные)
  const loadSettings = async () => {
    isLoading.value = true
    try {
      // Имитация API запроса
      const data = await fetchThemeSettings()
      settings.value = data
      applyTheme(data.colors)
    } catch (error) {
      console.error('Failed to load theme settings:', error)
      // Fallback на дефолтную тему
      applyPreset('light')
    } finally {
      isLoading.value = false
    }
  }

  // Применение цветовой схемы через CSS-переменные
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
  }

  // Применение предустановленной темы (для демо)
  const applyPreset = (preset: ThemePreset) => {
    currentPreset.value = preset
    const presetSettings = getPresetTheme(preset)
    settings.value = presetSettings
    applyTheme(presetSettings.colors)
  }

  // Обновление title страницы
  const updatePageTitle = (title: string) => {
    document.title = title
  }

  return {
    settings,
    isLoading,
    currentPreset,
    colors,
    brand,
    hero,
    loadSettings,
    applyTheme,
    applyPreset,
    updatePageTitle
  }
})
```

### Моковые данные

#### Theme Data (shared/api/theme-data.ts)

```typescript
import type { FrontSettings, ThemePreset } from '@/shared/types/theme'

// Дефолтная светлая тема
const lightTheme: FrontSettings = {
  colors: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryLight: '#DBEAFE',
    secondary: '#6B7280',
    secondaryHover: '#4B5563',
    text: '#111827',
    textLight: '#6B7280',
    textLighter: '#9CA3AF',
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B'
  },
  brand: {
    name: 'Modern Store',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
    description: 'Ваш источник качественных товаров и отличного сервиса',
    tagline: 'Качество, которому можно доверять'
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
    title: 'Добро пожаловать в Modern Store',
    subtitle: 'Откройте для себя коллекцию премиальных товаров',
    ctaText: 'Перейти в каталог'
  }
}

// Темная тема
const darkTheme: FrontSettings = {
  colors: {
    primary: '#60A5FA',
    primaryHover: '#3B82F6',
    primaryLight: '#1E3A8A',
    secondary: '#9CA3AF',
    secondaryHover: '#D1D5DB',
    text: '#F9FAFB',
    textLight: '#D1D5DB',
    textLighter: '#9CA3AF',
    background: '#111827',
    backgroundSecondary: '#1F2937',
    backgroundTertiary: '#374151',
    border: '#374151',
    borderLight: '#4B5563',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24'
  },
  brand: {
    name: 'Dark Store',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
    description: 'Премиальные товары в элегантном темном стиле',
    tagline: 'Элегантность в каждой детали'
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920',
    title: 'Добро пожаловать в Dark Store',
    subtitle: 'Премиальное качество в темном исполнении',
    ctaText: 'Исследовать каталог'
  }
}

// Синяя тема
const blueTheme: FrontSettings = {
  colors: {
    primary: '#0EA5E9',
    primaryHover: '#0284C7',
    primaryLight: '#E0F2FE',
    secondary: '#64748B',
    secondaryHover: '#475569',
    text: '#0F172A',
    textLight: '#64748B',
    textLighter: '#94A3B8',
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    success: '#14B8A6',
    error: '#EF4444',
    warning: '#F59E0B'
  },
  brand: {
    name: 'Ocean Store',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
    description: 'Свежесть и качество в каждом товаре',
    tagline: 'Глоток свежего воздуха'
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=1920',
    title: 'Добро пожаловать в Ocean Store',
    subtitle: 'Погрузитесь в мир качественных товаров',
    ctaText: 'Начать покупки'
  }
}

// Зеленая тема
const greenTheme: FrontSettings = {
  colors: {
    primary: '#10B981',
    primaryHover: '#059669',
    primaryLight: '#D1FAE5',
    secondary: '#6B7280',
    secondaryHover: '#4B5563',
    text: '#111827',
    textLight: '#6B7280',
    textLighter: '#9CA3AF',
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B'
  },
  brand: {
    name: 'Eco Store',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
    description: 'Экологичные товары для осознанной жизни',
    tagline: 'В гармонии с природой'
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
    title: 'Добро пожаловать в Eco Store',
    subtitle: 'Экологичный выбор для лучшего будущего',
    ctaText: 'Смотреть товары'
  }
}

const themes: Record<ThemePreset, FrontSettings> = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme
}

// Имитация API запроса
export const fetchThemeSettings = async (): Promise<FrontSettings> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // В реальном приложении здесь будет API запрос
  // const response = await fetch('/api/front-settings')
  // return response.json()
  
  return lightTheme
}

// Получение предустановленной темы
export const getPresetTheme = (preset: ThemePreset): FrontSettings => {
  return themes[preset]
}

// Получение всех доступных пресетов
export const getAvailablePresets = (): ThemePreset[] => {
  return Object.keys(themes) as ThemePreset[]
}
```

### Composable для темизации

#### useTheme (features/apply-theme/model/useTheme.ts)

```typescript
import { onMounted } from 'vue'
import { useThemeStore } from '@/app/stores/theme'

export const useTheme = () => {
  const themeStore = useThemeStore()

  // Инициализация темы при монтировании
  onMounted(async () => {
    if (!themeStore.settings) {
      await themeStore.loadSettings()
    }
    
    // Обновление title страницы
    if (themeStore.brand) {
      themeStore.updatePageTitle(themeStore.brand.name)
    }
  })

  return {
    settings: themeStore.settings,
    colors: themeStore.colors,
    brand: themeStore.brand,
    hero: themeStore.hero,
    isLoading: themeStore.isLoading,
    applyPreset: themeStore.applyPreset,
    currentPreset: themeStore.currentPreset
  }
}
```

### Компоненты

#### LandingPage (pages/landing/LandingPage.vue)

```vue
<template>
  <div class="landing-page">
    <section class="hero" :style="{ backgroundImage: `url(${hero?.image})` }">
      <div class="hero__overlay"></div>
      <div class="hero__content">
        <div class="hero__glass-card">
          <h1 class="hero__title">{{ hero?.title }}</h1>
          <p class="hero__subtitle">{{ hero?.subtitle }}</p>
          <Button 
            variant="primary" 
            class="hero__cta"
            @click="goToCatalog"
          >
            {{ hero?.ctaText }}
          </Button>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="features__grid">
          <div class="feature-card">
            <div class="feature-card__icon">🚀</div>
            <h3 class="feature-card__title">Быстрая доставка</h3>
            <p class="feature-card__text">Доставим ваш заказ в кратчайшие сроки</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">✨</div>
            <h3 class="feature-card__title">Качество</h3>
            <p class="feature-card__text">Только проверенные товары</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">💎</div>
            <h3 class="feature-card__title">Гарантия</h3>
            <p class="feature-card__text">Полная гарантия на все товары</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTheme } from '@/features/apply-theme'
import { Button } from '@/shared/ui'

const router = useRouter()
const { hero } = useTheme()

const goToCatalog = () => {
  router.push('/catalog')
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
}

.hero {
  position: relative;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: var(--spacing-xl);
}

.hero__glass-card {
  /* Liquid glass effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  animation: fadeInUp 0.8s ease-out;
}

.hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero__subtitle {
  font-size: var(--font-size-xl);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-xl);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero__cta {
  font-size: var(--font-size-lg);
  padding: var(--spacing-md) var(--spacing-2xl);
}

.features {
  padding: var(--spacing-3xl) var(--spacing-xl);
  background: var(--color-bg-secondary);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: var(--color-bg);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-card__icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.feature-card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.feature-card__text {
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero__title {
    font-size: var(--font-size-3xl);
  }
  
  .hero__subtitle {
    font-size: var(--font-size-lg);
  }
  
  .hero__glass-card {
    padding: var(--spacing-xl);
  }
}
</style>
```

#### ThemeSwitcher (widgets/theme-switcher/ui/ThemeSwitcher.vue)

```vue
<template>
  <div class="theme-switcher">
    <h3 class="theme-switcher__title">Выбор темы (демо)</h3>
    <p class="theme-switcher__description">
      В финальной версии тема будет загружаться с бэкенда
    </p>
    
    <div class="theme-switcher__grid">
      <button
        v-for="preset in presets"
        :key="preset"
        :class="[
          'theme-button',
          { 'theme-button--active': currentPreset === preset }
        ]"
        @click="selectTheme(preset)"
      >
        <div class="theme-button__preview" :data-theme="preset"></div>
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

.theme-button--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.theme-button__preview {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.theme-button__preview[data-theme="light"] {
  background: linear-gradient(135deg, #3B82F6 0%, #FFFFFF 100%);
}

.theme-button__preview[data-theme="dark"] {
  background: linear-gradient(135deg, #111827 0%, #60A5FA 100%);
}

.theme-button__preview[data-theme="blue"] {
  background: linear-gradient(135deg, #0EA5E9 0%, #E0F2FE 100%);
}

.theme-button__preview[data-theme="green"] {
  background: linear-gradient(135deg, #10B981 0%, #D1FAE5 100%);
}

.theme-button__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}
</style>
```

### Обновление существующих компонентов

#### AppHeader с liquid glass эффектом

```css
/* Добавить в widgets/header/ui/AppHeader.vue */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  
  /* Liquid glass effect */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  transition: all var(--transition-base);
}

/* Для темной темы */
@media (prefers-color-scheme: dark) {
  .app-header {
    background: rgba(17, 24, 39, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

#### ProductCard с улучшенным дизайном

```css
/* Обновить в entities/product/ui/ProductCard.vue */
.product-card {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.product-card__image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: var(--radius-xl); /* Увеличенное закругление */
  padding: var(--spacing-sm);
  transition: transform var(--transition-slow);
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__content {
  padding: var(--spacing-lg);
}
```

## Свойства корректности

*Свойство корректности - это характеристика или поведение, которое должно выполняться во всех допустимых сценариях работы системы.*


### Property 1: CSS variables update on theme change
*For any* theme colors object, when applied through `applyTheme`, all corresponding CSS variables should be updated on the document root element
**Validates: Requirements 1.3, 1.5**

### Property 2: Brand settings rendering
*For any* brand settings (name, logo, description), when loaded, the brand name should appear in the header and page title, the logo should be displayed in the header, and the description should appear on the landing page
**Validates: Requirements 2.2, 2.3, 2.4**

### Property 3: Hero settings rendering
*For any* hero settings, when loaded, the hero section should display the background image, title, and subtitle from the settings
**Validates: Requirements 3.2**

### Property 4: Theme preset application
*For any* theme preset selection, when applied, the system should update all CSS variables to match the preset's color scheme
**Validates: Requirements 7.3**

### Property 5: Active theme indication
*For any* active theme preset, the ThemeSwitcher should visually indicate which theme is currently active
**Validates: Requirements 7.4**

### Property 6: Mock data structure completeness
*For all* theme presets in mock data, each preset should contain complete FrontSettings with colors, brand, and hero objects
**Validates: Requirements 8.2**

## Обработка ошибок

### Стратегия обработки ошибок

1. **Загрузка настроек темы**
   - При ошибке загрузки применяется дефолтная светлая тема
   - Ошибка логируется в консоль
   - Приложение продолжает работать с fallback значениями

2. **Отсутствие настроек бренда**
   - Используются дефолтные значения: "Modern Store", placeholder логотип
   - Приложение остается функциональным

3. **Отсутствие hero изображения**
   - Используется градиентный фон как fallback
   - Текст остается читаемым

4. **Производительность backdrop-filter**
   - Проверка поддержки браузером
   - Fallback на обычный полупрозрачный фон для старых браузеров

### Граничные случаи

1. **Настройки не загружены**
   - Применяется дефолтная светлая тема
   - Показывается дефолтный бренд

2. **Некорректные цвета в настройках**
   - Валидация цветов перед применением
   - Fallback на дефолтные цвета при ошибке

3. **Отсутствие изображений**
   - Placeholder изображения
   - Градиентные фоны как альтернатива

## Стратегия тестирования

### Подход к тестированию

Проект использует двойной подход:

1. **Unit тесты** - проверяют конкретные примеры, граничные случаи
2. **Property-based тесты** - проверяют универсальные свойства

### Property-Based Testing

**Библиотека**: fast-check

**Конфигурация**:
- Минимум 100 итераций на property тест
- Формат тега: `Feature: vue-ecommerce-theming, Property {number}: {property_text}`

**Примеры property тестов**:

```typescript
// tests/properties/theme.property.test.ts
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { useThemeStore } from '@/app/stores/theme'
import type { ThemeColors } from '@/shared/types/theme'

describe('Theme Properties', () => {
  // Feature: vue-ecommerce-theming, Property 1: CSS variables update on theme change
  it('should update all CSS variables when theme is applied', () => {
    fc.assert(
      fc.property(
        fc.record({
          primary: fc.hexaString({ minLength: 7, maxLength: 7 }),
          secondary: fc.hexaString({ minLength: 7, maxLength: 7 }),
          background: fc.hexaString({ minLength: 7, maxLength: 7 }),
          text: fc.hexaString({ minLength: 7, maxLength: 7 })
          // ... other colors
        }),
        (colors) => {
          const store = useThemeStore()
          store.applyTheme(colors as ThemeColors)
          
          const root = document.documentElement
          expect(root.style.getPropertyValue('--color-primary')).toBe(colors.primary)
          expect(root.style.getPropertyValue('--color-secondary')).toBe(colors.secondary)
          expect(root.style.getPropertyValue('--color-bg')).toBe(colors.background)
          expect(root.style.getPropertyValue('--color-text')).toBe(colors.text)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Unit Testing

**Области покрытия**:
- useThemeStore (загрузка, применение, переключение тем)
- ThemeSwitcher компонент
- LandingPage компонент
- Обновленные компоненты (AppHeader, ProductCard)
- Утилиты темизации

**Примеры unit тестов**:

```typescript
// tests/unit/stores/theme.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/app/stores/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should load theme settings on initialization', async () => {
    const store = useThemeStore()
    
    await store.loadSettings()
    
    expect(store.settings).toBeDefined()
    expect(store.settings?.colors).toBeDefined()
    expect(store.settings?.brand).toBeDefined()
    expect(store.settings?.hero).toBeDefined()
  })

  it('should apply preset theme', () => {
    const store = useThemeStore()
    
    store.applyPreset('dark')
    
    expect(store.currentPreset).toBe('dark')
    expect(store.settings?.colors.background).toBe('#111827')
  })

  it('should handle loading error with fallback', async () => {
    const store = useThemeStore()
    
    // Mock error
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await store.loadSettings()
    
    // Should fallback to light theme
    expect(store.settings).toBeDefined()
  })
})
```

### Интеграционное тестирование

```typescript
// tests/integration/theming-flow.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/app/App.vue'

describe('Theming Flow', () => {
  it('should apply theme on app initialization', async () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Landing</div>' } }
      ]
    })
    
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    await router.isReady()
    
    // Check that CSS variables are set
    const root = document.documentElement
    expect(root.style.getPropertyValue('--color-primary')).toBeTruthy()
  })
})
```

### Тестирование визуальных эффектов

Для liquid glass эффектов используем snapshot тесты:

```typescript
// tests/visual/liquid-glass.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '@/widgets/header/ui/AppHeader.vue'

describe('Liquid Glass Effects', () => {
  it('should apply backdrop-filter to header', () => {
    const wrapper = mount(AppHeader)
    
    const header = wrapper.find('.app-header')
    const styles = window.getComputedStyle(header.element)
    
    expect(styles.backdropFilter).toContain('blur')
  })
})
```

## Миграция существующего кода

### Изменения в маршрутизации

```typescript
// app/router/index.ts - ОБНОВИТЬ
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/landing/LandingPage.vue')
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/pages/catalog/CatalogPage.vue')
    },
    // ... остальные маршруты без изменений
  ]
})
```

### Обновление AppHeader

```vue
<!-- widgets/header/ui/AppHeader.vue - ОБНОВИТЬ -->
<template>
  <header class="app-header">
    <div class="container">
      <div class="app-header__content">
        <router-link to="/" class="app-header__brand">
          <img 
            v-if="brand?.logo" 
            :src="brand.logo" 
            :alt="brand.name"
            class="app-header__logo"
          />
          <span class="app-header__name">{{ brand?.name || 'Modern Store' }}</span>
        </router-link>
        
        <nav class="app-header__nav">
          <router-link to="/catalog" class="nav-link">Каталог</router-link>
          <router-link to="/profile" class="nav-link">Профиль</router-link>
        </nav>
        
        <CartWidget />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '@/features/apply-theme'
import { CartWidget } from '@/widgets/cart-widget'

const { brand } = useTheme()
</script>
```

### Удаление CategoryFilter

```typescript
// features/product-filters/ui/ - УДАЛИТЬ CategoryFilter.vue
// features/product-filters/model/useFilters.ts - ОБНОВИТЬ

export const useFilters = () => {
  const productsStore = useProductsStore()

  const applyPriceFilter = (minPrice?: number, maxPrice?: number) => {
    productsStore.setFilters({
      minPrice,
      maxPrice
      // Удалить category
    })
  }

  const clearFilters = () => {
    productsStore.clearFilters()
  }

  return {
    applyPriceFilter,
    clearFilters,
    filters: productsStore.filters
  }
}
```

### Обновление ProductsStore

```typescript
// app/stores/products.ts - ОБНОВИТЬ
export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>(mockProducts)
  const filters = ref<ProductFilters>({})
  
  const filteredProducts = computed(() => {
    let result = products.value

    // Удалить фильтрацию по категориям
    // if (filters.value.category) { ... }

    if (filters.value.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.value.minPrice!)
    }

    if (filters.value.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.value.maxPrice!)
    }

    return result
  })

  // Удалить computed categories
  
  return {
    products,
    filteredProducts,
    filters,
    setFilters,
    clearFilters,
    getProductById
  }
})
```

### Инициализация темы в main.ts

```typescript
// app/main.ts - ОБНОВИТЬ
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Инициализация темы
import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()
themeStore.loadSettings()

app.mount('#app')
```

## Дизайн-система - Обновления

### Дополнительные CSS-переменные для liquid glass

```css
/* app/styles/variables.css - ДОБАВИТЬ */
:root {
  /* Existing variables... */
  
  /* Liquid glass effects */
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-bg-dark: rgba(17, 24, 39, 0.8);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: 20px;
  --glass-saturation: 180%;
  
  /* Enhanced shadows for depth */
  --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --shadow-glass-hover: 0 12px 48px 0 rgba(0, 0, 0, 0.45);
  
  /* Enhanced border radius */
  --radius-2xl: 1.5rem;  /* 24px */
  --radius-3xl: 2rem;    /* 32px */
}
```

### Утилитарные классы для liquid glass

```css
/* app/styles/base.css - ДОБАВИТЬ */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  border: 1px solid var(--glass-border);
}

.glass-dark {
  background: var(--glass-bg-dark);
}

.glass-card {
  composes: glass;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass);
  transition: all var(--transition-base);
}

.glass-card:hover {
  box-shadow: var(--shadow-glass-hover);
  transform: translateY(-2px);
}

/* Проверка поддержки backdrop-filter */
@supports not (backdrop-filter: blur(20px)) {
  .glass {
    background: rgba(255, 255, 255, 0.95);
  }
  
  .glass-dark {
    background: rgba(17, 24, 39, 0.95);
  }
}
```

## Производительность

### Оптимизация backdrop-filter

1. **Использование will-change**: Для элементов с backdrop-filter
2. **Ограничение области применения**: Только для header и модальных окон
3. **Отключение на мобильных**: Для старых устройств

```css
.app-header {
  will-change: backdrop-filter;
}

@media (max-width: 768px) and (prefers-reduced-motion: reduce) {
  .glass {
    backdrop-filter: none;
    background: rgba(255, 255, 255, 0.95);
  }
}
```

### Оптимизация изображений

```vue
<!-- LandingPage.vue -->
<img 
  :src="hero?.image" 
  loading="lazy"
  decoding="async"
  alt="Hero background"
/>
```

## Доступность (A11y)

### Контрастность с liquid glass

Обеспечить достаточный контраст текста на полупрозрачных фонах:

```css
.hero__glass-card {
  background: rgba(255, 255, 255, 0.15); /* Увеличена непрозрачность */
}

.hero__title,
.hero__subtitle {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* Улучшенная читаемость */
}
```

### Клавиатурная навигация

```vue
<!-- ThemeSwitcher.vue -->
<button
  class="theme-button"
  :aria-label="`Выбрать тему ${getThemeLabel(preset)}`"
  :aria-pressed="currentPreset === preset"
  @click="selectTheme(preset)"
>
```

## Заключение

Система динамической темизации превращает приложение в конструктор интернет-магазинов с полной кастомизацией через API. Включает:

- Динамическое применение цветовых схем
- Настройка бренда (логотип, название, описание)
- Новая посадочная страница с hero-секцией
- Liquid glass эффекты в стиле Apple
- Улучшенный UI/UX с закругленными карточками
- Упрощенные фильтры (только по цене)
- Переключатель тем для демо
- Полная обратная совместимость

Готово к реализации согласно плану задач.
