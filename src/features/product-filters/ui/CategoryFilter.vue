<template>
  <div
    class="category-filter"
    role="group"
    aria-labelledby="category-filter-title"
  >
    <h3
      id="category-filter-title"
      class="filter-title"
    >
      Категории
    </h3>
    <div
      class="filter-options"
      role="radiogroup"
      aria-labelledby="category-filter-title"
    >
      <button
        class="filter-option"
        :class="{ active: !currentCategory }"
        role="radio"
        :aria-checked="!currentCategory"
        @click="handleCategoryChange(undefined)"
      >
        Все товары
      </button>
      <button
        v-for="category in categories"
        :key="category"
        class="filter-option"
        :class="{ active: currentCategory === category }"
        role="radio"
        :aria-checked="currentCategory === category"
        @click="handleCategoryChange(category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProductsStore } from '@/app/stores/products';
import { useFilters } from '../model/useFilters';

const productsStore = useProductsStore();
const { setCategory } = useFilters();

const categories = computed(() => productsStore.categories);
const currentCategory = computed(() => productsStore.filters.category);

function handleCategoryChange(category: string | undefined) {
  setCategory(category);
}
</script>

<style scoped>
.category-filter {
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-option {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-background);
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.filter-option:hover {
  background: var(--color-background-soft);
  border-color: var(--color-primary);
}

.filter-option:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.filter-option.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
</style>
