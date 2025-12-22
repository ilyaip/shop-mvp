<template>
  <div class="checkout-page">
    <h1 class="checkout-page__title">
      Оформление заказа
    </h1>

    <!-- Empty cart redirect message -->
    <div
      v-if="cartStore.items.length === 0"
      class="empty-cart-message"
      role="status"
      aria-live="polite"
    >
      <p class="empty-cart-message__text">
        Ваша корзина пуста. Добавьте товары перед оформлением заказа.
      </p>
      <Button
        variant="primary"
        @click="handleGoToCatalog"
      >
        Перейти в каталог
      </Button>
    </div>

    <!-- Checkout content -->
    <div
      v-else
      class="checkout-content"
    >
      <section
        class="checkout-form-section"
        aria-label="Форма оформления заказа"
      >
        <CheckoutForm @success="handleCheckoutSuccess" />
      </section>

      <aside
        class="order-summary"
        aria-label="Сводка заказа"
      >
        <div class="order-summary__content">
          <h2 class="order-summary__title">
            Ваш заказ
          </h2>

          <div
            class="order-summary__items"
            role="list"
            :aria-label="`Товары в заказе: ${cartStore.items.length}`"
          >
            <div
              v-for="item in cartStore.items"
              :key="item.product.id"
              class="order-summary__item"
              role="listitem"
            >
              <img
                :src="item.product.image"
                :alt="`Изображение товара: ${item.product.title}`"
                class="order-summary__item-image"
              >
              <div class="order-summary__item-info">
                <span class="order-summary__item-title">{{ item.product.title }}</span>
                <span
                  class="order-summary__item-quantity"
                  :aria-label="`Количество: ${item.quantity}`"
                >× {{ item.quantity }}</span>
              </div>
              <span
                class="order-summary__item-price"
                :aria-label="`Стоимость: ${formatPrice(item.product.price * item.quantity)}`"
              >
                {{ formatPrice(item.product.price * item.quantity) }}
              </span>
            </div>
          </div>

          <div class="order-summary__total">
            <span class="order-summary__total-label">Итого:</span>
            <span
              class="order-summary__total-price"
              :aria-label="`Общая сумма заказа: ${formatPrice(cartStore.total)}`"
            >
              {{ formatPrice(cartStore.total) }}
            </span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCartStore } from '@/app/stores/cart';
import { CheckoutForm } from '@/features/checkout-form';
import { Button } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/formatters';

const router = useRouter();
const cartStore = useCartStore();

function handleCheckoutSuccess() {
  // Navigate to profile page after successful checkout
  router.push('/profile');
}

function handleGoToCatalog() {
  router.push('/catalog');
}
</script>

<style scoped>
.checkout-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  animation: fadeIn var(--transition-base) ease-out;
}

.checkout-page__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-2xl) 0;
  line-height: var(--line-height-tight);
}

/* Empty cart message */
.empty-cart-message {
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

.empty-cart-message__text {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0;
  max-width: 500px;
  line-height: var(--line-height-relaxed);
}

/* Checkout content */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--spacing-2xl);
  align-items: start;
}

.checkout-form-section {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}

.checkout-form-section:hover {
  box-shadow: var(--shadow-md);
}

/* Order summary */
.order-summary {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-md));
}

.order-summary__content {
  padding: var(--spacing-xl);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-base);
}

.order-summary__content:hover {
  box-shadow: var(--shadow-lg);
}

.order-summary__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: var(--line-height-tight);
}

.order-summary__items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
  max-height: 400px;
  overflow-y: auto;
}

.order-summary__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.order-summary__item:hover {
  background-color: var(--color-bg-secondary);
}

.order-summary__item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-tertiary);
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.order-summary__item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
  min-width: 0;
}

.order-summary__item-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-summary__item-quantity {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.order-summary__item-price {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  flex-shrink: 0;
}

.order-summary__total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.order-summary__total-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.order-summary__total-price {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
    top: auto;
  }

  .order-summary__content {
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: var(--spacing-lg);
  }

  .checkout-page__title {
    font-size: var(--font-size-2xl);
  }

  .checkout-form-section {
    padding: var(--spacing-lg);
  }

  .order-summary__content {
    max-width: 100%;
  }

  .empty-cart-message {
    padding: var(--spacing-2xl);
  }
}

@media (max-width: 480px) {
  .checkout-page {
    padding: var(--spacing-md);
  }

  .checkout-page__title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
  }

  .checkout-form-section,
  .order-summary__content {
    padding: var(--spacing-md);
  }

  .order-summary__items {
    max-height: 300px;
  }

  .empty-cart-message {
    padding: var(--spacing-lg);
  }

  .empty-cart-message__text {
    font-size: var(--font-size-base);
  }
}
</style>
