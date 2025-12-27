<template>
  <div id="app">
    <!-- Global loading indicator -->
    <div v-if="isInitializing" class="global-loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">Загрузка...</p>
    </div>

    <template v-else>
      <AppHeader />

      <main class="main">
        <router-view />
      </main>

      <AppFooter />
    </template>

    <!-- Notification container -->
    <div class="notifications-container">
      <Notification
        v-for="notification in notifications"
        :key="notification.id"
        :message="notification.message"
        :type="notification.type"
        @close="removeNotification(notification.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { AppHeader } from '@/widgets/header';
import { AppFooter } from '@/widgets/footer';
import { Notification } from '@/shared/ui';
import { useUIStore } from '@/app/stores/ui';
import { useThemeStore } from '@/app/stores/theme';
import { useProductsStore } from '@/app/stores/products';

const uiStore = useUIStore();
const themeStore = useThemeStore();
const productsStore = useProductsStore();

const { notifications } = storeToRefs(uiStore);
const { removeNotification, showNotification } = uiStore;

// Check if app is still initializing (loading theme or products)
const isInitializing = computed(() => {
  return themeStore.isLoading || productsStore.isLoading;
});

// Handle global API errors
onMounted(() => {
  // Show notification if theme failed to load
  if (themeStore.error) {
    showNotification(
      'Не удалось загрузить настройки темы. Используется тема по умолчанию.',
      'info'
    );
  }

  // Show notification if products failed to load
  if (productsStore.error) {
    showNotification(
      'Не удалось загрузить товары. Попробуйте обновить страницу.',
      'error'
    );
  }
});
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

/* Global loading indicator */
.global-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--spacing-lg);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.125rem;
  color: var(--color-text-light);
  font-weight: 500;
}

.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  pointer-events: none;
}

.notifications-container > * {
  pointer-events: auto;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .notifications-container {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
  }
}
</style>
