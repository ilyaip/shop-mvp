# План реализации: Интеграция с Backend API

## Обзор

Этот план описывает пошаговую интеграцию Vue E-commerce приложения с реальным бэкендом API на `http://localhost:8000`. Замена моковых данных на реальные HTTP запросы, настройка axios клиента, преобразование данных и обработка ошибок.

## Задачи

- [x] 1. Установка зависимостей и настройка окружения
  - Установить axios: `npm install axios`
  - Создать .env файл с VITE_API_BASE_URL=http://localhost:8000
  - Создать .env.example с примером конфигурации
  - Добавить .env в .gitignore если еще не добавлен
  - _Requirements: 1.1, 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 2. Создание типов для API
  - [x] 2.1 Создать типы API ответов в shared/api/types.ts
    - Определить SiteSettingsResponse с snake_case полями
    - Определить ProductResponse с snake_case полями
    - Определить ProductListResponse
    - Определить APIError
    - _Requirements: 2.1, 3.1, 4.1_
  
  - [x] 2.2 Обновить типы Product в entities/product/model/types.ts
    - Добавить опциональные поля: manufacturer, images, video, dimensions, weight
    - Сохранить обратную совместимость
    - _Requirements: 3.3, 4.2_

- [x] 3. Создание axios клиента
  - [x] 3.1 Создать API клиент в shared/api/client.ts
    - Создать axios instance с baseURL из env
    - Настроить timeout: 10000ms
    - Настроить headers: Content-Type: application/json
    - Настроить withCredentials: false
    - _Requirements: 1.1, 1.2, 13.1, 13.2, 13.3_
  
  - [x] 3.2 Добавить request interceptor
    - Логировать запросы в development режиме
    - Формат: [API Request] METHOD URL
    - _Requirements: 1.4_
  
  - [x] 3.3 Добавить response interceptor
    - Логировать ответы в development режиме
    - Обрабатывать ошибки через handleAPIError
    - _Requirements: 1.3_
  
  - [x] 3.4 Создать функцию handleAPIError
    - Обрабатывать ошибки 404: "Данные не найдены"
    - Обрабатывать ошибки 500: "Ошибка сервера"
    - Обрабатывать timeout: "Превышено время ожидания"
    - Обрабатывать network errors: "Ошибка подключения к серверу"
    - Обрабатывать CORS errors с понятными сообщениями
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 13.4_
  
  - [ ]* 3.5 Написать unit тесты для API клиента
    - Тестировать создание instance с правильной конфигурацией
    - Тестировать request interceptor
    - Тестировать response interceptor
    - Тестировать handleAPIError для разных типов ошибок
    - _Requirements: 1.2, 1.3, 1.4, 9.1, 9.2, 9.3, 9.4_

- [-] 4. Создание утилит преобразования данных
  - [x] 4.1 Создать transformers в shared/api/transformers.ts
    - Реализовать snakeToCamel для преобразования строк
    - Реализовать transformKeys для преобразования объектов
    - Реализовать transformSiteSettings
    - Реализовать transformProduct
    - Реализовать filterActiveProducts
    - _Requirements: 10.1, 10.2, 10.3, 3.2, 3.3_
  
  - [ ]* 4.2 Написать unit тесты для transformers
    - Тестировать snakeToCamel с различными входными данными
    - Тестировать transformKeys с вложенными объектами
    - Тестировать transformSiteSettings
    - Тестировать transformProduct
    - Тестировать filterActiveProducts
    - Тестировать обработку отсутствующих полей
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [ ]* 4.3 Написать property тест для преобразования данных
    - **Property 1: Data transformation consistency**
    - **Validates: Requirements 2.2**
  
  - [ ]* 4.4 Написать property тест для фильтрации активных товаров
    - **Property 2: Active products filtering**
    - **Validates: Requirements 3.2**
  
  - [ ]* 4.5 Написать property тест для преобразования товаров
    - **Property 3: Product transformation completeness**
    - **Validates: Requirements 3.3**

- [x] 5. Создание API функций для настроек сайта
  - [x] 5.1 Создать API для настроек в shared/api/site-settings.ts
    - Создать дефолтную тему как fallback
    - Реализовать fetchSiteSettings с запросом к /dev-api/site-settings/active
    - Преобразовать ответ через transformSiteSettings
    - Обрабатывать ошибки с fallback на дефолтную тему
    - Логировать ошибки в консоль
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [ ]* 5.2 Написать unit тесты для site-settings API
    - Мокировать axios запросы
    - Тестировать успешную загрузку настроек
    - Тестировать преобразование данных
    - Тестировать fallback при ошибке
    - Тестировать логирование ошибок
    - _Requirements: 2.1, 2.6, 2.7_

- [x] 6. Создание API функций для товаров
  - [x] 6.1 Создать API для товаров в shared/api/products.ts
    - Реализовать fetchProducts с запросом к /dev-api/product/list
    - Фильтровать товары по is_site_active: true
    - Преобразовать товары через transformProduct
    - Обрабатывать ошибки с fallback на пустой массив
    - Логировать ошибки в консоль
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.5_
  
  - [x] 6.2 Реализовать fetchProductById
    - Запрос к /dev-api/product/{product_id}
    - Проверять is_site_active
    - Преобразовать товар через transformProduct
    - Обрабатывать 404 ошибку
    - Возвращать null при ошибке
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 6.3 Написать unit тесты для products API
    - Мокировать axios запросы
    - Тестировать fetchProducts
    - Тестировать фильтрацию активных товаров
    - Тестировать fetchProductById
    - Тестировать обработку 404
    - Тестировать fallback при ошибках
    - _Requirements: 3.1, 3.2, 4.1, 4.3, 4.4_

- [x] 7. Обновление useThemeStore
  - [x] 7.1 Обновить useThemeStore в app/stores/theme.ts
    - Добавить state: error (string | null)
    - Обновить loadSettings для использования fetchSiteSettings
    - Устанавливать isLoading: true перед запросом
    - Устанавливать isLoading: false после запроса
    - Сохранять ошибку в state при неудаче
    - Применять тему через applyTheme при успехе
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 7.2 Написать unit тесты для обновленного useThemeStore
    - Мокировать fetchSiteSettings
    - Тестировать успешную загрузку настроек
    - Тестировать применение темы
    - Тестировать обработку ошибок
    - Тестировать состояния isLoading
    - Тестировать сохранение ошибки в state
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 7.3 Написать property тест для применения темы
    - **Property 4: Theme application after load**
    - **Validates: Requirements 5.2**
  
  - [ ]* 7.4 Написать property тест для кэширования настроек
    - **Property 8: Settings caching behavior**
    - **Validates: Requirements 14.1**

- [x] 8. Обновление useProductsStore
  - [x] 8.1 Обновить useProductsStore в app/stores/products.ts
    - Добавить state: error (string | null)
    - Создать action loadProducts
    - Устанавливать isLoading: true перед запросом
    - Устанавливать isLoading: false после запроса
    - Сохранять ошибку в state при неудаче
    - Сохранять товары в state при успехе
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [x] 8.2 Обновить getProductById
    - Сначала искать товар в state (кэш)
    - Если не найден, вызывать fetchProductById
    - Добавлять загруженный товар в state
    - Возвращать null при ошибке
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 8.3 Написать unit тесты для обновленного useProductsStore
    - Мокировать fetchProducts и fetchProductById
    - Тестировать loadProducts
    - Тестировать сохранение товаров в state
    - Тестировать обработку ошибок
    - Тестировать состояния isLoading
    - Тестировать getProductById с кэшем
    - Тестировать getProductById без кэша
    - _Requirements: 6.1, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 8.4 Написать property тест для сохранения товаров
    - **Property 5: Products state persistence**
    - **Validates: Requirements 6.3**
  
  - [ ]* 8.5 Написать property тест для кэширования товаров
    - **Property 6: Product caching behavior**
    - **Validates: Requirements 7.2**
  
  - [ ]* 8.6 Написать property тест для загрузки товара из API
    - **Property 7: Product API fetch on cache miss**
    - **Validates: Requirements 7.3, 7.4**

- [x] 9. Checkpoint - Проверка API интеграции
  - Убедиться что бэкенд запущен на http://localhost:8000
  - Проверить что все API функции работают
  - Проверить что stores загружают данные
  - Проверить обработку ошибок
  - Спросить пользователя, если возникли вопросы

- [x] 10. Обновление CatalogPage
  - Обновить CatalogPage в pages/catalog/CatalogPage.vue
  - Вызывать loadProducts() при монтировании компонента
  - Отображать ProductSkeleton пока isLoading: true
  - Отображать сообщение об ошибке если error не null
  - Отображать "Товары не найдены" если products пустой после загрузки
  - _Requirements: 3.6, 8.1, 8.2_

- [x] 11. Обновление ProductPage
  - Обновить ProductPage в pages/product/ProductPage.vue
  - Использовать getProductById для загрузки товара
  - Отображать Skeleton пока товар загружается
  - Отображать "Товар не найден" если товар null
  - Отображать сообщение об ошибке при ошибке загрузки
  - _Requirements: 4.3, 4.4, 4.5, 8.3_

- [x] 12. Обновление LandingPage
  - Обновить LandingPage в pages/landing/LandingPage.vue
  - Отображать Skeleton для hero секции пока isLoading: true
  - Использовать hero настройки из useTheme
  - Обрабатывать отсутствие hero изображения (градиентный fallback)
  - _Requirements: 8.4, 8.5_

- [x] 13. Обновление инициализации приложения
  - [x] 13.1 Обновить main.ts
    - Вызывать themeStore.loadSettings() после создания pinia
    - Вызывать productsStore.loadProducts() после создания pinia
    - Обеспечить загрузку данных до монтирования приложения
    - _Requirements: 5.1, 6.7_
  
  - [x] 13.2 Обновить App.vue если необходимо
    - Добавить глобальный индикатор загрузки (опционально)
    - Обрабатывать глобальные ошибки API (опционально)
    - _Requirements: 8.1, 8.2_

- [x] 14. Удаление моковых данных
  - [x] 14.1 Удалить файл shared/api/mock-data.ts
    - Удалить весь файл с моковыми товарами
    - _Requirements: 11.1_
  
  - [x] 14.2 Обновить shared/api/theme-data.ts
    - Удалить моковые данные тем (lightTheme, darkTheme, blueTheme, greenTheme)
    - Сохранить только getPresetTheme для ThemeSwitcher
    - Удалить fetchThemeSettings (теперь в site-settings.ts)
    - _Requirements: 11.2, 11.3_
  
  - [x] 14.3 Обновить все импорты
    - Найти все импорты mockProducts и удалить
    - Обновить импорты fetchThemeSettings на новый путь
    - Проверить что нет сломанных импортов
    - _Requirements: 11.4_
  
  - [x] 14.4 Обновить тесты
    - Обновить тесты которые использовали моковые данные
    - Использовать моки API вместо моковых данных
    - _Requirements: 11.5_

- [ ] 15. Тестирование обратной совместимости
  - [ ]* 15.1 Запустить все существующие тесты
    - Убедиться что все тесты проходят
    - Исправить сломанные тесты
    - _Requirements: 15.5_
  
  - [ ]* 15.2 Тестировать работу корзины
    - Проверить добавление товаров в корзину
    - Проверить сохранение в localStorage
    - Проверить оформление заказа
    - _Requirements: 15.1_
  
  - [ ]* 15.3 Тестировать работу заказов
    - Проверить сохранение заказов в localStorage
    - Проверить отображение в профиле
    - _Requirements: 15.2_
  
  - [ ]* 15.4 Тестировать фильтрацию товаров
    - Проверить фильтрацию по цене
    - Проверить что фильтры работают с API данными
    - _Requirements: 15.3_
  
  - [ ]* 15.5 Тестировать все страницы
    - Проверить работу всех страниц с API данными
    - Проверить навигацию
    - Проверить состояния загрузки
    - _Requirements: 15.4_

- [x] 16. Обработка edge cases
  - [x] 16.1 Добавить обработку пустого списка товаров
    - Отображать сообщение "Товары не найдены"
    - Добавить кнопку "Обновить"
    - _Requirements: 3.5_
  
  - [x] 16.2 Добавить обработку отсутствия цены
    - Использовать значение 0 как fallback
    - Отображать "Цена уточняется" в UI
    - _Requirements: 10.5_
  
  - [x] 16.3 Добавить обработку CORS ошибок
    - Отображать понятное сообщение
    - Добавить ссылку на документацию CORS
    - _Requirements: 13.4, 13.5_

- [ ] 17. Документация
  - [ ] 17.1 Создать документацию API интеграции
    - Описать структуру API endpoints
    - Описать формат данных
    - Описать обработку ошибок
    - Добавить примеры запросов/ответов
    - _Requirements: 13.5_
  
  - [ ] 17.2 Обновить README.md
    - Добавить информацию о бэкенде
    - Добавить инструкции по настройке .env
    - Добавить информацию о CORS
    - Добавить troubleshooting секцию
    - _Requirements: 12.4, 13.5_
  
  - [ ] 17.3 Создать .env.example
    - Добавить VITE_API_BASE_URL с примером
    - Добавить комментарии
    - _Requirements: 12.4_

- [ ] 18. Финальное тестирование
  - [ ]* 18.1 Запустить все unit тесты
    - Убедиться что все тесты проходят
    - Проверить покрытие кода
  
  - [ ]* 18.2 Запустить все property тесты
    - Убедиться что все property тесты проходят
    - Проверить минимум 100 итераций
  
  - [ ]* 18.3 Запустить все integration тесты
    - Убедиться что все integration тесты проходят
    - Проверить работу с моками API
  
  - [ ]* 18.4 Тестирование с реальным бэкендом
    - Запустить бэкенд на http://localhost:8000
    - Проверить загрузку настроек сайта
    - Проверить загрузку товаров
    - Проверить детали товара
    - Проверить обработку ошибок
    - Проверить состояния загрузки

- [ ] 19. Финальный checkpoint
  - Проверить работу всего приложения с реальным бэкендом
  - Убедиться что все требования выполнены
  - Проверить что моковые данные удалены
  - Проверить что все существующие фичи работают
  - Проверить производительность
  - Задокументировать известные проблемы (если есть)
  - Спросить пользователя о финальных правках

## Примечания

- Задачи, помеченные `*`, являются опциональными и могут быть пропущены для более быстрой интеграции
- Каждая задача ссылается на конкретные требования для отслеживаемости
- Checkpoints обеспечивают инкрементальную валидацию
- Property тесты валидируют универсальные свойства корректности
- Все изменения сохраняют обратную совместимость
- Бэкенд должен быть запущен на http://localhost:8000 для тестирования
- CORS должен быть настроен на бэкенде для работы с фронтендом
