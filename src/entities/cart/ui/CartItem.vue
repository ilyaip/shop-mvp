<template>
  <div class="cart-item">
    <div class="cart-item__image-wrapper">
      <img
        :src="item.product.image"
        :alt="item.product.title"
        class="cart-item__image"
        loading="lazy"
        decoding="async"
      >
    </div>
    <div class="cart-item__content">
      <div class="cart-item__info">
        <h3 class="cart-item__title">
          {{ item.product.title }}
        </h3>
        <p class="cart-item__price">
          {{ formatPrice(item.product.price) }}
        </p>
      </div>
      <div class="cart-item__controls">
        <div class="cart-item__quantity">
          <button
            class="cart-item__quantity-btn"
            :disabled="item.quantity <= 1"
            aria-label="Уменьшить количество"
            @click="$emit('updateQuantity', item.quantity - 1)"
          >
            -
          </button>
          <span class="cart-item__quantity-value">{{ item.quantity }}</span>
          <button
            class="cart-item__quantity-btn"
            aria-label="Увеличить количество"
            @click="$emit('updateQuantity', item.quantity + 1)"
          >
            +
          </button>
        </div>
        <button
          class="cart-item__remove"
          aria-label="Удалить товар"
          @click="$emit('remove')"
        >
          Удалить
        </button>
      </div>
    </div>
    <div class="cart-item__total">
      <span class="cart-item__total-label">Итого:</span>
      <span class="cart-item__total-price">{{ formatPrice((item.product.price ?? 0) * item.quantity) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '@/shared/lib/formatters';
import type { CartItem } from '../model/types';

defineProps<{
  item: CartItem;
}>();

defineEmits<{
  updateQuantity: [quantity: number];
  remove: [];
}>();
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border);
}

.cart-item__image-wrapper {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-bg-tertiary);
  box-shadow: var(--shadow-sm);
}

.cart-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.cart-item:hover .cart-item__image {
  transform: scale(1.05);
}

.cart-item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--spacing-md);
  min-width: 0;
}

.cart-item__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.cart-item__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
  line-height: var(--line-height-tight);
}

.cart-item__price {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
  margin: 0;
}

.cart-item__controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-top: auto;
  flex-wrap: wrap;
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  background-color: var(--color-bg-secondary);
  box-shadow: var(--shadow-sm);
}

.cart-item__quantity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.cart-item__quantity-btn:hover:not(:disabled) {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  transform: scale(1.1);
}

.cart-item__quantity-btn:active:not(:disabled) {
  transform: scale(1.05);
}

.cart-item__quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-item__quantity-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.cart-item__quantity-value {
  min-width: 32px;
  text-align: center;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.cart-item__remove {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background-color: transparent;
  color: var(--color-error);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.cart-item__remove:hover {
  background-color: rgba(239, 68, 68, 0.1);
  transform: scale(1.05);
}

.cart-item__remove:active {
  transform: scale(1);
}

.cart-item__remove:focus-visible {
  outline: 2px solid var(--color-error);
  outline-offset: 2px;
}

.cart-item__total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.cart-item__total-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.cart-item__total-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .cart-item__image-wrapper {
    width: 100%;
    height: 200px;
  }

  .cart-item__controls {
    flex-direction: row;
    justify-content: space-between;
  }

  .cart-item__quantity {
    flex: 1;
    justify-content: center;
  }

  .cart-item__total {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border-light);
  }
}

@media (max-width: 480px) {
  .cart-item {
    padding: var(--spacing-md);
  }

  .cart-item__image-wrapper {
    height: 160px;
  }

  .cart-item__controls {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .cart-item__quantity {
    width: 100%;
  }

  .cart-item__remove {
    width: 100%;
    text-align: center;
  }
}
</style>
