<template>
  <div class="profile-page">
    <!-- Theme Settings Section -->
    <section class="theme-settings">
      <h2 class="theme-settings__title">Настройки темы</h2>
      <ThemeSwitcher />
    </section>

    <h1 class="profile-page__title">
      Мои заказы
    </h1>

    <!-- Empty orders state -->
    <div
      v-if="userStore.orders.length === 0"
      class="empty-orders"
      role="status"
      aria-live="polite"
    >
      <p class="empty-orders__message">
        У вас пока нет заказов
      </p>
      <p class="empty-orders__description">
        Оформите первый заказ, чтобы увидеть его здесь
      </p>
      <Button
        variant="primary"
        @click="handleGoToCatalog"
      >
        Перейти в каталог
      </Button>
    </div>

    <!-- Orders list -->
    <div
      v-else
      class="orders-list"
      role="list"
      :aria-label="`Список заказов: ${userStore.orders.length}`"
    >
      <OrderCard
        v-for="order in sortedOrders"
        :key="order.id"
        :order="order"
        role="listitem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/app/stores/user';
import { OrderCard } from '@/entities/order';
import { Button } from '@/shared/ui';
import { ThemeSwitcher } from '@/widgets/theme-switcher';

const router = useRouter();
const userStore = useUserStore();

// Sort orders by date (newest first)
const sortedOrders = computed(() => {
  return [...userStore.orders].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

function handleGoToCatalog() {
  router.push('/catalog');
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  animation: fadeIn var(--transition-base) ease-out;
}

/* Theme Settings Section */
.theme-settings {
  margin-bottom: var(--spacing-3xl);
  animation: fadeIn var(--transition-base) ease-out;
}

.theme-settings__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: var(--line-height-tight);
}

.profile-page__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-2xl) 0;
  line-height: var(--line-height-tight);
}

/* Empty orders state */
.empty-orders {
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

.empty-orders__message {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
}

.empty-orders__description {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0;
  max-width: 500px;
  line-height: var(--line-height-relaxed);
}

/* Orders list */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

@media (max-width: 768px) {
  .profile-page {
    padding: var(--spacing-lg);
  }

  .theme-settings {
    margin-bottom: var(--spacing-2xl);
  }

  .theme-settings__title {
    font-size: var(--font-size-xl);
  }

  .profile-page__title {
    font-size: var(--font-size-2xl);
  }

  .empty-orders {
    padding: var(--spacing-2xl);
  }

  .empty-orders__message {
    font-size: var(--font-size-xl);
  }

  .orders-list {
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: var(--spacing-md);
  }

  .theme-settings {
    margin-bottom: var(--spacing-xl);
  }

  .theme-settings__title {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
  }

  .profile-page__title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
  }

  .empty-orders {
    padding: var(--spacing-lg);
  }

  .empty-orders__message {
    font-size: var(--font-size-lg);
  }

  .empty-orders__description {
    font-size: var(--font-size-base);
  }

  .orders-list {
    gap: var(--spacing-md);
  }
}
</style>
