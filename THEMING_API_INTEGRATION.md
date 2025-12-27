# Интеграция API темизации

Этот документ описывает, как интегрировать систему динамической темизации с реальным бэкендом.

## Обзор

Система темизации позволяет полностью кастомизировать внешний вид интернет-магазина через API. Все визуальные настройки (цвета, логотип, название бренда, изображения) загружаются с бэкенда и применяются динамически без перезагрузки страницы.

## Структура данных FrontSettings

### TypeScript интерфейс

```typescript
interface FrontSettings {
  colors: ThemeColors
  brand: BrandSettings
  hero: HeroSettings
}

interface ThemeColors {
  // Основные цвета
  primary: string              // Основной цвет бренда (hex, например: "#3B82F6")
  primaryHover: string          // Цвет при наведении (hex)
  primaryLight: string          // Светлый вариант для фонов (hex)
  
  // Вторичные цвета
  secondary: string             // Вторичный цвет (hex)
  secondaryHover: string        // Вторичный при наведении (hex)
  
  // Текст
  text: string                  // Основной цвет текста (hex)
  textLight: string             // Светлый текст (hex)
  textLighter: string           // Еще более светлый текст (hex)
  
  // Фоны
  background: string            // Основной фон (hex)
  backgroundSecondary: string   // Вторичный фон (hex)
  backgroundTertiary: string    // Третичный фон (hex)
  
  // Границы
  border: string                // Цвет границ (hex)
  borderLight: string           // Светлые границы (hex)
  
  // Статусы
  success: string               // Цвет успеха (hex)
  error: string                 // Цвет ошибки (hex)
  warning: string               // Цвет предупреждения (hex)
}

interface BrandSettings {
  name: string                  // Название бренда (отображается в header и title)
  logo: string                  // URL логотипа (абсолютный или относительный)
  description: string           // Описание бренда (используется на landing page)
  tagline?: string              // Слоган (опционально)
}

interface HeroSettings {
  image: string                 // URL фонового изображения для hero-секции
  title: string                 // Заголовок hero-секции
  subtitle: string              // Подзаголовок hero-секции
  ctaText: string               // Текст кнопки призыва к действию
}
```

### JSON пример

```json
{
  "colors": {
    "primary": "#3B82F6",
    "primaryHover": "#2563EB",
    "primaryLight": "#DBEAFE",
    "secondary": "#6B7280",
    "secondaryHover": "#4B5563",
    "text": "#111827",
    "textLight": "#6B7280",
    "textLighter": "#9CA3AF",
    "background": "#FFFFFF",
    "backgroundSecondary": "#F9FAFB",
    "backgroundTertiary": "#F3F4F6",
    "border": "#E5E7EB",
    "borderLight": "#F3F4F6",
    "success": "#10B981",
    "error": "#EF4444",
    "warning": "#F59E0B"
  },
  "brand": {
    "name": "Modern Store",
    "logo": "https://example.com/logo.png",
    "description": "Ваш источник качественных товаров и отличного сервиса",
    "tagline": "Качество, которому можно доверять"
  },
  "hero": {
    "image": "https://example.com/hero-bg.jpg",
    "title": "Добро пожаловать в Modern Store",
    "subtitle": "Откройте для себя коллекцию премиальных товаров",
    "ctaText": "Перейти в каталог"
  }
}
```

## API Endpoint

### GET /api/front-settings

**Описание**: Возвращает настройки темизации для фронтенда

**Метод**: GET

**URL**: `/api/front-settings`

**Заголовки**:
```
Content-Type: application/json
```

**Ответ (200 OK)**:
```json
{
  "colors": { ... },
  "brand": { ... },
  "hero": { ... }
}
```

**Ответ (500 Internal Server Error)**:
```json
{
  "error": "Failed to load theme settings"
}
```

## Интеграция с фронтендом

### Шаг 1: Обновите API функцию

Откройте файл `src/shared/api/theme-data.ts` и замените моковую реализацию:

```typescript
// Было (моковые данные):
export const fetchThemeSettings = async (): Promise<FrontSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return lightTheme
}

// Стало (реальный API):
export const fetchThemeSettings = async (): Promise<FrontSettings> => {
  const response = await fetch('/api/front-settings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    throw new Error('Failed to load theme settings')
  }
  
  return response.json()
}
```

### Шаг 2: Настройте CORS (если нужно)

Если API находится на другом домене, убедитесь что CORS настроен правильно:

```typescript
export const fetchThemeSettings = async (): Promise<FrontSettings> => {
  const response = await fetch('https://api.example.com/front-settings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Если нужны cookies
  })
  
  if (!response.ok) {
    throw new Error('Failed to load theme settings')
  }
  
  return response.json()
}
```

### Шаг 3: Добавьте обработку ошибок (опционально)

```typescript
export const fetchThemeSettings = async (): Promise<FrontSettings> => {
  try {
    const response = await fetch('/api/front-settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Валидация данных
    if (!data.colors || !data.brand || !data.hero) {
      throw new Error('Invalid theme settings structure')
    }
    
    return data
  } catch (error) {
    console.error('Failed to fetch theme settings:', error)
    // Возвращаем дефолтную тему при ошибке
    return getPresetTheme('light')
  }
}
```

## Применение настроек

Настройки применяются автоматически при загрузке приложения в `src/main.ts`:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './app/router'
import { useThemeStore } from './app/stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Загрузка темы перед монтированием
const themeStore = useThemeStore()
themeStore.loadSettings().then(() => {
  app.mount('#app')
})
```

## Как работает применение темы

1. **Загрузка**: При инициализации приложения вызывается `themeStore.loadSettings()`
2. **Парсинг**: Полученные данные сохраняются в Pinia store
3. **Применение**: Функция `applyTheme()` обновляет CSS-переменные на `document.documentElement`
4. **Реактивность**: Все компоненты автоматически обновляются благодаря CSS-переменным

### CSS-переменные

Каждый цвет из `ThemeColors` преобразуется в CSS-переменную:

```typescript
const applyTheme = (colors: ThemeColors) => {
  const root = document.documentElement
  
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-primary-hover', colors.primaryHover)
  // ... и так далее для всех цветов
}
```

Эти переменные используются во всех компонентах:

```css
.button {
  background-color: var(--color-primary);
  color: var(--color-bg);
}

.button:hover {
  background-color: var(--color-primary-hover);
}
```

## Валидация данных

### Обязательные поля

Все поля в `FrontSettings` обязательны, кроме `brand.tagline` (опционально).

### Формат цветов

Все цвета должны быть в формате HEX:
- ✅ Правильно: `"#3B82F6"`, `"#FFF"`, `"#000000"`
- ❌ Неправильно: `"rgb(59, 130, 246)"`, `"blue"`, `"3B82F6"`

### Формат URL

URL для логотипа и изображений могут быть:
- Абсолютные: `"https://example.com/logo.png"`
- Относительные: `"/images/logo.png"`
- Data URL: `"data:image/png;base64,..."`

### Рекомендации по изображениям

**Логотип**:
- Формат: PNG с прозрачностью или SVG
- Размер: 200x200px (или пропорциональный)
- Вес: до 50KB

**Hero изображение**:
- Формат: JPG или WebP
- Размер: 1920x1080px (Full HD)
- Вес: до 500KB (оптимизированное)
- Качество: 80-85%

## Кэширование

### Рекомендации для бэкенда

Настройте HTTP заголовки для кэширования:

```
Cache-Control: public, max-age=3600
ETag: "abc123"
```

### Инвалидация кэша

Если настройки изменились, используйте один из методов:
1. Измените ETag
2. Добавьте query параметр с версией: `/api/front-settings?v=2`
3. Используйте Cache-Control: no-cache для принудительной перезагрузки

## Тестирование

### Локальное тестирование

Для локального тестирования можно использовать JSON Server:

1. Установите json-server:
```bash
npm install -g json-server
```

2. Создайте файл `db.json`:
```json
{
  "front-settings": {
    "colors": { ... },
    "brand": { ... },
    "hero": { ... }
  }
}
```

3. Запустите сервер:
```bash
json-server --watch db.json --port 3001
```

4. Обновите API URL:
```typescript
const response = await fetch('http://localhost:3001/front-settings')
```

### Тестирование с моковыми данными

Текущая реализация уже содержит 4 предустановленные темы для тестирования:
- Light (светлая)
- Dark (темная)
- Blue (океан)
- Green (эко)

Переключение между темами доступно на странице профиля (`/profile`).

## Безопасность

### Валидация на бэкенде

Обязательно валидируйте все данные на бэкенде:

```python
# Пример на Python (FastAPI)
from pydantic import BaseModel, validator

class ThemeColors(BaseModel):
    primary: str
    primaryHover: str
    # ... другие поля
    
    @validator('*')
    def validate_hex_color(cls, v):
        if not re.match(r'^#[0-9A-Fa-f]{3,6}$', v):
            raise ValueError('Invalid hex color')
        return v

class BrandSettings(BaseModel):
    name: str
    logo: str
    description: str
    tagline: Optional[str] = None
    
    @validator('logo')
    def validate_url(cls, v):
        # Валидация URL
        return v

class HeroSettings(BaseModel):
    image: str
    title: str
    subtitle: str
    ctaText: str

class FrontSettings(BaseModel):
    colors: ThemeColors
    brand: BrandSettings
    hero: HeroSettings
```

### XSS защита

Фронтенд автоматически экранирует все текстовые значения через Vue.js. Однако:

1. **Не используйте `v-html`** для отображения настроек
2. **Валидируйте URL** на бэкенде
3. **Используйте CSP** (Content Security Policy) заголовки

### CORS

Настройте CORS правильно:

```python
# Пример на Python (FastAPI)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
```

## Мониторинг

### Метрики для отслеживания

1. **Время загрузки настроек**: Должно быть < 500ms
2. **Частота ошибок**: Должна быть < 1%
3. **Использование fallback темы**: Отслеживайте как часто применяется дефолтная тема

### Логирование

Фронтенд логирует ошибки в консоль:

```typescript
console.error('Failed to load theme settings:', error)
```

Для production рекомендуется интегрировать с сервисом мониторинга (Sentry, LogRocket и т.д.).

## Производительность

### Оптимизация

1. **Сжатие**: Используйте gzip/brotli для API ответов
2. **CDN**: Размещайте изображения на CDN
3. **Lazy loading**: Hero изображение загружается с `loading="lazy"`
4. **Preload**: Критичные изображения загружаются с `<link rel="preload">`

### Размер ответа

Типичный размер ответа API:
- JSON: ~1-2 KB (без сжатия)
- JSON (gzip): ~500-800 bytes

## Миграция с моковых данных

### Чеклист миграции

- [ ] Реализован API endpoint `/api/front-settings`
- [ ] Настроен CORS (если нужно)
- [ ] Добавлена валидация данных на бэкенде
- [ ] Оптимизированы изображения
- [ ] Настроено кэширование
- [ ] Обновлен `src/shared/api/theme-data.ts`
- [ ] Протестирована загрузка настроек
- [ ] Протестирован fallback на дефолтную тему
- [ ] Настроен мониторинг
- [ ] Обновлена документация

## Поддержка

При возникновении проблем проверьте:

1. **Network tab** в DevTools - успешно ли загружаются настройки
2. **Console** - есть ли ошибки JavaScript
3. **Application > Local Storage** - сохраняются ли настройки
4. **Elements > Styles** - применяются ли CSS-переменные

## Примеры использования

### Получение текущей темы

```typescript
import { useThemeStore } from '@/app/stores/theme'

const themeStore = useThemeStore()

// Получить настройки
console.log(themeStore.settings)
console.log(themeStore.colors)
console.log(themeStore.brand)
console.log(themeStore.hero)

// Проверить загрузку
console.log(themeStore.isLoading)

// Получить текущий пресет (для демо)
console.log(themeStore.currentPreset)
```

### Применение темы программно

```typescript
import { useThemeStore } from '@/app/stores/theme'

const themeStore = useThemeStore()

// Применить предустановленную тему (для демо)
themeStore.applyPreset('dark')

// Применить кастомные цвета
themeStore.applyTheme({
  primary: '#FF0000',
  primaryHover: '#CC0000',
  // ... остальные цвета
})
```

### Использование в компонентах

```vue
<template>
  <div class="my-component">
    <img :src="brand?.logo" :alt="brand?.name" />
    <h1>{{ brand?.name }}</h1>
    <p>{{ brand?.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/features/apply-theme'

const { brand, colors, hero } = useTheme()
</script>
```

## Заключение

Система динамической темизации готова к интеграции с реальным бэкендом. Следуйте этому руководству для успешной интеграции и не забудьте протестировать все сценарии, включая обработку ошибок и fallback на дефолтную тему.
