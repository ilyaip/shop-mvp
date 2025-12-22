<template>
  <div id="app">
    <AppHeader />

    <main class="main">
      <router-view />
    </main>

    <AppFooter />

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
import { storeToRefs } from 'pinia';
import { AppHeader } from '@/widgets/header';
import { AppFooter } from '@/widgets/footer';
import { Notification } from '@/shared/ui';
import { useUIStore } from '@/app/stores/ui';

const uiStore = useUIStore();
const { notifications } = storeToRefs(uiStore);
const { removeNotification } = uiStore;
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
