<template>
  <div class="product-page">
    <!-- Error state -->
    <div
      v-if="error"
      class="error"
      role="alert"
      aria-live="assertive"
    >
      <h1 class="error__title">
        Ошибка загрузки
      </h1>
      <p class="error__message">
        {{ error }}
      </p>
      <!-- Show CORS help link if it's a CORS error -->
      <p
        v-if="isCORSError"
        class="error__help"
      >
        Проблема с CORS? 
        <a
          href="/CORS_SETUP_GUIDE.md"
          target="_blank"
          rel="noopener noreferrer"
          class="error__link"
        >
          Смотрите руководство по настройке
        </a>
      </p>
      <div class="error__actions">
        <Button
          variant="primary"
          @click="loadProduct"
        >
          Попробовать снова
        </Button>
        <Button
          variant="outline"
          @click="handleBackToCatalog"
        >
          Вернуться в каталог
        </Button>
      </div>
    </div>

    <!-- Loading state with skeleton -->
    <div
      v-else-if="isLoading"
      class="loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="product-skeleton">
        <div class="product-skeleton__gallery">
          <Skeleton
            variant="rectangular"
            width="100%"
            height="600px"
          />
          <div class="product-skeleton__thumbnails">
            <Skeleton
              v-for="i in 4"
              :key="i"
              variant="rectangular"
              width="100%"
              height="120px"
            />
          </div>
        </div>
        <div class="product-skeleton__info">
          <Skeleton
            variant="text"
            width="30%"
            height="20px"
          />
          <Skeleton
            variant="text"
            width="80%"
            height="40px"
          />
          <Skeleton
            variant="text"
            width="40%"
            height="32px"
          />
          <div class="product-skeleton__description">
            <Skeleton
              variant="text"
              width="100%"
              height="16px"
            />
            <Skeleton
              variant="text"
              width="100%"
              height="16px"
            />
            <Skeleton
              variant="text"
              width="60%"
              height="16px"
            />
          </div>
          <Skeleton
            variant="rectangular"
            width="100%"
            height="48px"
          />
        </div>
      </div>
    </div>

    <!-- Product not found -->
    <div
      v-else-if="!product"
      class="not-found"
      role="status"
      aria-live="polite"
    >
      <h1 class="not-found__title">
        Товар не найден
      </h1>
      <p class="not-found__message">
        К сожалению, запрашиваемый товар не существует или был удален.
      </p>
      <Button
        variant="primary"
        @click="handleBackToCatalog"
      >
        Вернуться в каталог
      </Button>
    </div>

    <!-- Product details -->
    <article
      v-else
      class="product-details"
    >
      <div class="product-details__gallery">
        <div class="product-details__main-image">
          <img
            v-for="(image, index) in images"
            :key="image"
            :src="image"
            :alt="`Изображение товара: ${product.title} (${index + 1}/${images.length})`"
            class="product-details__image"
            :class="{ 'product-details__image--active': index === currentImageIndex }"
            loading="lazy"
            decoding="async"
          >
        </div>
        <!-- Thumbnails -->
        <div 
          v-if="images.length > 1" 
          class="product-details__thumbnails"
        >
          <button
            v-for="(image, index) in images"
            :key="index"
            class="product-details__thumbnail"
            :class="{ 'product-details__thumbnail--active': index === currentImageIndex }"
            :aria-label="`Показать изображение ${index + 1}`"
            @click="currentImageIndex = index"
          >
            <img
              :src="image"
              :alt="`Миниатюра ${index + 1}`"
              class="product-details__thumbnail-image"
              loading="lazy"
              decoding="async"
            >
          </button>
        </div>
      </div>

      <div class="product-details__info">
        <div class="product-details__header">
          <span
            class="product-details__category"
            role="text"
            :aria-label="`Категория: ${product.category}`"
          >{{ product.category }}</span>
          <h1 class="product-details__title">
            {{ product.title }}
          </h1>
        </div>

        <div class="product-details__price-section">
          <span
            class="product-details__price"
            :aria-label="`Цена: ${formatPrice(product.price)}`"
          >{{ formatPrice(product.price) }}</span>
        </div>

        <div 
          class="product-details__description"
          :class="{ 'product-details__description--expanded': isExpanded }"
        >
          <div 
            ref="descriptionContentRef"
            class="product-details__description-content"
            :style="{ maxHeight: isExpanded ? expandedHeight : collapsedHeight }"
          >
            <p
              v-for="(paragraph, index) in descriptionParagraphs"
              :key="index"
              class="product-details__paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
          
          <!-- Show more button - only visible if content overflows -->
          <button
            v-if="showReadMoreButton"
            class="product-details__show-more"
            @click="toggleShowMore"
          >
            {{ isExpanded ? 'Скрыть' : 'Читать далее' }}
            <svg
              class="product-details__show-more-icon"
              :class="{ 'product-details__show-more-icon--rotated': isExpanded }"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <!-- Specifications section -->
        <div
          v-if="product.dimensions || product.weight || product.manufacturer"
          class="product-details__specifications"
        >
          <h2 class="product-details__specifications-title">
            Характеристики
          </h2>
          <dl class="product-details__specs-list">
            <div
              v-if="product.manufacturer"
              class="product-details__spec-item"
            >
              <dt class="product-details__spec-label">
                Производитель
              </dt>
              <dd class="product-details__spec-value">
                {{ product.manufacturer }}
              </dd>
            </div>
            <div
              v-if="product.dimensions"
              class="product-details__spec-item"
            >
              <dt class="product-details__spec-label">
                Размеры (В×Г×Ш)
              </dt>
              <dd class="product-details__spec-value">
                {{ product.dimensions.height }} × {{ product.dimensions.depth }} × {{ product.dimensions.width }} см
              </dd>
            </div>
            <div
              v-if="product.weight"
              class="product-details__spec-item"
            >
              <dt class="product-details__spec-label">
                Вес
              </dt>
              <dd class="product-details__spec-value">
                {{ product.weight.value }} {{ product.weight.unit }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="product-details__actions">
          <AddToCartButton
            :product="product"
            :quantity="1"
          />
          <Button
            variant="outline"
            @click="handleBackToCatalog"
          >
            Вернуться в каталог
          </Button>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/app/stores/products';
import { AddToCartButton } from '@/features/add-to-cart';
import { Button, Skeleton } from '@/shared/ui';
import { formatPrice, formatDescription } from '@/shared/lib/formatters';
import type { Product } from '@/shared/types/global';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();

const productId = computed(() => route.params.id as string);
const product = ref<Product | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Gallery logic
const currentImageIndex = ref(0);
const images = computed(() => {
  if (!product.value) return [];
  return product.value.images && product.value.images.length > 0
    ? product.value.images
    : [product.value.image];
});
const imagesPreloaded = ref(false);

// Check if error is CORS related
const isCORSError = computed(() => {
  return error.value?.includes('CORS') || error.value?.includes('подключения');
});

// Format description into paragraphs
const descriptionParagraphs = computed(() => {
  if (!product.value?.description) {
    return [];
  }
  return formatDescription(product.value.description);
});

// Description expansion logic
const isExpanded = ref(false);
const descriptionContentRef = ref<HTMLElement | null>(null);
const showReadMoreButton = ref(false);
const collapsedHeight = ref('16em'); // Default collapsed height (10 lines * 1.6em)
const expandedHeight = ref('auto');

// Check if content overflows 10 lines
function checkContentOverflow() {
  nextTick(() => {
    if (!descriptionContentRef.value) {
      showReadMoreButton.value = false;
      return;
    }
    
    // Calculate max height for 10 lines (line-height is 1.6em)
    const lineHeight = parseFloat(getComputedStyle(descriptionContentRef.value).lineHeight);
    const maxHeight = lineHeight * 10;
    const actualHeight = descriptionContentRef.value.scrollHeight;
    
    showReadMoreButton.value = actualHeight > maxHeight;
    
    // Store the collapsed and expanded heights for smooth transition
    collapsedHeight.value = `${maxHeight}px`;
    expandedHeight.value = `${actualHeight}px`;
  });
}

function toggleShowMore() {
  isExpanded.value = !isExpanded.value;
  
  // Update expanded height in case content changed
  if (isExpanded.value && descriptionContentRef.value) {
    nextTick(() => {
      if (descriptionContentRef.value) {
        expandedHeight.value = `${descriptionContentRef.value.scrollHeight}px`;
      }
    });
  }
}

// Preload gallery images for smooth transitions
function preloadGalleryImages() {
  if (images.value.length <= 1) {
    imagesPreloaded.value = true;
    return;
  }

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
      console.warn('Failed to preload gallery images:', error);
      imagesPreloaded.value = true; // Continue anyway
    });
}

// Load product from API
async function loadProduct() {
  if (!productId.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const loadedProduct = await productsStore.getProductById(productId.value);
    product.value = loadedProduct;
    
    if (!loadedProduct) {
      error.value = null; // Not an error, just not found
    } else {
      // Preload images after product is loaded
      preloadGalleryImages();
      // Check if description overflows
      checkContentOverflow();
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не удалось загрузить товар';
    console.error('Failed to load product:', err);
  } finally {
    isLoading.value = false;
  }
}

function handleBackToCatalog() {
  router.push('/catalog');
}

// Load product on mount
onMounted(() => {
  loadProduct();
});

// Reload product when route changes
watch(productId, () => {
  currentImageIndex.value = 0; // Reset gallery
  imagesPreloaded.value = false; // Reset preload state
  isExpanded.value = false; // Reset description expansion
  showReadMoreButton.value = false; // Reset button visibility
  loadProduct();
});

// Re-check overflow when description changes
watch(descriptionParagraphs, () => {
  checkContentOverflow();
});
</script>

<style scoped>
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  animation: fadeIn var(--transition-base) ease-out;
}

/* Error state */
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-3xl);
  text-align: center;
  min-height: 400px;
  animation: fadeIn var(--transition-base) ease-out;
}

.error__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-error);
  margin: 0;
  line-height: var(--line-height-tight);
}

.error__message {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0;
  max-width: 500px;
  line-height: var(--line-height-relaxed);
}

.error__help {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
  margin: 0;
  max-width: 500px;
}

.error__link {
  color: var(--color-primary);
  text-decoration: underline;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.error__link:hover {
  color: var(--color-primary-hover);
}

.error__actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
}

/* Not found state */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-3xl);
  text-align: center;
  min-height: 400px;
  animation: fadeIn var(--transition-base) ease-out;
}

.not-found__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0;
  line-height: var(--line-height-tight);
}

.not-found__message {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0;
  max-width: 500px;
  line-height: var(--line-height-relaxed);
}

/* Loading state with skeleton */
.loading {
  animation: fadeIn var(--transition-base) ease-out;
}

.product-skeleton {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--spacing-3xl);
  max-width: 1400px;
}

.product-skeleton__gallery {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.product-skeleton__thumbnails {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
}

.product-skeleton__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl) 0;
}

.product-skeleton__description {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

/* Product details */
.product-details {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--spacing-3xl);
  animation: fadeIn var(--transition-base) ease-out;
  max-width: 1400px;
}

.product-details__gallery {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-md));
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.product-details__main-image {
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background-color: var(--color-bg-tertiary);
  transition: transform var(--transition-base);
  position: relative;
}

.product-details__main-image:hover {
  transform: scale(1.01);
}

.product-details__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.product-details__image--active {
  opacity: 1;
  z-index: 1;
}

.product-details__thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-sm);
}

.product-details__thumbnail {
  aspect-ratio: 3/4;
  overflow: hidden;
  background-color: var(--color-bg-tertiary);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.product-details__thumbnail:hover {
  border-color: var(--color-border);
  transform: scale(1.05);
}

.product-details__thumbnail--active {
  border-color: var(--color-primary);
}

.product-details__thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  padding: var(--spacing-xl) 0;
}

.product-details__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: slideIn var(--transition-base) ease-out;
}

.product-details__category {
  display: inline-block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

.product-details__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-normal);
  color: var(--color-text);
  margin: 0;
  line-height: var(--line-height-tight);
}

.product-details__price-section {
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-border-light);
}

.product-details__price {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  display: inline-block;
  animation: slideIn var(--transition-base) ease-out;
}

.product-details__description {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  position: relative;
}

.product-details__description-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow: hidden;
  position: relative;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient fade effect when collapsed */
.product-details__description:not(.product-details__description--expanded) .product-details__description-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--color-bg));
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-details__description--expanded .product-details__description-content::after {
  opacity: 0;
}

.product-details__paragraph {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.product-details__expandable-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow: hidden;
}

.product-details__paragraph--expandable {
  transform-origin: top;
}

/* Fade-slide transition for expandable paragraphs */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.product-details__show-more {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.product-details__show-more:hover {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.product-details__show-more:active {
  transform: translateY(0);
}

.product-details__show-more:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.product-details__show-more-icon {
  transition: transform var(--transition-fast);
}

.product-details__show-more-icon--rotated {
  transform: rotate(180deg);
}

.product-details__specifications {
  padding: var(--spacing-xl);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.product-details__specifications-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: var(--line-height-tight);
}

.product-details__specs-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: 0;
}

.product-details__spec-item {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.product-details__spec-item:hover {
  background-color: var(--color-bg-tertiary);
  transform: translateX(4px);
}

.product-details__spec-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  margin: 0;
}

.product-details__spec-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  margin: 0;
}

.product-details__actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

@media (max-width: 1024px) {
  .product-details {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .product-details__gallery {
    position: static;
  }

  .product-details__info {
    padding: 0;
  }

  .product-skeleton {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }

  .product-skeleton__info {
    padding: 0;
  }
}

@media (max-width: 768px) {
  .product-page {
    padding: var(--spacing-lg);
  }

  .product-details {
    gap: var(--spacing-xl);
  }

  .product-details__title {
    font-size: var(--font-size-2xl);
  }

  .product-details__price {
    font-size: var(--font-size-xl);
  }

  .product-details__info {
    gap: var(--spacing-xl);
  }

  .not-found__title,
  .error__title {
    font-size: var(--font-size-2xl);
  }

  .product-skeleton {
    gap: var(--spacing-xl);
  }
}

@media (max-width: 480px) {
  .product-page {
    padding: var(--spacing-md);
  }

  .product-details {
    gap: var(--spacing-lg);
  }

  .product-details__title {
    font-size: var(--font-size-xl);
  }

  .product-details__paragraph {
    font-size: var(--font-size-sm);
  }

  .product-details__show-more {
    width: 100%;
    justify-content: center;
    padding: var(--spacing-md);
  }

  .product-details__specifications {
    padding: var(--spacing-lg);
  }

  .product-details__specifications-title {
    font-size: var(--font-size-lg);
  }

  .product-details__spec-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
  }

  .product-details__spec-label {
    font-size: var(--font-size-xs);
  }

  .product-details__spec-value {
    font-size: var(--font-size-sm);
  }

  .product-details__price {
    font-size: var(--font-size-lg);
  }

  .product-details__info {
    gap: var(--spacing-lg);
  }

  .not-found,
  .error {
    padding: var(--spacing-2xl);
  }

  .not-found__title,
  .error__title {
    font-size: var(--font-size-xl);
  }

  .not-found__message,
  .error__message {
    font-size: var(--font-size-base);
  }

  .error__actions {
    flex-direction: column;
    width: 100%;
  }

  .product-skeleton {
    gap: var(--spacing-lg);
  }

  .product-skeleton__thumbnails {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
