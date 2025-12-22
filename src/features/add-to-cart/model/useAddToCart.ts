/**
 * Composable for adding products to cart
 * Handles cart operations and user notifications
 */

import { useCartStore } from '@/app/stores/cart';
import { useUIStore } from '@/app/stores/ui';
import type { Product } from '@/shared/types/global';

export function useAddToCart() {
  const cartStore = useCartStore();
  const uiStore = useUIStore();

  function addToCart(product: Product, quantity: number = 1) {
    cartStore.addItem(product, quantity);
    uiStore.showNotification(`${product.title} добавлен в корзину`, 'success');
  }

  return {
    addToCart,
  };
}
