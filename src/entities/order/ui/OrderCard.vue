<template>
  <article class="order-card">
    <header class="order-card__header">
      <div class="order-card__info">
        <h3 class="order-card__title">
          Заказ #{{ order.id.slice(0, 8) }}
        </h3>
        <p class="order-card__date">
          <time :datetime="order.date">{{ formatDate(order.date) }}</time>
        </p>
      </div>
      <div class="order-card__total">
        <span class="order-card__total-label">Итого:</span>
        <span
          class="order-card__total-price"
          :aria-label="`Общая сумма заказа: ${formatPrice(order.total)}`"
        >{{ formatPrice(order.total) }}</span>
      </div>
    </header>
    <div
      class="order-card__items"
      role="list"
      aria-label="Товары в заказе"
    >
      <div
        v-for="item in order.items"
        :key="item.product.id"
        class="order-card__item"
        role="listitem"
      >
        <img
          :src="item.product.image"
          :alt="`Изображение товара: ${item.product.title}`"
          class="order-card__item-image"
          loading="lazy"
          decoding="async"
        >
        <div class="order-card__item-info">
          <span class="order-card__item-title">{{ item.product.title }}</span>
          <span
            class="order-card__item-quantity"
            :aria-label="`Количество: ${item.quantity}`"
          >× {{ item.quantity }}</span>
        </div>
        <span
          class="order-card__item-price"
          :aria-label="`Стоимость: ${formatPrice((item.product.price ?? 0) * item.quantity)}`"
        >{{ formatPrice((item.product.price ?? 0) * item.quantity) }}</span>
      </div>
    </div>
    <div class="order-card__details">
      <div class="order-card__detail">
        <span class="order-card__detail-label">Получатель:</span>
        <span class="order-card__detail-value">{{ order.name }}</span>
      </div>
      <div class="order-card__detail">
        <span class="order-card__detail-label">Email:</span>
        <span class="order-card__detail-value">{{ order.email }}</span>
      </div>
      <div class="order-card__detail">
        <span class="order-card__detail-label">Телефон:</span>
        <span class="order-card__detail-value">{{ order.phone }}</span>
      </div>
      <div class="order-card__detail">
        <span class="order-card__detail-label">Адрес:</span>
        <span class="order-card__detail-value">{{ order.address }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { formatPrice, formatDate } from '@/shared/lib/formatters';
import type { Order } from '../model/types';

defineProps<{
  order: Order;
}>();
</script>

<style scoped>
.order-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  animation: fadeIn var(--transition-base) ease-out;
}

.order-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.order-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.order-card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
  line-height: var(--line-height-tight);
}

.order-card__date {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

.order-card__total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.order-card__total-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.order-card__total-price {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.order-card__items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.order-card__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.order-card__item:hover {
  background-color: var(--color-bg-tertiary);
  transform: translateX(4px);
}

.order-card__item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-tertiary);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.order-card__item-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
  min-width: 0;
}

.order-card__item-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-card__item-quantity {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.order-card__item-price {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  flex-shrink: 0;
}

.order-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.order-card__detail {
  display: flex;
  gap: var(--spacing-sm);
  transition: transform var(--transition-fast);
}

.order-card__detail:hover {
  transform: translateX(2px);
}

.order-card__detail-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  min-width: 100px;
  flex-shrink: 0;
}

.order-card__detail-value {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
  word-break: break-word;
}

@media (max-width: 768px) {
  .order-card {
    padding: var(--spacing-lg);
  }

  .order-card__header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .order-card__total {
    align-items: flex-start;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
  }

  .order-card__total-price {
    font-size: var(--font-size-xl);
  }

  .order-card__item {
    flex-wrap: wrap;
  }

  .order-card__item-price {
    width: 100%;
    text-align: right;
    padding-top: var(--spacing-xs);
    border-top: 1px solid var(--color-border-light);
  }

  .order-card__detail {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .order-card__detail-label {
    min-width: auto;
    font-weight: var(--font-weight-medium);
  }
}

@media (max-width: 480px) {
  .order-card {
    padding: var(--spacing-md);
  }

  .order-card__title {
    font-size: var(--font-size-lg);
  }

  .order-card__item {
    padding: var(--spacing-sm);
  }

  .order-card__item-image {
    width: 50px;
    height: 50px;
  }

  .order-card__item-title {
    font-size: var(--font-size-sm);
  }
}
</style>
