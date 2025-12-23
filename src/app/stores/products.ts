/**
 * Products store
 * Manages product catalog, filtering, and product retrieval
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Product, ProductFilters } from '@/shared/types/global';
import { mockProducts } from '@/shared/api/mock-data';

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([]);
  const filters = ref<ProductFilters>({});
  const isLoading = ref(false);

  // Computed
  const filteredProducts = computed(() => {
    let result = products.value;

    // Filter by price range
    if (filters.value.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.value.minPrice!);
    }

    if (filters.value.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.value.maxPrice!);
    }

    // Filter by search query
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return result;
  });

  // Actions
  function setFilters(newFilters: ProductFilters) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function clearFilters() {
    filters.value = {};
  }

  function getProductById(id: string): Product | undefined {
    return products.value.find((p) => p.id === id);
  }

  // Load mock data on store initialization
  function loadProducts() {
    isLoading.value = true;
    // Simulate async loading
    setTimeout(() => {
      products.value = [...mockProducts];
      isLoading.value = false;
    }, 0);
  }

  // Initialize products
  loadProducts();

  return {
    // State
    products,
    filters,
    isLoading,
    // Computed
    filteredProducts,
    // Actions
    setFilters,
    clearFilters,
    getProductById,
  };
});
