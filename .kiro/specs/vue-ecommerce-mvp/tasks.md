# План реализации: Vue E-commerce MVP

## Обзор

Этот план описывает пошаговую реализацию современного интернет-магазина на Vue 3 с TypeScript и архитектурой FSD. Каждая задача строится на предыдущих, обеспечивая инкрементальный прогресс с валидацией на каждом этапе.

## Задачи

- [x] 1. Инициализация проекта и базовая настройка
  - Создать проект с Vite + Vue 3 + TypeScript в директории `/Users/ula/Work/electron`
  - Настроить TypeScript с strict mode
  - Установить зависимости: vue-router, pinia, lucide-vue-next
  - Настроить ESLint и Prettier
  - Создать базовую структуру директорий согласно FSD
  - Настроить алиасы путей в vite.config.ts и tsconfig.json
  - _Requirements: 1.1, 1.3, 1.5, 12.1, 12.2, 12.3_

- [x] 2. Создание дизайн-системы и базовых стилей
  - Создать CSS-переменные в app/styles/variables.css
  - Создать базовые стили и reset в app/styles/base.css
  - Создать app/styles/index.css с импортами всех стилей
  - Подключить стили в main.ts
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 3. Создание UI-компонентов в shared/ui
  - [x] 3.1 Создать компонент Button с вариантами (primary, secondary, outline)
    - Реализовать Button.vue с props: variant, disabled, loading
    - Добавить стили для всех вариантов
    - Создать index.ts для экспорта
    - _Requirements: 9.1_
  
  - [ ]* 3.2 Написать unit тесты для Button
    - Тестировать рендеринг всех вариантов
    - Тестировать события click
    - Тестировать disabled состояние
    - _Requirements: 9.1_
  
  - [x] 3.3 Создать компонент Input с валидацией
    - Реализовать Input.vue с props: type, label, modelValue, error, placeholder
    - Добавить стили и состояния ошибок
    - Создать index.ts для экспорта
    - _Requirements: 9.2_
  
  - [ ]* 3.4 Написать unit тесты для Input
    - Тестировать v-model binding
    - Тестировать отображение ошибок
    - Тестировать различные типы input
    - _Requirements: 9.2_
  
  - [x] 3.5 Создать компонент Card
    - Реализовать Card.vue с slot для контента
    - Добавить стили с тенями
    - Создать index.ts для экспорта
    - _Requirements: 9.3_
  
  - [x] 3.6 Создать компонент Modal
    - Реализовать Modal.vue с props: isOpen, title
    - Добавить overlay и анимации
    - Реализовать закрытие по клику вне модалки и по ESC
    - Создать index.ts для экспорта
    - _Requirements: 9.4_
  
  - [x] 3.7 Создать компонент Skeleton для состояний загрузки
    - Реализовать Skeleton.vue с props: width, height, variant
    - Добавить анимацию пульсации
    - Создать index.ts для экспорта
    - _Requirements: 9.5_
  
  - [x] 3.8 Создать компонент Notification
    - Реализовать Notification.vue с props: message, type (success, error, info)
    - Добавить анимации появления/исчезновения
    - Создать index.ts для экспорта
    - _Requirements: 9.7_

- [x] 4. Создание типов и утилит в shared
  - [x] 4.1 Создать глобальные типы в shared/types/global.ts
    - Определить общие типы и интерфейсы
    - _Requirements: 1.3_
  
  - [x] 4.2 Создать утилиты для localStorage в shared/lib/storage.ts
    - Реализовать loadFromStorage, saveToStorage, removeFromStorage
    - Добавить обработку ошибок
    - _Requirements: 2.5, 2.6_
  
  - [ ]* 4.3 Написать unit тесты для storage утилит
    - Тестировать сохранение и загрузку данных
    - Тестировать обработку ошибок
    - Тестировать работу с несуществующими ключами
    - _Requirements: 2.5, 2.6_
  
  - [x] 4.4 Создать валидаторы в shared/lib/validators.ts
    - Реализовать validateEmail, validatePhone, validateRequired
    - _Requirements: 6.3_
  
  - [ ]* 4.5 Написать unit тесты для валидаторов
    - Тестировать валидацию email (валидные и невалидные)
    - Тестировать валидацию телефона
    - Тестировать validateRequired
    - _Requirements: 6.3_
  
  - [ ]* 4.6 Написать property тест для валидаторов
    - **Property 9: Form validation correctness**
    - **Validates: Requirements 6.3, 6.4**
  
  - [x] 4.7 Создать форматтеры в shared/lib/formatters.ts
    - Реализовать formatPrice, formatDate
    - _Requirements: 3.2, 7.3_
  
  - [ ]* 4.8 Написать unit тесты для форматтеров
    - Тестировать форматирование цен
    - Тестировать форматирование дат
    - _Requirements: 3.2, 7.3_

- [x] 5. Создание моковых данных
  - Создать shared/api/mock-data.ts с массивом из 12 товаров
  - Включить поля: id, title, description, price, image, category
  - Создать минимум 3 категории
  - Экспортировать mockProducts и mockCategories
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ]* 5.1 Написать тест для структуры моковых данных
  - **Property 14: Mock data structure completeness**
  - **Validates: Requirements 11.2**

- [x] 6. Создание типов сущностей (entities)
  - [x] 6.1 Создать типы Product в entities/product/model/types.ts
    - Определить интерфейсы Product, ProductFilters
    - Создать index.ts для экспорта
    - _Requirements: 3.1, 3.3_
  
  - [x] 6.2 Создать типы Cart в entities/cart/model/types.ts
    - Определить интерфейсы CartItem, CartState
    - Создать index.ts для экспорта
    - _Requirements: 5.1, 5.3_
  
  - [x] 6.3 Создать типы Order в entities/order/model/types.ts
    - Определить интерфейсы OrderData, Order
    - Создать index.ts для экспорта
    - _Requirements: 6.2, 7.2_
  
  - [x] 6.4 Создать типы User в entities/user/model/types.ts
    - Определить интерфейс UserState
    - Создать index.ts для экспорта
    - _Requirements: 7.1_

- [x] 7. Создание Pinia stores
  - [x] 7.1 Создать useProductsStore в app/stores/products.ts
    - Реализовать state: products, filters, isLoading
    - Реализовать computed: filteredProducts, categories
    - Реализовать actions: setFilters, clearFilters, getProductById
    - Загрузить моковые данные
    - _Requirements: 2.2, 3.3, 3.4, 3.5_
  
  - [ ]* 7.2 Написать unit тесты для useProductsStore
    - Тестировать загрузку товаров
    - Тестировать получение категорий
    - Тестировать getProductById
    - _Requirements: 2.2, 3.3_
  
  - [ ]* 7.3 Написать property тест для фильтрации товаров
    - **Property 3: Product filtering correctness**
    - **Validates: Requirements 3.3, 3.4, 3.5**
  
  - [x] 7.4 Создать useCartStore в app/stores/cart.ts
    - Реализовать state: items (загрузка из localStorage)
    - Реализовать computed: total, itemCount
    - Реализовать actions: addItem, removeItem, updateQuantity, clearCart
    - Сохранять изменения в localStorage
    - _Requirements: 2.1, 2.5, 2.6, 5.4, 5.5, 5.6_
  
  - [ ]* 7.5 Написать unit тесты для useCartStore
    - Тестировать добавление товара в пустую корзину
    - Тестировать добавление существующего товара (увеличение количества)
    - Тестировать удаление товара
    - Тестировать обновление количества
    - Тестировать очистку корзины
    - Тестировать edge case: пустая корзина
    - _Requirements: 2.1, 5.4, 5.5, 5.7_
  
  - [ ]* 7.6 Написать property тест для персистентности корзины
    - **Property 1: Cart persistence round-trip**
    - **Validates: Requirements 2.5, 2.6**
  
  - [ ]* 7.7 Написать property тест для подсчета суммы корзины
    - **Property 8: Cart total calculation invariant**
    - **Validates: Requirements 5.4, 5.5, 5.6**
  
  - [x] 7.8 Создать useUserStore в app/stores/user.ts
    - Реализовать state: orders (загрузка из localStorage)
    - Реализовать action: addOrder (сохранение в localStorage)
    - _Requirements: 2.3, 6.6, 7.2_
  
  - [ ]* 7.9 Написать unit тесты для useUserStore
    - Тестировать добавление заказа
    - Тестировать загрузку заказов из localStorage
    - Тестировать edge case: нет заказов
    - _Requirements: 2.3, 6.6, 7.4_
  
  - [ ]* 7.10 Написать property тест для персистентности заказов
    - **Property 10: Order persistence**
    - **Validates: Requirements 6.6**
  
  - [x] 7.11 Создать useUIStore в app/stores/ui.ts
    - Реализовать state: notifications
    - Реализовать actions: showNotification, removeNotification
    - Автоматическое удаление уведомлений через 3 секунды
    - _Requirements: 2.4, 4.5, 6.7_
  
  - [ ]* 7.12 Написать unit тесты для useUIStore
    - Тестировать добавление уведомления
    - Тестировать автоматическое удаление уведомления
    - Тестировать ручное удаление уведомления
    - _Requirements: 2.4_

- [x] 8. Checkpoint - Проверка stores и утилит
  - Убедиться, что все тесты проходят
  - Проверить, что stores корректно работают с localStorage
  - Спросить пользователя, если возникли вопросы

- [x] 9. Создание компонентов сущностей (entities)
  - [x] 9.1 Создать ProductCard в entities/product/ui/ProductCard.vue
    - Отображать изображение, название, описание, цену
    - Добавить кнопку "Добавить в корзину"
    - Emit события: addToCart, click
    - Добавить стили с hover эффектами
    - _Requirements: 3.2, 4.2_
  
  - [ ]* 9.2 Написать unit тест для ProductCard
    - Тестировать рендеринг всех полей товара
    - Тестировать события
    - _Requirements: 3.2_
  
  - [ ]* 9.3 Написать property тест для ProductCard
    - **Property 2: Product card rendering completeness**
    - **Validates: Requirements 3.2**
  
  - [x] 9.4 Создать ProductSkeleton в entities/product/ui/ProductSkeleton.vue
    - Создать скелетон с теми же размерами что и ProductCard
    - Добавить анимацию пульсации
    - _Requirements: 3.6_
  
  - [x] 9.5 Создать CartItem в entities/cart/ui/CartItem.vue
    - Отображать изображение, название, цену, количество
    - Добавить кнопки +/- для изменения количества
    - Добавить кнопку удаления
    - Emit события: updateQuantity, remove
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [ ]* 9.6 Написать unit тест для CartItem
    - Тестировать рендеринг всех полей
    - Тестировать изменение количества
    - Тестировать удаление
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [ ]* 9.7 Написать property тест для CartItem
    - **Property 7: Cart item rendering completeness**
    - **Validates: Requirements 5.3**
  
  - [x] 9.8 Создать OrderCard в entities/order/ui/OrderCard.vue
    - Отображать дату, список товаров, общую стоимость
    - Добавить стили для карточки заказа
    - _Requirements: 7.3_
  
  - [ ]* 9.9 Написать property тест для OrderCard
    - **Property 12: Order history rendering**
    - **Validates: Requirements 7.2, 7.3**

- [x] 10. Создание фич (features)
  - [x] 10.1 Создать feature add-to-cart
    - Создать composable useAddToCart в features/add-to-cart/model/useAddToCart.ts
    - Использовать useCartStore и useUIStore
    - Показывать уведомление при добавлении
    - Создать AddToCartButton.vue в features/add-to-cart/ui/
    - Создать index.ts для экспорта
    - _Requirements: 4.5_
  
  - [ ]* 10.2 Написать unit тест для add-to-cart
    - Тестировать добавление товара в корзину
    - Тестировать показ уведомления
    - _Requirements: 4.5_
  
  - [ ]* 10.3 Написать property тест для add-to-cart
    - **Property 5: Add to cart operation**
    - **Validates: Requirements 4.5**
  
  - [x] 10.4 Создать feature product-filters
    - Создать composable useFilters в features/product-filters/model/useFilters.ts
    - Создать CategoryFilter.vue в features/product-filters/ui/
    - Создать PriceFilter.vue в features/product-filters/ui/
    - Использовать useProductsStore
    - Создать index.ts для экспорта
    - _Requirements: 3.3, 3.4, 3.5_
  
  - [ ]* 10.5 Написать unit тесты для product-filters
    - Тестировать применение фильтров по категории
    - Тестировать применение фильтров по цене
    - Тестировать очистку фильтров
    - _Requirements: 3.3, 3.4, 3.5_
  
  - [x] 10.6 Создать feature checkout-form
    - Создать composable useCheckoutForm в features/checkout-form/model/useCheckoutForm.ts
    - Реализовать валидацию полей
    - Создать CheckoutForm.vue в features/checkout-form/ui/
    - Использовать useCartStore, useUserStore, useUIStore
    - Создать index.ts для экспорта
    - _Requirements: 6.2, 6.3, 6.4, 6.6, 6.7_
  
  - [ ]* 10.7 Написать unit тесты для checkout-form
    - Тестировать валидацию каждого поля
    - Тестировать отправку формы с валидными данными
    - Тестировать отправку формы с невалидными данными
    - _Requirements: 6.3, 6.4_
  
  - [ ]* 10.8 Написать property тест для очистки корзины после checkout
    - **Property 11: Cart clearing after checkout**
    - **Validates: Requirements 6.7**

- [x] 11. Создание виджетов (widgets)
  - [x] 11.1 Создать CartWidget в widgets/cart-widget/ui/CartWidget.vue
    - Отображать иконку корзины и количество товаров
    - Использовать useCartStore
    - Добавить router-link на /cart
    - Создать index.ts для экспорта
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 11.2 Написать unit тест для CartWidget
    - Тестировать отображение количества товаров
    - Тестировать edge case: пустая корзина
    - _Requirements: 5.1_
  
  - [ ]* 11.3 Написать property тест для CartWidget
    - **Property 6: Cart widget count accuracy**
    - **Validates: Requirements 5.1**
  
  - [x] 11.4 Создать AppHeader в widgets/header/ui/AppHeader.vue
    - Добавить логотип и название магазина
    - Добавить навигационные ссылки: Каталог, Профиль
    - Интегрировать CartWidget
    - Добавить адаптивное меню для мобильных
    - Создать index.ts для экспорта
    - _Requirements: 8.4_
  
  - [x] 11.5 Создать AppFooter в widgets/footer/ui/AppFooter.vue
    - Добавить информацию о магазине
    - Добавить ссылки на социальные сети (placeholder)
    - Добавить копирайт
    - Создать index.ts для экспорта
    - _Requirements: 8.5_

- [x] 12. Настройка маршрутизации
  - Создать app/router/index.ts
  - Настроить маршруты: /, /catalog, /product/:id, /cart, /checkout, /profile
  - Настроить redirect с / на /catalog
  - Настроить fallback на /catalog для несуществующих маршрутов
  - Использовать ленивую загрузку для всех страниц
  - _Requirements: 8.1, 8.2, 8.3, 8.6_

- [ ]* 12.1 Написать unit тест для маршрутизации
  - Тестировать redirect с / на /catalog
  - Тестировать fallback для несуществующих маршрутов
  - _Requirements: 8.6_

- [ ]* 12.2 Написать property тест для fallback маршрутов
  - **Property 13: Route fallback behavior**
  - **Validates: Requirements 8.6**

- [x] 13. Создание страниц (pages)
  - [x] 13.1 Создать CatalogPage в pages/catalog/CatalogPage.vue
    - Отображать ProductFilters
    - Отображать сетку ProductCard компонентов
    - Показывать ProductSkeleton при загрузке
    - Использовать useProductsStore
    - Обрабатывать клик на товар (навигация на /product/:id)
    - Обрабатывать добавление в корзину
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 4.1_
  
  - [ ]* 13.2 Написать integration тест для CatalogPage
    - Тестировать отображение товаров
    - Тестировать фильтрацию
    - Тестировать навигацию на страницу товара
    - _Requirements: 3.1, 3.3, 4.1_
  
  - [ ]* 13.3 Написать property тест для навигации на товар
    - **Property 4: Product navigation**
    - **Validates: Requirements 4.1**
  
  - [x] 13.4 Создать ProductPage в pages/product/ProductPage.vue
    - Получать id товара из route params
    - Использовать useProductsStore.getProductById
    - Отображать полную информацию о товаре
    - Интегрировать AddToCartButton
    - Обрабатывать случай несуществующего товара
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 13.5 Написать unit тест для ProductPage
    - Тестировать отображение информации о товаре
    - Тестировать edge case: несуществующий товар
    - _Requirements: 4.2, 4.3_
  
  - [x] 13.6 Создать CartPage в pages/cart/CartPage.vue
    - Использовать useCartStore
    - Отображать список CartItem компонентов
    - Отображать общую стоимость
    - Показывать сообщение "Корзина пуста" если items.length === 0
    - Добавить кнопку "Оформить заказ" (router-link на /checkout)
    - Обрабатывать изменение количества и удаление товаров
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_
  
  - [ ]* 13.7 Написать integration тест для CartPage
    - Тестировать отображение товаров в корзине
    - Тестировать изменение количества
    - Тестировать удаление товара
    - Тестировать подсчет общей стоимости
    - Тестировать edge case: пустая корзина
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 13.8 Создать CheckoutPage в pages/checkout/CheckoutPage.vue
    - Интегрировать CheckoutForm
    - Отображать итоговую стоимость заказа
    - Обрабатывать успешное оформление заказа
    - Перенаправлять на /profile после успеха
    - _Requirements: 6.1, 6.2, 6.5, 6.6, 6.7, 6.8_
  
  - [ ]* 13.9 Написать integration тест для CheckoutPage
    - Тестировать полный flow оформления заказа
    - Тестировать валидацию формы
    - Тестировать очистку корзины после оформления
    - Тестировать перенаправление на /profile
    - _Requirements: 6.1, 6.3, 6.6, 6.7, 6.8_
  
  - [x] 13.10 Создать ProfilePage в pages/profile/ProfilePage.vue
    - Использовать useUserStore
    - Отображать список OrderCard компонентов
    - Показывать сообщение "У вас пока нет заказов" если orders.length === 0
    - Добавить кнопку "Перейти в каталог"
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 13.11 Написать unit тест для ProfilePage
    - Тестировать отображение заказов
    - Тестировать edge case: нет заказов
    - _Requirements: 7.2, 7.4_

- [x] 14. Checkpoint - Проверка страниц и навигации
  - Убедиться, что все тесты проходят
  - Проверить навигацию между страницами
  - Проверить работу всех features
  - Спросить пользователя, если возникли вопросы

- [x] 15. Создание корневого приложения
  - [x] 15.1 Создать App.vue
    - Добавить AppHeader
    - Добавить <router-view> для страниц
    - Добавить AppFooter
    - Добавить контейнер для Notification компонентов
    - Использовать useUIStore для отображения уведомлений
    - _Requirements: 8.4, 8.5_
  
  - [x] 15.2 Создать main.ts
    - Инициализировать Vue приложение
    - Подключить Pinia
    - Подключить Vue Router
    - Подключить глобальные стили
    - Монтировать приложение
    - _Requirements: 1.5, 2.1, 8.1_
  
  - [x] 15.3 Обновить index.html
    - Добавить мета-теги для SEO
    - Подключить шрифт Inter из Google Fonts
    - Настроить viewport
    - _Requirements: 10.3_

- [x] 16. Адаптивный дизайн и полировка стилей
  - Проверить адаптивность всех компонентов на мобильных, планшетах, десктопах
  - Добавить медиа-запросы где необходимо
  - Проверить работу сетки товаров на разных разрешениях
  - Добавить плавные переходы и анимации
  - Проверить тени и визуальную глубину
  - _Requirements: 10.4, 10.5, 10.6, 10.7_

- [x] 17. Оптимизация производительности
  - Добавить loading="lazy" для изображений товаров
  - Проверить работу ленивой загрузки страниц
  - Добавить v-memo для списков товаров и корзины
  - Настроить code splitting в vite.config.ts
  - _Requirements: 3.7, 8.3_

- [x] 18. Доступность (A11y)
  - Добавить aria-label для интерактивных элементов
  - Проверить семантический HTML
  - Проверить клавиатурную навигацию
  - Добавить role="alert" для ошибок валидации
  - Проверить контрастность цветов
  - Добавить видимые индикаторы фокуса
  - _Requirements: 10.1, 10.2_

- [ ] 19. Финальное тестирование
  - [ ]* 19.1 Запустить все unit тесты
    - Убедиться, что все тесты проходят
    - Проверить покрытие кода
  
  - [ ]* 19.2 Запустить все property тесты
    - Убедиться, что все property тесты проходят
    - Проверить, что каждый тест выполняется минимум 100 итераций
  
  - [ ]* 19.3 Запустить все integration тесты
    - Убедиться, что все integration тесты проходят
    - Проверить полные user flows

- [x] 20. Финальный checkpoint и документация
  - Проверить работу всего приложения
  - Убедиться, что все требования выполнены
  - Создать README.md с инструкциями по запуску
  - Задокументировать структуру проекта
  - Спросить пользователя о финальных правках

## Примечания

- Задачи, помеченные `*`, являются опциональными и могут быть пропущены для более быстрого MVP
- Каждая задача ссылается на конкретные требования для отслеживаемости
- Checkpoints обеспечивают инкрементальную валидацию
- Property тесты валидируют универсальные свойства корректности
- Unit тесты валидируют конкретные примеры и граничные случаи
- Integration тесты проверяют взаимодействие между компонентами
