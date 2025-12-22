/**
 * Cart store
 * Manages shopping cart state with localStorage persistence
 */

import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type { CartItem, Product } from '@/shared/types/global';
import { loadFromStorage, saveToStorage } from '@/shared/lib/storage';

const CART_STORAGE_KEY = 'cart-items';

export const useCartStore = defineStore('cart', () => {
  // State - load from localStorage
  const items = ref<CartItem[]>(loadFromStorage<CartItem[]>(CART_STORAGE_KEY, []));

  // Computed
  const total = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  });

  const itemCount = computed(() => {
    return items.value.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  });

  // Actions
  function addItem(product: Product, quantity: number = 1) {
    const existingItem = items.value.find((item) => item.product.id === product.id);

    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += quantity;
    } else {
      // Add new item
      items.value.push({
        product,
        quantity,
      });
    }
  }

  function removeItem(productId: string) {
    const index = items.value.findIndex((item) => item.product.id === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find((item) => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  // Watch items and save to localStorage on changes
  watch(
    items,
    (newItems) => {
      saveToStorage(CART_STORAGE_KEY, newItems);
    },
    { deep: true }
  );

  return {
    // State
    items,
    // Computed
    total,
    itemCount,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
});
