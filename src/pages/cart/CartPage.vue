<template>
  <div class="cart-page">
    <h1 class="cart-page__title">
      Корзина
    </h1>

    <!-- Empty cart state -->
    <div
      v-if="cartStore.items.length === 0"
      class="empty-cart"
      role="status"
      aria-live="polite"
    >
      <p class="empty-cart__message">
        Корзина пуста
      </p>
      <p class="empty-cart__description">
        Добавьте товары из каталога, чтобы оформить заказ
      </p>
      <Button
        variant="primary"
        @click="handleGoToCatalog"
      >
        Перейти в каталог
      </Button>
    </div>

    <!-- Cart with items -->
    <div
      v-else
      class="cart-content"
    >
      <div
        class="cart-items"
        role="list"
        :aria-label="`Товары в корзине: ${cartStore.itemCount}`"
      >
        <CartItem
          v-for="item in cartStore.items"
          :key="item.product.id"
          v-memo="[item.product.id, item.quantity]"
          :item="item"
          role="listitem"
          @update-quantity="handleUpdateQuantity(item.product.id, $event)"
          @remove="handleRemoveItem(item.product.id)"
        />
      </div>

      <aside
        class="cart-summary"
        aria-label="Итоговая информация о заказе"
      >
        <div class="cart-summary__content">
          <h2 class="cart-summary__title">
            Итого
          </h2>
          
          <div class="cart-summary__details">
            <div class="cart-summary__row">
              <span class="cart-summary__label">Товаров:</span>
              <span
                class="cart-summary__value"
                aria-label="`Количество товаров: ${cartStore.itemCount}`"
              >{{ cartStore.itemCount }}</span>
            </div>
            <div class="cart-summary__row cart-summary__row--total">
              <span class="cart-summary__label">Сумма:</span>
              <span
                class="cart-summary__value cart-summary__value--price"
                aria-label="`Общая сумма: ${formatPrice(cartStore.total)}`"
              >
                {{ formatPrice(cartStore.total) }}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            class="cart-summary__checkout-btn"
            aria-label="Перейти к оформлению заказа"
            @click="handleGoToCheckout"
          >
            Оформить заказ
          </Button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCartStore } from '@/app/stores/cart';
import CartItem from '@/entities/cart/ui/CartItem.vue';
import { Button } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/formatters';

const router = useRouter();
const cartStore = useCartStore();

function handleUpdateQuantity(productId: string, quantity: number) {
  cartStore.updateQuantity(productId, quantity);
}

function handleRemoveItem(productId: string) {
  cartStore.removeItem(productId);
}

function handleGoToCatalog() {
  router.push('/catalog');
}

function handleGoToCheckout() {
  router.push('/checkout');
}
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  animation: fadeIn var(--transition-base) ease-out;
}

.cart-page__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-2xl) 0;
  line-height: var(--line-height-tight);
}

/* Empty cart state */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-3xl);
  text-align: center;
  min-height: 400px;
  animation: fadeIn var(--transition-base) ease-out;
}

.empty-cart__message {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
}

.empty-cart__description {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0;
  max-width: 500px;
  line-height: var(--line-height-relaxed);
}

/* Cart content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--spacing-2xl);
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Cart summary */
.cart-summary {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-md));
}

.cart-summary__content {
  padding: var(--spacing-xl);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-base);
}

.cart-summary__content:hover {
  box-shadow: var(--shadow-lg);
}

.cart-summary__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: var(--line-height-tight);
}

.cart-summary__details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform var(--transition-fast);
}

.cart-summary__row:hover {
  transform: translateX(2px);
}

.cart-summary__row--total {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.cart-summary__label {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
}

.cart-summary__value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.cart-summary__value--price {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.cart-summary__checkout-btn {
  width: 100%;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
    top: auto;
  }

  .cart-summary__content {
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: var(--spacing-lg);
  }

  .cart-page__title {
    font-size: var(--font-size-2xl);
  }

  .cart-summary__content {
    max-width: 100%;
  }

  .empty-cart {
    padding: var(--spacing-2xl);
  }

  .empty-cart__message {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 480px) {
  .cart-page {
    padding: var(--spacing-md);
  }

  .cart-page__title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
  }

  .cart-content {
    gap: var(--spacing-lg);
  }

  .cart-items {
    gap: var(--spacing-md);
  }

  .cart-summary__content {
    padding: var(--spacing-lg);
  }

  .empty-cart__message {
    font-size: var(--font-size-lg);
  }

  .empty-cart__description {
    font-size: var(--font-size-base);
  }
}
</style>
