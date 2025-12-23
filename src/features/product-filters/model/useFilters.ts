/**
 * Composable for managing product filters
 * Handles filter state and operations
 */

import { useProductsStore } from '@/app/stores/products';
import type { ProductFilters } from '@/shared/types/global';

export function useFilters() {
  const productsStore = useProductsStore();

  function setPriceRange(minPrice: number | undefined, maxPrice: number | undefined) {
    productsStore.setFilters({ minPrice, maxPrice });
  }

  function setSearchQuery(searchQuery: string | undefined) {
    productsStore.setFilters({ searchQuery });
  }

  function setFilters(filters: ProductFilters) {
    productsStore.setFilters(filters);
  }

  function clearFilters() {
    productsStore.clearFilters();
  }

  return {
    filters: productsStore.filters,
    setPriceRange,
    setSearchQuery,
    setFilters,
    clearFilters,
  };
}
