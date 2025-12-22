<template>
  <div class="catalog-page">
    <aside
      class="catalog-page__filters"
      aria-label="Фильтры товаров"
    >
      <h2 class="filters-title">
        Фильтры
      </h2>
      <CategoryFilter />
      <PriceFilter />
    </aside>

    <main
      class="catalog-page__content"
      role="main"
      aria-label="Каталог товаров"
    >
      <h1 class="catalog-page__title">
        Каталог товаров
      </h1>

      <!-- Loading state -->
      <div
        v-if="productsStore.isLoading"
        class="products-grid"
        aria-busy="true"
        aria-label="Загрузка товаров"
      >
        <ProductSkeleton
          v-for="i in 6"
          :key="i"
        />
      </div>

      <!-- Products grid -->
      <div 
        v-else-if="filteredProducts.length > 0" 
        class="products-grid"
        role="list"
        :aria-label="`Найдено товаров: ${filteredProducts.length}`"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          v-memo="[product.id, product.price, product.title]"
          :product="product"
          @click="handleProductClick"
          @add-to-cart="handleAddToCart"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="empty-state"
        role="status"
        aria-live="polite"
      >
        <p class="empty-state__message">
          Товары не найдены
        </p>
        <Button
          variant="outline"
          @click="handleClearFilters"
        >
          Сбросить фильтры
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/app/stores/products';
import { useAddToCart } from '@/features/add-to-cart/model/useAddToCart';
import { CategoryFilter, PriceFilter } from '@/features/product-filters';
import { ProductCard, ProductSkeleton } from '@/entities/product';
import { Button } from '@/shared/ui';
import type { Product } from '@/shared/types/global';

const router = useRouter();
const productsStore = useProductsStore();
const { addToCart } = useAddToCart();

const filteredProducts = computed(() => productsStore.filteredProducts);

function handleProductClick(product: Product) {
  router.push(`/product/${product.id}`);
}

function handleAddToCart(product: Product) {
  addToCart(product, 1);
}

function handleClearFilters() {
  productsStore.clearFilters();
}
</script>

<style scoped>
.catalog-page {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-2xl);
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  animation: fadeIn var(--transition-base) ease-out;
}

.catalog-page__filters {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-md));
  height: fit-content;
  padding: var(--spacing-xl);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}

.catalog-page__filters:hover {
  box-shadow: var(--shadow-md);
}

.filters-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: var(--line-height-tight);
}

.catalog-page__content {
  min-width: 0;
}

.catalog-page__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-2xl) 0;
  line-height: var(--line-height-tight);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-2xl) var(--spacing-xl);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-3xl);
  text-align: center;
  animation: fadeIn var(--transition-base) ease-out;
}

.empty-state__message {
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  margin: 0;
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-xl);
  }
}

@media (max-width: 1024px) {
  .catalog-page {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl);
  }

  .catalog-page__filters {
    position: static;
    top: auto;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .catalog-page {
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
  }

  .catalog-page__title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-xl);
  }

  .catalog-page__filters {
    padding: var(--spacing-lg);
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .catalog-page {
    padding: var(--spacing-md);
  }

  .catalog-page__title {
    font-size: var(--font-size-xl);
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .empty-state {
    padding: var(--spacing-2xl);
  }
}
</style>
