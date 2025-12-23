# План реализации: Система динамической темизации и улучшения UI/UX

## Обзор

Этот план описывает пошаговую реализацию системы динамической темизации, которая превращает интернет-магазин в конструктор с настройками с бэкенда. Включает новую посадочную страницу, liquid glass эффекты в стиле Apple, улучшенный UI/UX и упрощенные фильтры.

## Задачи

- [x] 1. Создание типов и моковых данных для темизации
  - [x] 1.1 Создать типы для темизации в shared/types/theme.ts
    - Определить интерфейсы: ThemeColors, BrandSettings, HeroSettings, FrontSettings, ThemePreset
    - Экспортировать все типы
    - _Requirements: 1.4, 2.1, 3.2, 8.2_
  
  - [x] 1.2 Создать моковые данные тем в shared/api/theme-data.ts
    - Создать 4 предустановленные темы: light, dark, blue, green
    - Каждая тема должна содержать: colors, brand, hero
    - Реализовать функции: fetchThemeSettings, getPresetTheme, getAvailablePresets
    - Добавить имитацию асинхронной загрузки с задержкой 500ms
    - _Requirements: 7.2, 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 1.3 Написать unit тест для моковых данных
    - Тестировать наличие всех 4 тем
    - Тестировать структуру каждой темы
    - Тестировать асинхронную загрузку
    - _Requirements: 8.1, 8.3, 8.4, 8.5_
  
  - [ ]* 1.4 Написать property тест для структуры моковых данных
    - **Property 6: Mock data structure completeness**
    - **Validates: Requirements 8.2**

- [x] 2. Создание useThemeStore
  - [x] 2.1 Создать Pinia store для темизации в app/stores/theme.ts
    - Реализовать state: settings, isLoading, currentPreset
    - Реализовать computed: colors, brand, hero
    - Реализовать actions: loadSettings, applyTheme, applyPreset, updatePageTitle
    - Функция applyTheme должна обновлять CSS-переменные на document.documentElement
    - Функция loadSettings должна загружать настройки из API с обработкой ошибок
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 2.1_
  
  - [ ]* 2.2 Написать unit тесты для useThemeStore
    - Тестировать загрузку настроек
    - Тестировать применение темы
    - Тестировать переключение между пресетами
    - Тестировать обработку ошибок с fallback
    - Тестировать обновление page title
    - _Requirements: 1.2, 1.3, 1.5, 2.5_
  
  - [ ]* 2.3 Написать property тест для применения CSS-переменных
    - **Property 1: CSS variables update on theme change**
    - **Validates: Requirements 1.3, 1.5**

- [x] 3. Создание composable для темизации
  - Создать useTheme composable в features/apply-theme/model/useTheme.ts
  - Инициализировать тему при монтировании компонента
  - Обновлять page title при загрузке настроек бренда
  - Экспортировать: settings, colors, brand, hero, isLoading, applyPreset, currentPreset
  - Создать index.ts для экспорта
  - _Requirements: 1.2, 2.3_

- [x] 4. Обновление дизайн-системы для liquid glass эффектов
  - [x] 4.1 Добавить CSS-переменные для liquid glass в app/styles/variables.css
    - Добавить переменные: --glass-bg, --glass-bg-dark, --glass-border, --glass-blur, --glass-saturation
    - Добавить переменные для теней: --shadow-glass, --shadow-glass-hover
    - Добавить переменные для border-radius: --radius-2xl, --radius-3xl
    - _Requirements: 4.1, 5.1_
  
  - [x] 4.2 Добавить утилитарные классы для liquid glass в app/styles/base.css
    - Создать классы: .glass, .glass-dark, .glass-card
    - Добавить fallback для браузеров без поддержки backdrop-filter
    - Добавить медиа-запрос для отключения эффектов на мобильных с prefers-reduced-motion
    - _Requirements: 4.1, 4.2, 4.6, 11.1_

- [x] 5. Создание посадочной с-b траницы (Landing Page)
  - [x] 5.1 Создать LandingPage компонент в pages/landing/LandingPage.vue
    - Создать hero-секцию с фоновым изображением из настроек
    - Применить liquid glass эффект к контентной карточке
    - Отображать title, subtitle из hero настроек
    - Добавить кнопку CTA с переходом на /catalog
    - Создать секцию features с 3 карточками (быстрая доставка, качество, гарантия)
    - Обеспечить адаптивность для всех устройств
    - Добавить анимацию fadeInUp для hero контента
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 5.2 Написать unit тест для LandingPage
    - Тестировать отображение hero настроек
    - Тестировать навигацию на /catalog при клике на CTA
    - Тестировать отображение features секции
    - _Requirements: 3.2, 3.4_
  
  - [ ]* 5.3 Написать property тест для hero настроек
    - **Property 3: Hero settings rendering**
    - **Validates: Requirements 3.2**

- [-] 6. Создание ThemeSwitcher виджета
  - [x] 6.1 Создать ThemeSwitcher компонент в widgets/theme-switcher/ui/ThemeSwitcher.vue
    - Отображать сетку кнопок для всех доступных пресетов
    - Каждая кнопка должна показывать preview цветов темы
    - Выделять активную тему визуально
    - Применять тему при клике без перезагрузки страницы
    - Добавить описание "В финальной версии тема будет загружаться с бэкенда"
    - Создать index.ts для экспорта
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 6.2 Написать unit тест для ThemeSwitcher
    - Тестировать отображение всех пресетов
    - Тестировать переключение темы
    - Тестировать визуальное выделение активной темы
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [ ]* 6.3 Написать property тест для переключения тем
    - **Property 4: Theme preset application**
    - **Validates: Requirements 7.3**
  
  - [ ]* 6.4 Написать property тест для индикации активной темы
    - **Property 5: Active theme indication**
    - **Validates: Requirements 7.4**

- [-] 7. Обновление AppHeader с liquid glass и настройками бренда
  - [x] 7.1 Обновить AppHeader в widgets/header/ui/AppHeader.vue
    - Применить liquid glass эффект (backdrop-filter, полупрозрачный фон)
    - Интегрировать useTheme для получения настроек бренда
    - Отображать логотип из brand.logo
    - Отображать название из brand.name
    - Обновить навигационные ссылки: добавить "Главная" (/) и "Каталог" (/catalog)
    - Обеспечить адаптивность
    - _Requirements: 2.2, 2.3, 4.1, 4.2, 9.3_
  
  - [ ]* 7.2 Написать unit тест для обновленного AppHeader
    - Тестировать отображение логотипа и названия бренда
    - Тестировать fallback значения при отсутствии настроек
    - Тестировать навигационные ссылки
    - _Requirements: 2.2, 2.3, 2.5, 9.3_
  
  - [ ]* 7.3 Написать property тест для отображения настроек бренда
    - **Property 2: Brand settings rendering**
    - **Validates: Requirements 2.2, 2.3, 2.4**

- [x] 8. Улучшение ProductCard с закругленными углами
  - Обновить ProductCard в entities/product/ui/ProductCard.vue
  - Увеличить border-radius изображений до 16px (--radius-xl)
  - Добавить плавную анимацию scale при hover (translateY + scale)
  - Улучшить тени для создания глубины
  - Добавить transition для изображения (scale на hover)
  - Обеспечить консистентность стилей
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 9. Удаление фильтров по категориям
  - [x] 9.1 Удалить CategoryFilter компонент
    - Удалить файл features/product-filters/ui/CategoryFilter.vue
    - _Requirements: 6.1_
  
  - [x] 9.2 Обновить useProductsStore
    - Удалить фильтрацию по категориям из filteredProducts computed
    - Удалить categories computed
    - Сохранить фильтрацию по диапазону цен
    - Обновить интерфейс ProductFilters (удалить category)
    - _Requirements: 6.2, 6.3_
  
  - [x] 9.3 Обновить useFilters composable
    - Удалить функцию applyCategoryFilter
    - Сохранить applyPriceFilter
    - Обновить в features/product-filters/model/useFilters.ts
    - _Requirements: 6.2, 6.3_
  
  - [x] 9.4 Обновить дизайн секции фильтров в CatalogPage
    - Удалить CategoryFilter из template
    - Оставить только PriceFilter
    - Обновить стили для упрощенной секции фильтров
    - Обеспечить адаптивность
    - _Requirements: 6.1, 6.4, 6.5_
  
  - [ ]* 9.5 Обновить тесты для фильтрации
    - Удалить тесты для CategoryFilter
    - Обновить тесты useProductsStore (удалить тесты категорий)
    - Убедиться что фильтрация по цене работает
    - _Requirements: 6.2, 6.3_

- [x] 10. Обновление маршрутизации
  - [x] 10.1 Обновить router в app/router/index.ts
    - Изменить маршрут `/` на LandingPage
    - Сохранить маршрут `/catalog` для CatalogPage
    - Удалить redirect с `/` на `/catalog`
    - Обновить fallback маршрут (остается redirect на `/catalog`)
    - _Requirements: 9.1, 9.2, 3.1_
  
  - [x] 10.2 Обновить все внутренние ссылки
    - Обновить ссылки в AppHeader
    - Обновить ссылку "Перейти в каталог" в пустой корзине
    - Обновить ссылку "Перейти в каталог" в пустом профиле
    - _Requirements: 9.3, 9.4_
  
  - [ ]* 10.3 Написать unit тесты для обновленной маршрутизации
    - Тестировать маршрут `/` отображает LandingPage
    - Тестировать маршрут `/catalog` отображает CatalogPage
    - Тестировать навигацию между страницами
    - _Requirements: 9.1, 9.2, 9.5_

- [x] 11. Checkpoint - Проверка основной функциональности
  - Убедиться, что все тесты проходят
  - Проверить загрузку и применение темы
  - Проверить работу посадочной страницы
  - Проверить работу ThemeSwitcher
  - Проверить liquid glass эффекты
  - Спросить пользователя, если возникли вопросы

- [x] 12. Инициализация темы в main.ts
  - Обновить app/main.ts
  - Импортировать useThemeStore
  - Вызвать loadSettings() после создания pinia
  - Обеспечить загрузку темы до монтирования приложения
  - _Requirements: 1.2_

- [x] 13. Интеграция ThemeSwitcher в ProfilePage
  - Обновить ProfilePage в pages/profile/ProfilePage.vue
  - Добавить ThemeSwitcher компонент в начало страницы
  - Добавить секцию "Настройки темы"
  - Обеспечить адаптивность
  - _Requirements: 7.1_

- [x] 14. Дополнительные улучшения UI/UX
  - [x] 14.1 Улучшить spacing и типографику
    - Увеличить spacing между секциями
    - Добавить font-weight variations для заголовков
    - Улучшить line-height для лучшей читаемости
    - _Requirements: 10.1, 10.3_
  
  - [x] 14.2 Добавить плавные transitions
    - Добавить transitions для всех интерактивных элементов
    - Использовать CSS transforms для анимаций (GPU acceleration)
    - Добавить subtle анимации при загрузке страниц
    - _Requirements: 10.2, 11.2_
  
  - [x] 14.3 Улучшить визуальную иерархию
    - Увеличить контраст между уровнями заголовков
    - Улучшить визуальное разделение секций
    - Добавить subtle borders и dividers
    - _Requirements: 10.5_

- [x] 15. Оптимизация производительности
  - [x] 15.1 Оптимизировать backdrop-filter
    - Добавить will-change для элементов с backdrop-filter
    - Добавить fallback для браузеров без поддержки
    - Отключить эффекты на мобильных с prefers-reduced-motion
    - _Requirements: 11.1, 11.2_
  
  - [x] 15.2 Оптимизировать изображения
    - Добавить loading="lazy" для hero изображения
    - Добавить decoding="async" для изображений
    - _Requirements: 11.3_
  
  - [x] 15.3 Минимизировать reflows
    - Использовать CSS transforms вместо position changes
    - Группировать DOM операции
    - _Requirements: 11.4, 11.5_

- [x] 16. Улучшение доступности (A11y)
  - Добавить aria-label для кнопок ThemeSwitcher
  - Добавить aria-pressed для активной темы
  - Обеспечить достаточный контраст текста на liquid glass фонах
  - Добавить text-shadow для улучшения читаемости на hero секции
  - Проверить клавиатурную навигацию
  - _Requirements: 3.5_

- [ ] 17. Тестирование обратной совместимости
  - [ ]* 17.1 Запустить существующие тесты
    - Убедиться что все существующие тесты проходят
    - Проверить работу всех страниц: product, cart, checkout, profile
    - Проверить работу всех stores: cart, products, user, ui
    - _Requirements: 12.1, 12.2, 12.3, 12.5_
  
  - [ ]* 17.2 Тестировать fallback значения
    - Тестировать работу приложения без загруженных настроек
    - Тестировать fallback на дефолтную тему при ошибке
    - Тестировать fallback для отсутствующих изображений
    - _Requirements: 2.5, 12.4_

- [ ] 18. Финальное тестирование
  - [ ]* 18.1 Запустить все unit тесты
    - Убедиться что все тесты проходят
    - Проверить покрытие кода
  
  - [ ]* 18.2 Запустить все property тесты
    - Убедиться что все property тесты проходят
    - Проверить минимум 100 итераций для каждого теста
  
  - [ ]* 18.3 Визуальное тестирование
    - Проверить liquid glass эффекты в разных браузерах
    - Проверить адаптивность на разных устройствах
    - Проверить все 4 темы визуально
    - Проверить плавность анимаций

- [ ] 19. Финальный checkpoint и документация
  - Проверить работу всего приложения с новыми фичами
  - Убедиться что все требования выполнены
  - Проверить производительность (60 FPS для анимаций)
  - Обновить README.md с информацией о системе темизации
  - Задокументировать структуру FrontSettings для будущей интеграции с бэкендом
  - Спросить пользователя о финальных правках

## Примечания

- Задачи, помеченные `*`, являются опциональными и могут быть пропущены для более быстрого MVP
- Каждая задача ссылается на конкретные требования для отслеживаемости
- Checkpoints обеспечивают инкрементальную валидацию
- Property тесты валидируют универсальные свойства корректности
- Все изменения сохраняют обратную совместимость с существующим функционалом
- Liquid glass эффекты оптимизированы для производительности
- Система готова к будущей интеграции с реальным бэкендом API
