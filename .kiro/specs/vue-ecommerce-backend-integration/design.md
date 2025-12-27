# Документ дизайна: Интеграция с Backend API

## Обзор

Интеграция Vue E-commerce приложения с реальным REST API бэкендом. Замена моковых данных на реальные HTTP запросы с использованием axios. Включает настройку API клиента, преобразование данных между форматами, обработку ошибок и состояний загрузки.

### Ключевые изменения

- Настройка axios instance с базовым URL и interceptors
- API функции для настроек сайта и товаров
- Преобразование snake_case → camelCase
- Обновление stores для работы с API
- Обработка состояний загрузки и ошибок
- Удаление моковых данных

## Архитектура

### Структура API слоя

```
src/
└── shared/
    └── api/
        ├── client.ts           # Axios instance и конфигурация
        ├── site-settings.ts    # API для настроек сайта
        ├── products.ts         # API для товаров
        ├── transformers.ts     # Утилиты преобразования данных
        └── types.ts            # Типы для API ответов
```

## Компоненты и интерфейсы

### Типы данных

#### API Response Types (shared/api/types.ts)

```typescript
// Типы ответов от бэкенда (snake_case)
export interface SiteSettingsResponse {
  id: number
  colors: {
    primary: string
    primary_hover: string
    primary_light: string
    secondary: string
    secondary_hover: string
    text: string
    text_light: string
    text_lighter: string
    background: string
    background_secondary: string
    background_tertiary: string
    border: string
    border_light: string
    success: string
    error: string
    warning: string
  }
  brand: {
    name: string
    logo: string
    description: string
    tagline: string
  }
  hero: {
    image: string
    title: string
    subtitle: string
    cta_text: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductResponse {
  id: number
  name: string
  description: string
  manufacturer: string
  category: string
  primary_image: string
  images: string[]
  video: string
  height: number
  depth: number
  width: number
  weight: number
  weight_unit: string
  is_site_active: boolean
  qdrant_point_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductListResponse {
  products: ProductResponse[]
  total: number
}

// Типы ошибок
export interface APIError {
  message: string
  status?: number
  code?: string
}
```

### API Client

#### Axios Instance (shared/api/client.ts)

```typescript
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Базовый URL из переменных окружения
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Создание axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

// Request interceptor для логирования в development
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data)
    }
    return response
  },
  (error: AxiosError) => {
    const apiError = handleAPIError(error)
    console.error('[API Error]', apiError)
    return Promise.reject(apiError)
  }
)

// Обработка ошибок API
export const handleAPIError = (error: AxiosError): APIError => {
  if (error.response) {
    // Сервер ответил с ошибкой
    const status = error.response.status
    
    switch (status) {
      case 404:
        return {
          message: 'Данные не найдены',
          status,
          code: 'NOT_FOUND'
        }
      case 500:
        return {
          message: 'Ошибка сервера',
          status,
          code: 'SERVER_ERROR'
        }
      default:
        return {
          message: error.response.data?.message || 'Произошла ошибка',
          status,
          code: 'API_ERROR'
        }
    }
  } else if (error.request) {
    // Запрос был сделан, но ответа не получено
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Превышено время ожидания',
        code: 'TIMEOUT'
      }
    }
    return {
      message: 'Ошибка подключения к серверу',
      code: 'NETWORK_ERROR'
    }
  } else {
    // Ошибка при настройке запроса
    return {
      message: error.message || 'Неизвестная ошибка',
      code: 'UNKNOWN_ERROR'
    }
  }
}
```

### Data Transformers

#### Transformers (shared/api/transformers.ts)

```typescript
import type { 
  SiteSettingsResponse, 
  ProductResponse 
} from './types'
import type { 
  FrontSettings, 
  Product 
} from '@/shared/types'

// Преобразование snake_case в camelCase
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// Преобразование объекта с snake_case ключами в camelCase
export const transformKeys = <T extends Record<string, any>>(obj: T): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item))
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key)
      acc[camelKey] = transformKeys(obj[key])
      return acc
    }, {} as any)
  }
  
  return obj
}

// Преобразование настроек сайта из API в формат приложения
export const transformSiteSettings = (response: SiteSettingsResponse): FrontSettings => {
  return {
    colors: {
      primary: response.colors.primary,
      primaryHover: response.colors.primary_hover,
      primaryLight: response.colors.primary_light,
      secondary: response.colors.secondary,
      secondaryHover: response.colors.secondary_hover,
      text: response.colors.text,
      textLight: response.colors.text_light,
      textLighter: response.colors.text_lighter,
      background: response.colors.background,
      backgroundSecondary: response.colors.background_secondary,
      backgroundTertiary: response.colors.background_tertiary,
      border: response.colors.border,
      borderLight: response.colors.border_light,
      success: response.colors.success,
      error: response.colors.error,
      warning: response.colors.warning
    },
    brand: {
      name: response.brand.name,
      logo: response.brand.logo,
      description: response.brand.description,
      tagline: response.brand.tagline
    },
    hero: {
      image: response.hero.image,
      title: response.hero.title,
      subtitle: response.hero.subtitle,
      ctaText: response.hero.cta_text
    }
  }
}

// Преобразование товара из API в формат приложения
export const transformProduct = (response: ProductResponse): Product => {
  return {
    id: response.id,
    title: response.name,
    description: response.description,
    price: 0, // Цена пока не приходит с бэкенда, используем 0
    image: response.primary_image,
    category: response.category,
    // Дополнительные поля
    manufacturer: response.manufacturer,
    images: response.images,
    video: response.video,
    dimensions: {
      height: response.height,
      depth: response.depth,
      width: response.width
    },
    weight: {
      value: response.weight,
      unit: response.weight_unit
    }
  }
}

// Фильтрация активных товаров
export const filterActiveProducts = (products: ProductResponse[]): ProductResponse[] => {
  return products.filter(product => product.is_site_active)
}
```

### API Functions

#### Site Settings API (shared/api/site-settings.ts)

```typescript
import { apiClient, handleAPIError } from './client'
import { transformSiteSettings } from './transformers'
import type { SiteSettingsResponse } from './types'
import type { FrontSettings } from '@/shared/types/theme'

// Дефолтная светлая тема как fallback
const defaultSettings: FrontSettings = {
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

// Загрузка активных настроек сайта
export const fetchSiteSettings = async (): Promise<FrontSettings> => {
  try {
    const response = await apiClient.get<SiteSettingsResponse>('/dev-api/site-settings/active')
    return transformSiteSettings(response.data)
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    // Возвращаем дефолтные настройки при ошибке
    return defaultSettings
  }
}
```

#### Products API (shared/api/products.ts)

```typescript
import { apiClient } from './client'
import { transformProduct, filterActiveProducts } from './transformers'
import type { ProductListResponse, ProductResponse } from './types'
import type { Product } from '@/entities/product'

// Загрузка списка товаров
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ProductListResponse>('/dev-api/product/list')
    
    // Фильтруем только активные товары
    const activeProducts = filterActiveProducts(response.data.products)
    
    // Преобразуем в формат приложения
    return activeProducts.map(transformProduct)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

// Загрузка деталей товара
export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await apiClient.get<ProductResponse>(`/dev-api/product/${id}`)
    
    // Проверяем что товар активен
    if (!response.data.is_site_active) {
      return null
    }
    
    return transformProduct(response.data)
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error)
    return null
  }
}
```

### Обновление Stores

#### Updated useThemeStore (app/stores/theme.ts)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FrontSettings, ThemePreset } from '@/shared/types/theme'
import { fetchSiteSettings } from '@/shared/api/site-settings'
import { getPresetTheme } from '@/shared/api/theme-data' // Для демо режима

export const useThemeStore = defineStore('theme', () => {
  const settings = ref<FrontSettings | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPreset = ref<ThemePreset>('light')

  const colors = computed(() => settings.value?.colors)
  const brand = computed(() => settings.value?.brand)
  const hero = computed(() => settings.value?.hero)

  // Загрузка настроек с API
  const loadSettings = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await fetchSiteSettings()
      settings.value = data
      applyTheme(data.colors)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load settings'
      console.error('Failed to load theme settings:', err)
      // Fallback на дефолтную тему уже обработан в fetchSiteSettings
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
    error,
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

#### Updated useProductsStore (app/stores/products.ts)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductFilters } from '@/entities/product'
import { fetchProducts, fetchProductById } from '@/shared/api/products'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const filters = ref<ProductFilters>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const filteredProducts = computed(() => {
    let result = products.value

    if (filters.value.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.value.minPrice!)
    }

    if (filters.value.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.value.maxPrice!)
    }

    return result
  })

  // Загрузка товаров с API
  const loadProducts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await fetchProducts()
      products.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load products'
      console.error('Failed to load products:', err)
      products.value = []
    } finally {
      isLoading.value = false
    }
  }

  const setFilters = (newFilters: ProductFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  // Получение товара по ID
  const getProductById = async (id: number): Promise<Product | null> => {
    // Сначала ищем в загруженных товарах
    const cached = products.value.find(p => p.id === id)
    if (cached) {
      return cached
    }

    // Если не найден, загружаем с API
    try {
      const product = await fetchProductById(id)
      
      // Добавляем в кэш если найден
      if (product) {
        products.value.push(product)
      }
      
      return product
    } catch (err) {
      console.error(`Failed to get product ${id}:`, err)
      return null
    }
  }

  return {
    products,
    filteredProducts,
    filters,
    isLoading,
    error,
    loadProducts,
    setFilters,
    clearFilters,
    getProductById
  }
})
```

### Environment Configuration

#### .env файл

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Development
VITE_DEV_MODE=true
```

#### .env.example файл

```env
# API Configuration
# URL бэкенда API
VITE_API_BASE_URL=http://localhost:8000

# Development
# Включить режим разработки с дополнительным логированием
VITE_DEV_MODE=true
```

### Обновление типов Product

#### Updated Product Type (entities/product/model/types.ts)

```typescript
export interface Product {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  // Дополнительные поля с бэкенда
  manufacturer?: string
  images?: string[]
  video?: string
  dimensions?: {
    height: number
    depth: number
    width: number
  }
  weight?: {
    value: number
    unit: string
  }
}

export interface ProductFilters {
  minPrice?: number
  maxPrice?: number
}
```

## Свойства корректности

*Свойство корректности - это характеристика или поведение, которое должно выполняться во всех допустимых сценариях работы системы.*


### Property 1: Data transformation consistency
*For any* API response with snake_case fields, when transformed, all fields should be converted to camelCase format
**Validates: Requirements 2.2**

### Property 2: Active products filtering
*For any* product list response, when filtered, only products with is_site_active: true should be included in the result
**Validates: Requirements 3.2**

### Property 3: Product transformation completeness
*For any* product from API, when transformed, the result should contain all required fields (id, title, description, price, image, category)
**Validates: Requirements 3.3**

### Property 4: Theme application after load
*For any* successfully loaded site settings, the theme colors should be applied to CSS variables on the document root
**Validates: Requirements 5.2**

### Property 5: Products state persistence
*For any* successfully loaded products list, all products should be stored in the products state
**Validates: Requirements 6.3**

### Property 6: Product caching behavior
*For any* product that exists in state, calling getProductById should return the cached product without making an API request
**Validates: Requirements 7.2**

### Property 7: Product API fetch on cache miss
*For any* product ID not in state, calling getProductById should make an API request and add the result to state
**Validates: Requirements 7.3, 7.4**

### Property 8: Settings caching behavior
*For any* loaded site settings, subsequent calls to loadSettings should use cached data without making additional API requests
**Validates: Requirements 14.1**

## Обработка ошибок

### Стратегия обработки ошибок

1. **Ошибки сети**
   - Отображение сообщения "Ошибка подключения к серверу"
   - Использование fallback значений
   - Логирование в консоль

2. **Ошибки 404**
   - Отображение сообщения "Данные не найдены"
   - Возврат null для товаров
   - Использование дефолтной темы для настроек

3. **Ошибки 500**
   - Отображение сообщения "Ошибка сервера"
   - Использование fallback значений
   - Логирование в консоль

4. **Timeout ошибки**
   - Отображение сообщения "Превышено время ожидания"
   - Использование fallback значений
   - Возможность повторной попытки

5. **CORS ошибки**
   - Отображение сообщения "Ошибка CORS. Проверьте настройки сервера"
   - Документация требований к CORS

### Граничные случаи

1. **Пустой список товаров**
   - Отображение сообщения "Товары не найдены"
   - Предложение обновить страницу

2. **Товар не найден**
   - Отображение сообщения "Товар не найден"
   - Кнопка возврата в каталог

3. **Настройки не загружены**
   - Использование дефолтной светлой темы
   - Приложение остается функциональным

4. **Отсутствие цены у товара**
   - Использование значения 0
   - Отображение "Цена уточняется"

## Стратегия тестирования

### Подход к тестированию

1. **Unit тесты** - тестирование утилит, transformers, API функций
2. **Property-based тесты** - тестирование преобразований данных
3. **Integration тесты** - тестирование stores с моками API
4. **E2E тесты** - тестирование с реальным бэкендом (опционально)

### Property-Based Testing

**Библиотека**: fast-check

**Конфигурация**:
- Минимум 100 итераций на property тест
- Формат тега: `Feature: vue-ecommerce-backend-integration, Property {number}: {property_text}`

**Примеры property тестов**:

```typescript
// tests/properties/transformers.property.test.ts
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { snakeToCamel, transformKeys } from '@/shared/api/transformers'

describe('Data Transformation Properties', () => {
  // Feature: vue-ecommerce-backend-integration, Property 1: Data transformation consistency
  it('should transform all snake_case keys to camelCase', () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.string({ minLength: 1, maxLength: 20 }).map(s => s.toLowerCase().replace(/[^a-z]/g, '_')),
          fc.oneof(fc.string(), fc.integer(), fc.boolean())
        ),
        (obj) => {
          const transformed = transformKeys(obj)
          
          // Проверяем что все ключи в camelCase
          Object.keys(transformed).forEach(key => {
            expect(key).not.toMatch(/_/)
          })
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Unit Testing

**Области покрытия**:
- API client (axios instance, interceptors)
- Transformers (snakeToCamel, transformProduct, transformSiteSettings)
- API functions (fetchSiteSettings, fetchProducts, fetchProductById)
- Updated stores (useThemeStore, useProductsStore)
- Error handling

**Примеры unit тестов**:

```typescript
// tests/unit/api/transformers.test.ts
import { describe, it, expect } from 'vitest'
import { snakeToCamel, transformProduct, transformSiteSettings } from '@/shared/api/transformers'

describe('snakeToCamel', () => {
  it('should convert snake_case to camelCase', () => {
    expect(snakeToCamel('hello_world')).toBe('helloWorld')
    expect(snakeToCamel('primary_color')).toBe('primaryColor')
    expect(snakeToCamel('is_site_active')).toBe('isSiteActive')
  })

  it('should handle single words', () => {
    expect(snakeToCamel('hello')).toBe('hello')
  })

  it('should handle multiple underscores', () => {
    expect(snakeToCamel('hello_world_test')).toBe('helloWorldTest')
  })
})

describe('transformProduct', () => {
  it('should transform product response to app format', () => {
    const response = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      primary_image: 'test.jpg',
      category: 'Test',
      manufacturer: 'Test Manufacturer',
      is_site_active: true,
      // ... other fields
    }

    const result = transformProduct(response)

    expect(result.id).toBe(1)
    expect(result.title).toBe('Test Product')
    expect(result.image).toBe('test.jpg')
    expect(result.manufacturer).toBe('Test Manufacturer')
  })
})
```

### Integration Testing с моками

```typescript
// tests/integration/stores/products.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '@/app/stores/products'
import * as productsAPI from '@/shared/api/products'

describe('useProductsStore with API', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should load products from API', async () => {
    const mockProducts = [
      { id: 1, title: 'Product 1', price: 100, /* ... */ },
      { id: 2, title: 'Product 2', price: 200, /* ... */ }
    ]

    vi.spyOn(productsAPI, 'fetchProducts').mockResolvedValue(mockProducts)

    const store = useProductsStore()
    await store.loadProducts()

    expect(store.products).toHaveLength(2)
    expect(store.isLoading).toBe(false)
  })

  it('should handle API errors gracefully', async () => {
    vi.spyOn(productsAPI, 'fetchProducts').mockRejectedValue(new Error('Network error'))

    const store = useProductsStore()
    await store.loadProducts()

    expect(store.products).toHaveLength(0)
    expect(store.error).toBeTruthy()
    expect(store.isLoading).toBe(false)
  })

  it('should cache products in state', async () => {
    const mockProduct = { id: 1, title: 'Product 1', /* ... */ }
    
    vi.spyOn(productsAPI, 'fetchProductById').mockResolvedValue(mockProduct)

    const store = useProductsStore()
    
    // Первый вызов - делает API запрос
    const product1 = await store.getProductById(1)
    expect(product1).toEqual(mockProduct)
    expect(productsAPI.fetchProductById).toHaveBeenCalledTimes(1)

    // Второй вызов - использует кэш
    const product2 = await store.getProductById(1)
    expect(product2).toEqual(mockProduct)
    expect(productsAPI.fetchProductById).toHaveBeenCalledTimes(1) // Не увеличилось
  })
})
```

## Миграция с моковых данных

### Шаги миграции

1. **Создание API слоя**
   - Создать client.ts с axios instance
   - Создать transformers.ts с утилитами преобразования
   - Создать site-settings.ts с API функциями
   - Создать products.ts с API функциями

2. **Обновление stores**
   - Обновить useThemeStore.loadSettings()
   - Обновить useProductsStore с loadProducts()
   - Обновить getProductById()

3. **Обновление компонентов**
   - Обновить CatalogPage для вызова loadProducts()
   - Обновить ProductPage для обработки состояний загрузки
   - Обновить LandingPage для обработки состояний загрузки

4. **Удаление моковых данных**
   - Удалить shared/api/mock-data.ts
   - Обновить shared/api/theme-data.ts (оставить только getPresetTheme)
   - Обновить все импорты

5. **Тестирование**
   - Запустить все существующие тесты
   - Добавить новые тесты для API функций
   - Добавить integration тесты с моками

### Обратная совместимость

Все существующие фичи должны продолжать работать:
- Корзина (localStorage)
- Заказы (localStorage)
- Фильтрация товаров
- Навигация
- Темизация (ThemeSwitcher для демо)

## CORS Configuration

### Требования к бэкенду

Бэкенд должен разрешать CORS запросы от фронтенда:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### Проверка CORS

Если возникают CORS ошибки:
1. Проверить что бэкенд запущен на http://localhost:8000
2. Проверить что CORS middleware настроен
3. Проверить что allow_origins включает URL фронтенда
4. Проверить browser console для деталей ошибки

## Production Considerations

### Для production деплоя:

1. **Environment Variables**
   - Создать .env.production с production API URL
   - Настроить VITE_API_BASE_URL на production бэкенд

2. **Error Handling**
   - Добавить Sentry или аналогичный сервис для отслеживания ошибок
   - Улучшить сообщения об ошибках для пользователей

3. **Caching**
   - Рассмотреть использование Service Workers для offline режима
   - Добавить HTTP caching headers

4. **Security**
   - Добавить authentication если требуется
   - Настроить HTTPS
   - Добавить rate limiting

## Заключение

Интеграция с бэкендом API обеспечивает:

- Загрузку настроек сайта с бэкенда
- Загрузку товаров с бэкенда
- Преобразование данных между форматами
- Обработку ошибок с fallback значениями
- Кэширование данных для производительности
- Обратную совместимость со всеми существующими фичами

Готово к реализации согласно плану задач.
