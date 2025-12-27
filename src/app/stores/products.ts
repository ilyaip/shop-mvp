/**
 * Products store
 * Manages product catalog, filtering, and product retrieval
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Product, ProductFilters } from '@/shared/types/global';
import { fetchProducts, fetchProductById } from '@/shared/api/products';

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([]);
  const filters = ref<ProductFilters>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const filteredProducts = computed(() => {
    let result = products.value;

    // Filter by price range (treat undefined/0 prices as 0)
    if (filters.value.minPrice !== undefined) {
      result = result.filter((p) => (p.price ?? 0) >= filters.value.minPrice!);
    }

    if (filters.value.maxPrice !== undefined) {
      result = result.filter((p) => (p.price ?? 0) <= filters.value.maxPrice!);
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

  // Get product by ID with caching and API fallback
  async function getProductById(id: string): Promise<Product | null> {
    // First, check if product exists in state (cache)
    const cached = products.value.find((p) => p.id === id);
    if (cached) {
      return cached;
    }

    // If not found in cache, fetch from API
    try {
      const product = await fetchProductById(Number(id));
      
      // Add to cache if found
      if (product) {
        products.value.push(product);
      }
      
      return product;
    } catch (err) {
      console.error(`Failed to get product ${id}:`, err);
      return null;
    }
  }

  // Load products from API
  async function loadProducts() {
    // Prevent concurrent requests
    if (isLoading.value) {
      return;
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const data = await fetchProducts();
      products.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load products';
      console.error('Failed to load products:', err);
      products.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    products,
    filters,
    isLoading,
    error,
    // Computed
    filteredProducts,
    // Actions
    setFilters,
    clearFilters,
    getProductById,
    loadProducts,
  };
});
