<template>
  <router-link 
    to="/cart" 
    class="cart-widget"
    :aria-label="`Корзина, товаров: ${itemCount}`"
  >
    <div class="cart-icon-wrapper">
      <ShoppingCart
        :size="24"
        aria-hidden="true"
      />
      <span
        v-if="itemCount > 0"
        class="cart-badge"
        aria-hidden="true"
      >{{ itemCount }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ShoppingCart } from 'lucide-vue-next';
import { useCartStore } from '@/app/stores/cart';
import { storeToRefs } from 'pinia';

const cartStore = useCartStore();
const { itemCount } = storeToRefs(cartStore);
</script>

<style scoped>
.cart-widget {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.cart-widget:hover {
  background-color: var(--bg-secondary);
  color: var(--primary);
}

.cart-widget:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: var(--primary);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
