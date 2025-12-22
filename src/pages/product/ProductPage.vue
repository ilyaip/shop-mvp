<template>
  <div class="product-page">
    <!-- Product not found -->
    <div
      v-if="!product && !productsStore.isLoading"
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

    <!-- Loading state -->
    <div
      v-else-if="productsStore.isLoading"
      class="loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="loading__spinner">
        Загрузка...
      </div>
    </div>

    <!-- Product details -->
    <article
      v-else-if="product"
      class="product-details"
    >
      <div class="product-details__gallery">
        <div class="product-details__main-image">
          <img
            :src="currentImage"
            :alt="`Изображение товара: ${product.title}`"
            class="product-details__image"
            loading="lazy"
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

        <p class="product-details__description">
          {{ product.description }}
        </p>

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
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/app/stores/products';
import { AddToCartButton } from '@/features/add-to-cart';
import { Button } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/formatters';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();

const productId = computed(() => route.params.id as string);
const product = computed(() => productsStore.getProductById(productId.value));

// Gallery logic
const currentImageIndex = ref(0);
const images = computed(() => {
  if (!product.value) return [];
  return product.value.images && product.value.images.length > 0
    ? product.value.images
    : [product.value.image];
});
const currentImage = computed(() => images.value[currentImageIndex.value] || '');

function handleBackToCatalog() {
  router.push('/catalog');
}
</script>

<style scoped>
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  animation: fadeIn var(--transition-base) ease-out;
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

/* Loading state */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading__spinner {
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  animation: pulse 1.5s ease-in-out infinite;
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
}

.product-details__main-image:hover {
  transform: scale(1.01);
}

.product-details__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
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

  .not-found__title {
    font-size: var(--font-size-2xl);
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

  .product-details__description {
    font-size: var(--font-size-sm);
  }

  .product-details__price {
    font-size: var(--font-size-lg);
  }

  .product-details__info {
    gap: var(--spacing-lg);
  }

  .not-found {
    padding: var(--spacing-2xl);
  }

  .not-found__title {
    font-size: var(--font-size-xl);
  }

  .not-found__message {
    font-size: var(--font-size-base);
  }
}
</style>
