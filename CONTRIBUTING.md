# Руководство по разработке

Добро пожаловать в проект Vue E-commerce MVP! Это руководство поможет вам начать разработку.

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev
```

Приложение будет доступно на http://localhost:5173/

### 2. Структура проекта

Проект использует **Feature-Sliced Design (FSD)**. Подробнее см. [ARCHITECTURE.md](./ARCHITECTURE.md)

```
src/
├── app/        # Инициализация, stores, стили
├── pages/      # Страницы (роуты)
├── widgets/    # Композиция features
├── features/   # Бизнес-логика
├── entities/   # Бизнес-модели
└── shared/     # UI-kit, утилиты
```

## 📝 Стандарты кодирования

### TypeScript

Используйте **strict mode** и типизируйте все:

```typescript
// ✅ Хорошо
interface Props {
  product: Product
  variant?: 'card' | 'list'
}

const props = defineProps<Props>()

// ❌ Плохо
const props = defineProps({
  product: Object,
  variant: String
})
```

### Composition API

Используйте Composition API вместо Options API:

```typescript
// ✅ Хорошо
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

// ❌ Плохо
<script lang="ts">
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    doubled() { return this.count * 2 }
  }
}
</script>
```

### Именование

- **Компоненты**: PascalCase (`ProductCard.vue`)
- **Composables**: camelCase с префиксом `use` (`useAddToCart.ts`)
- **Stores**: camelCase с префиксом `use` (`useCartStore`)
- **Типы**: PascalCase (`Product`, `CartItem`)
- **Константы**: UPPER_SNAKE_CASE (`MAX_ITEMS`)

### Импорты

Используйте алиасы путей:

```typescript
// ✅ Хорошо
import { Button } from '@/shared/ui'
import { useCartStore } from '@/app/stores/cart'
import { ProductCard } from '@/entities/product'

// ❌ Плохо
import { Button } from '../../../shared/ui'
import { useCartStore } from '../../app/stores/cart'
```

## 🎨 Стили

### CSS-переменные

Используйте CSS-переменные из `app/styles/variables.css`:

```css
/* ✅ Хорошо */
.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* ❌ Плохо */
.button {
  background: #3b82f6;
  padding: 16px;
  border-radius: 8px;
}
```

### Scoped стили

Всегда используйте scoped стили в компонентах:

```vue
<style scoped>
.product-card {
  /* стили */
}
</style>
```

### Адаптивность

Используйте mobile-first подход:

```css
/* Базовые стили для мобильных */
.container {
  padding: var(--spacing-md);
}

/* Планшеты */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }
}

/* Десктоп */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
  }
}
```

## 🧩 Создание компонентов

### Структура компонента

```vue
<template>
  <!-- Разметка -->
</template>

<script setup lang="ts">
// Импорты
import { ref, computed } from 'vue'
import type { Product } from '@/entities/product'

// Props
interface Props {
  product: Product
  variant?: 'card' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'card'
})

// Emits
interface Emits {
  (e: 'click', product: Product): void
  (e: 'addToCart', product: Product): void
}

const emit = defineEmits<Emits>()

// State
const isHovered = ref(false)

// Computed
const formattedPrice = computed(() => {
  return formatPrice(props.product.price)
})

// Methods
const handleClick = () => {
  emit('click', props.product)
}
</script>

<style scoped>
/* Стили */
</style>
```

### Props и Emits

Всегда типизируйте props и emits:

```typescript
// Props
interface Props {
  product: Product
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

// Emits
interface Emits {
  (e: 'update', value: string): void
  (e: 'submit'): void
}

const emit = defineEmits<Emits>()
```

## 🏪 Работа со Stores

### Создание Store

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('my-store', () => {
  // State
  const items = ref<Item[]>([])
  
  // Computed
  const itemCount = computed(() => items.value.length)
  
  // Actions
  const addItem = (item: Item) => {
    items.value.push(item)
  }
  
  return {
    items,
    itemCount,
    addItem
  }
})
```

### Использование Store

```typescript
import { useMyStore } from '@/app/stores/my-store'
import { storeToRefs } from 'pinia'

const myStore = useMyStore()

// Реактивные свойства через storeToRefs
const { items, itemCount } = storeToRefs(myStore)

// Actions напрямую
const { addItem } = myStore
```

## 🔧 Утилиты

### Создание утилиты

```typescript
// shared/lib/my-util.ts

/**
 * Описание функции
 * @param value - описание параметра
 * @returns описание возвращаемого значения
 */
export function myUtil(value: string): string {
  // реализация
  return value.toUpperCase()
}
```

### Создание Composable

```typescript
// features/my-feature/model/useMyFeature.ts

export function useMyFeature() {
  const state = ref<State>({})
  
  const doSomething = () => {
    // логика
  }
  
  return {
    state,
    doSomething
  }
}
```

## ♿️ Доступность (A11y)

### Семантический HTML

```html
<!-- ✅ Хорошо -->
<nav>
  <ul>
    <li><a href="/catalog">Каталог</a></li>
  </ul>
</nav>

<!-- ❌ Плохо -->
<div class="nav">
  <div class="nav-item" @click="goTo('/catalog')">Каталог</div>
</div>
```

### ARIA-атрибуты

```html
<!-- Кнопки -->
<button aria-label="Добавить в корзину">
  <ShoppingCart />
</button>

<!-- Формы -->
<input
  type="email"
  aria-label="Email"
  aria-required="true"
  aria-invalid="false"
/>

<!-- Уведомления -->
<div role="alert" aria-live="polite">
  Товар добавлен в корзину
</div>
```

### Клавиатурная навигация

Убедитесь, что все интерактивные элементы доступны с клавиатуры:

```vue
<div
  tabindex="0"
  @keydown.enter="handleClick"
  @keydown.space.prevent="handleClick"
>
  Кликабельный элемент
</div>
```

## 🧪 Тестирование

### Unit тесты

```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/shared/lib/formatters'

describe('formatPrice', () => {
  it('should format price correctly', () => {
    expect(formatPrice(1000)).toBe('1 000 ₽')
    expect(formatPrice(1234.56)).toBe('1 234.56 ₽')
  })
  
  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('0 ₽')
  })
})
```

### Property-based тесты

```typescript
import { test } from 'vitest'
import fc from 'fast-check'

test('cart persistence round-trip', () => {
  fc.assert(
    fc.property(fc.array(cartItemArbitrary), (items) => {
      saveToStorage('cart', items)
      const loaded = loadFromStorage('cart')
      expect(loaded).toEqual(items)
    })
  )
})
```

## 📦 Коммиты

Используйте conventional commits:

```bash
# Новая функция
git commit -m "feat: add product search"

# Исправление бага
git commit -m "fix: correct price calculation in cart"

# Рефакторинг
git commit -m "refactor: extract validation logic to composable"

# Документация
git commit -m "docs: update README with new features"

# Стили
git commit -m "style: format code with prettier"

# Тесты
git commit -m "test: add unit tests for validators"
```

## 🔍 Проверка перед коммитом

```bash
# Линтинг
npm run lint

# Форматирование
npm run format

# Сборка
npm run build

# Тесты (если есть)
npm test
```

## 🐛 Отладка

### Vue DevTools

Установите [Vue DevTools](https://devtools.vuejs.org/) для отладки:

- Инспекция компонентов
- Просмотр Pinia stores
- Отслеживание событий
- Анализ производительности

### Console.log

Используйте для быстрой отладки:

```typescript
console.log('Product:', product)
console.table(items)
console.error('Error:', error)
```

### Debugger

Используйте breakpoints в браузере или IDE:

```typescript
const handleClick = () => {
  debugger // Остановка выполнения
  emit('click', product)
}
```

## 📚 Полезные ресурсы

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Vite Documentation](https://vitejs.dev/)

## 💡 Советы

1. **Читайте документацию** - Vue 3 и TypeScript имеют отличную документацию
2. **Используйте TypeScript** - типизация помогает избежать ошибок
3. **Следуйте FSD** - структура проекта должна быть понятной
4. **Пишите тесты** - тесты помогают поддерживать качество кода
5. **Оптимизируйте** - используйте lazy loading и code splitting
6. **Думайте о доступности** - делайте приложение доступным для всех

## 🤝 Помощь

Если у вас есть вопросы или предложения:

1. Проверьте [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Посмотрите примеры в существующем коде
3. Создайте issue в репозитории

Удачной разработки! 🚀
