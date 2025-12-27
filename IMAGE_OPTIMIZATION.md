# Оптимизация работы с изображениями

## Проблема

При переключении изображений в карточках товаров и галерее наблюдалось мигание, так как браузер загружал изображения при каждом изменении `src` атрибута.

## Решение

Реализована комплексная оптимизация работы с изображениями:

### 1. Предзагрузка изображений

**ProductCard.vue** и **ProductPage.vue** теперь предзагружают все изображения товара при монтировании компонента:

```typescript
function preloadImages() {
  const imagePromises = images.value.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  });

  Promise.all(imagePromises)
    .then(() => {
      imagesPreloaded.value = true;
    })
    .catch((error) => {
      console.warn('Failed to preload some images:', error);
      imagesPreloaded.value = true;
    });
}
```

### 2. Рендеринг всех изображений с переключением видимости

Вместо изменения `src` атрибута, все изображения рендерятся одновременно, но показывается только активное:

```vue
<img
  v-for="(image, index) in images"
  :key="image"
  :src="image"
  class="product-card__image"
  :class="{ 'product-card__image--active': index === currentImageIndex }"
/>
```

### 3. Плавные CSS переходы

Используется `opacity` для плавного перехода между изображениями:

```css
.product-card__image {
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.product-card__image--active {
  opacity: 1;
  z-index: 1;
}
```

### 4. Оптимизация производительности

- **Абсолютное позиционирование**: Все изображения накладываются друг на друга
- **GPU ускорение**: Используется `opacity` вместо `display` для аппаратного ускорения
- **Кэширование браузера**: Изображения загружаются один раз и кэшируются
- **Lazy loading**: Сохранен атрибут `loading="lazy"` для первоначальной загрузки

## Преимущества

✅ **Нет мигания** - плавные переходы между изображениями  
✅ **Быстрое переключение** - изображения уже загружены  
✅ **Лучший UX** - приятная анимация при наведении  
✅ **Кэширование** - браузер кэширует все изображения  
✅ **Производительность** - использование GPU для transitions  

## Поддержка accessibility

- Сохранены `alt` атрибуты для всех изображений
- Добавлена информация о номере изображения в галерее
- Поддержка `prefers-reduced-motion` для пользователей с ограниченными возможностями

## Компоненты с оптимизацией

1. **ProductCard.vue** - карточки товаров в каталоге
2. **ProductPage.vue** - галерея на странице товара

## Дополнительные улучшения

Можно добавить в будущем:

- **Intersection Observer** для ленивой предзагрузки только видимых карточек
- **WebP формат** с fallback на JPEG/PNG
- **Responsive images** с `srcset` для разных размеров экрана
- **Image CDN** для оптимизации доставки изображений
- **Blur placeholder** во время загрузки первого изображения
