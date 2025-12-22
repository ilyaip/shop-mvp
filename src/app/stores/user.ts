/**
 * User store
 * Manages user orders with localStorage persistence
 */

import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Order } from '@/shared/types/global';
import { loadFromStorage, saveToStorage } from '@/shared/lib/storage';

const ORDERS_STORAGE_KEY = 'user-orders';

export const useUserStore = defineStore('user', () => {
  // State - load from localStorage
  const orders = ref<Order[]>(loadFromStorage<Order[]>(ORDERS_STORAGE_KEY, []));

  // Actions
  function addOrder(order: Order) {
    orders.value.push(order);
  }

  // Watch orders and save to localStorage on changes
  watch(
    orders,
    (newOrders) => {
      saveToStorage(ORDERS_STORAGE_KEY, newOrders);
    },
    { deep: true }
  );

  return {
    // State
    orders,
    // Actions
    addOrder,
  };
});
