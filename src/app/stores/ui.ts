/**
 * UI store
 * Manages UI state including notifications
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Notification, NotificationType } from '@/shared/types/global';

export const useUIStore = defineStore('ui', () => {
  // State
  const notifications = ref<Notification[]>([]);

  // Actions
  function showNotification(message: string, type: NotificationType = 'info') {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const notification: Notification = {
      id,
      message,
      type,
    };

    notifications.value.push(notification);

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);

    return id;
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  return {
    // State
    notifications,
    // Actions
    showNotification,
    removeNotification,
  };
});
