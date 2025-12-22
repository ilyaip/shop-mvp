# Архитектура проекта

## Обзор

Vue E-commerce MVP построен на основе методологии **Feature-Sliced Design (FSD)** - архитектурной методологии для frontend-проектов, которая обеспечивает:

- 🎯 Явную структуру проекта
- 🔄 Переиспользуемость кода
- 📦 Изолированность модулей
- 🧪 Простоту тестирования
- 📈 Масштабируемость

## Слои FSD

### 1. App (Приложение)

**Назначение**: Инициализация приложения, глобальные настройки, провайдеры

**Содержимое**:
- `App.vue` - корневой компонент
- `router/` - конфигурация маршрутизации
- `stores/` - глобальные Pinia stores
- `styles/` - глобальные стили и CSS-переменные

**Stores**:

#### useProductsStore
```typescript
// Управление товарами и фильтрацией
state: {
  products: Product[]
  filters: ProductFilters
  isLoading: boolean
}
computed: {
  filteredProducts: Product[]
  categories: string[]
}
actions: {
  setFilters()
  clearFilters()
  getProductById()
}
```

#### useCartStore
```typescript
// Управление корзиной с персистентностью
state: {
  items: CartItem[]
}
computed: {
  total: number
  itemCount: number
}
actions: {
  addItem()
  removeItem()
  updateQuantity()
  clearCart()
}
```

#### useUserStore
```typescript
// Управление пользователем и заказами
state: {
  orders: Order[]
}
actions: {
  addOrder()
}
```

#### useUIStore
```typescript
// Управление UI-состоянием
state: {
  notifications: Notification[]
}
actions: {
  showNotification()
  removeNotification()
}
```

### 2. Pages (Страницы)

**Назначение**: Страницы приложения, соответствующие маршрутам

**Принципы**:
- Одна страница = один маршрут
- Композиция из widgets и features
- Минимум бизнес-логики (делегирование в features)

**Страницы**:
- `CatalogPage` - каталог товаров с фильтрацией
- `ProductPage` - детальная информация о товаре
- `CartPage` - корзина покупок
- `CheckoutPage` - оформление заказа
- `ProfilePage` - личный кабинет

### 3. Widgets (Виджеты)

**Назначение**: Композиция features для создания сложных UI-блоков

**Виджеты**:

#### AppHeader
- Логотип и название
- Навигационное меню
- CartWidget (количество товаров)
- Адаптивное мобильное меню

#### AppFooter
- Информация о магазине
- Ссылки на социальные сети
- Копирайт

#### CartWidget
- Иконка корзины
- Счетчик товаров
- Ссылка на страницу корзины

### 4. Features (Фичи)

**Назначение**: Бизнес-логика и пользовательские сценарии

**Фичи**:

#### add-to-cart
```typescript
// Composable для добавления товара в корзину
useAddToCart() {
  const cartStore = useCartStore()
  const uiStore = useUIStore()
  
  const addToCart = (product: Product) => {
    cartStore.addItem(product)
    uiStore.showNotification({
      message: 'Товар добавлен в корзину',
      type: 'success'
    })
  }
  
  return { addToCart }
}
```

#### product-filters
```typescript
// Composable для фильтрации товаров
useFilters() {
  const productsStore = useProductsStore()
  
  const applyFilters = (filters: ProductFilters) => {
    productsStore.setFilters(filters)
  }
  
  const clearFilters = () => {
    productsStore.clearFilters()
  }
  
  return { applyFilters, clearFilters }
}
```

#### checkout-form
```typescript
// Composable для оформления заказа
useCheckoutForm() {
  const formData = reactive<OrderData>({...})
  const errors = reactive<Record<string, string>>({})
  
  const validateForm = () => {...}
  const submitOrder = () => {...}
  
  return { formData, errors, validateForm, submitOrder }
}
```

### 5. Entities (Сущности)

**Назначение**: Бизнес-модели и их представление

**Структура entity**:
```
entity/
├── model/          # Типы, интерфейсы, бизнес-логика
│   ├── types.ts
│   └── index.ts
└── ui/             # UI-компоненты для отображения
    ├── Component.vue
    └── index.ts
```

**Сущности**:

#### Product
- Типы: `Product`, `ProductFilters`
- UI: `ProductCard`, `ProductSkeleton`

#### Cart
- Типы: `CartItem`, `CartState`
- UI: `CartItem`

#### Order
- Типы: `Order`, `OrderData`
- UI: `OrderCard`

#### User
- Типы: `UserState`
- UI: нет (используется только в stores)

### 6. Shared (Общие модули)

**Назначение**: Переиспользуемый код без бизнес-логики

**Структура**:

#### ui/ - UI-kit
Базовые UI-компоненты:
- `Button` - кнопка с вариантами
- `Input` - поле ввода с валидацией
- `Card` - карточка для контента
- `Modal` - модальное окно
- `Skeleton` - скелетон загрузки
- `Notification` - уведомления

#### lib/ - Утилиты
```typescript
// storage.ts - работа с localStorage
loadFromStorage<T>(key: string): T | null
saveToStorage<T>(key: string, data: T): void
removeFromStorage(key: string): void

// validators.ts - валидаторы форм
validateEmail(email: string): boolean
validatePhone(phone: string): boolean
validateRequired(value: string): boolean

// formatters.ts - форматтеры
formatPrice(price: number): string
formatDate(date: Date): string
```

#### api/ - API и данные
- `mock-data.ts` - моковые данные для разработки

#### types/ - Глобальные типы
- `global.ts` - общие типы и интерфейсы

## Потоки данных

### 1. Загрузка товаров

```
App Init → useProductsStore.init() → Load mock-data → State update
```

### 2. Добавление в корзину

```
ProductCard → emit('addToCart') → 
useAddToCart.addToCart() → 
useCartStore.addItem() → 
saveToStorage() → 
useUIStore.showNotification()
```

### 3. Оформление заказа

```
CheckoutForm → validate() → 
useCheckoutForm.submitOrder() → 
useUserStore.addOrder() → 
useCartStore.clearCart() → 
router.push('/profile')
```

### 4. Фильтрация товаров

```
CategoryFilter → emit('change') → 
useFilters.applyFilters() → 
useProductsStore.setFilters() → 
computed filteredProducts update → 
CatalogPage re-render
```

## Принципы разработки

### 1. Изолированность модулей

Каждый модуль должен быть независимым и иметь четкую ответственность:

```typescript
// ❌ Плохо: прямая зависимость от другого слоя
import { useCartStore } from '@/app/stores/cart'

// ✅ Хорошо: использование через props/emits
defineProps<{ onAddToCart: (product: Product) => void }>()
```

### 2. Направление зависимостей

Зависимости должны идти только вниз по слоям:

```
app → pages → widgets → features → entities → shared
```

### 3. Переиспользуемость

Компоненты должны быть максимально переиспользуемыми:

```typescript
// ✅ Хорошо: универсальный компонент
<Button variant="primary" @click="handleClick">
  Добавить в корзину
</Button>

// ❌ Плохо: специфичный компонент
<AddToCartButton :product="product" />
```

### 4. Типизация

Все компоненты и функции должны быть типизированы:

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

## Паттерны и best practices

### 1. Composables

Используйте composables для переиспользуемой логики:

```typescript
// features/add-to-cart/model/useAddToCart.ts
export function useAddToCart() {
  const cartStore = useCartStore()
  const uiStore = useUIStore()
  
  const addToCart = (product: Product) => {
    cartStore.addItem(product)
    uiStore.showNotification({
      message: 'Товар добавлен в корзину',
      type: 'success'
    })
  }
  
  return { addToCart }
}
```

### 2. Stores

Используйте Pinia stores для глобального состояния:

```typescript
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadFromStorage('cart') || [])
  
  const total = computed(() => 
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  
  const addItem = (product: Product) => {
    // логика добавления
    saveToStorage('cart', items.value)
  }
  
  return { items, total, addItem }
})
```

### 3. Props и Emits

Используйте типизированные props и emits:

```typescript
interface Props {
  product: Product
  variant?: 'card' | 'list'
}

interface Emits {
  (e: 'addToCart', product: Product): void
  (e: 'click', product: Product): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
```

### 4. Валидация

Используйте централизованные валидаторы:

```typescript
import { validateEmail, validatePhone } from '@/shared/lib/validators'

const errors = reactive<Record<string, string>>({})

const validateForm = () => {
  errors.email = validateEmail(formData.email) 
    ? '' 
    : 'Некорректный email'
}
```

## Оптимизация производительности

### 1. Lazy Loading

Все страницы загружаются по требованию:

```typescript
{
  path: '/catalog',
  component: () => import('@/pages/catalog/CatalogPage.vue')
}
```

### 2. Code Splitting

Vite автоматически разделяет код на chunks:

```typescript
manualChunks: {
  'vue-vendor': ['vue', 'vue-router', 'pinia'],
  'ui-components': [...],
  'entities': [...]
}
```

### 3. v-memo

Используйте v-memo для оптимизации списков:

```vue
<ProductCard
  v-for="product in products"
  :key="product.id"
  v-memo="[product.id, product.price]"
  :product="product"
/>
```

### 4. Computed Properties

Используйте computed для кэширования вычислений:

```typescript
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // фильтрация
  })
})
```

## Тестирование

### Unit Tests

Тестируйте изолированные компоненты и функции:

```typescript
describe('formatPrice', () => {
  it('should format price correctly', () => {
    expect(formatPrice(1000)).toBe('1 000 ₽')
  })
})
```

### Property-Based Tests

Тестируйте универсальные свойства:

```typescript
// Property 1: Cart persistence round-trip
test('cart data survives save/load cycle', () => {
  fc.assert(
    fc.property(fc.array(cartItemArbitrary), (items) => {
      saveToStorage('cart', items)
      const loaded = loadFromStorage('cart')
      expect(loaded).toEqual(items)
    })
  )
})
```

### Integration Tests

Тестируйте взаимодействие компонентов:

```typescript
describe('CatalogPage', () => {
  it('should filter products by category', async () => {
    // тест фильтрации
  })
})
```

## Заключение

Архитектура проекта основана на проверенных принципах и паттернах, обеспечивающих:

- ✅ Масштабируемость
- ✅ Поддерживаемость
- ✅ Тестируемость
- ✅ Переиспользуемость
- ✅ Производительность

Следуйте этим принципам при разработке новых функций и рефакторинге существующего кода.
