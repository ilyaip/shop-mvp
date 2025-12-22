<template>
  <div
    class="price-filter"
    role="group"
    aria-labelledby="price-filter-title"
  >
    <h3
      id="price-filter-title"
      class="filter-title"
    >
      Цена
    </h3>
    <div class="price-inputs">
      <Input
        v-model="minPriceInput"
        type="number"
        label="Минимальная цена"
        placeholder="От"
        :min="0"
        aria-label="Минимальная цена"
        @input="handlePriceChange"
      />
      <span
        class="price-separator"
        aria-hidden="true"
      >—</span>
      <Input
        v-model="maxPriceInput"
        type="number"
        label="Максимальная цена"
        placeholder="До"
        :min="0"
        aria-label="Максимальная цена"
        @input="handlePriceChange"
      />
    </div>
    <Button
      v-if="hasActiveFilters"
      variant="outline"
      class="clear-button"
      aria-label="Сбросить фильтры по цене"
      @click="handleClear"
    >
      Сбросить
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Input, Button } from '@/shared/ui';
import { useProductsStore } from '@/app/stores/products';
import { useFilters } from '../model/useFilters';

const productsStore = useProductsStore();
const { setPriceRange } = useFilters();

const minPriceInput = ref<string>('');
const maxPriceInput = ref<string>('');

const hasActiveFilters = computed(() => {
  return productsStore.filters.minPrice !== undefined || 
         productsStore.filters.maxPrice !== undefined;
});

// Watch for external filter changes
watch(
  () => productsStore.filters,
  (filters) => {
    if (filters.minPrice === undefined) {
      minPriceInput.value = '';
    }
    if (filters.maxPrice === undefined) {
      maxPriceInput.value = '';
    }
  },
  { deep: true }
);

function handlePriceChange() {
  const minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : undefined;
  const maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : undefined;
  
  setPriceRange(minPrice, maxPrice);
}

function handleClear() {
  minPriceInput.value = '';
  maxPriceInput.value = '';
  setPriceRange(undefined, undefined);
}
</script>

<style scoped>
.price-filter {
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.price-separator {
  color: var(--color-text-muted);
  font-weight: 500;
}

.clear-button {
  width: 100%;
}
</style>
