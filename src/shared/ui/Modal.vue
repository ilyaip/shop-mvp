<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        role="presentation"
        @click="handleOverlayClick"
      >
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : undefined"
          @click.stop
        >
          <div class="modal__header">
            <h2
              v-if="title"
              id="modal-title"
              class="modal__title"
            >
              {{ title }}
            </h2>
            <button
              class="modal__close"
              aria-label="Закрыть модальное окно"
              @click="$emit('close')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                />
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                />
              </svg>
            </button>
          </div>
          <div class="modal__content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const handleOverlayClick = () => {
  emit('close')
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

// Add/remove escape key listener
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => {
  if (props.isOpen) {
    document.addEventListener('keydown', handleEscapeKey)
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal {
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background-color: var(--color-bg);
  z-index: 1;
}

.modal__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
}

.modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  color: var(--color-text-light);
  transition: all var(--transition-base);
}

.modal__close:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text);
  transform: rotate(90deg);
}

.modal__close:active {
  transform: rotate(90deg) scale(0.95);
}

.modal__close:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.modal__content {
  padding: var(--spacing-lg);
}

/* Animations */
.modal-enter-active {
  transition: opacity var(--transition-slow);
}

.modal-leave-active {
  transition: opacity var(--transition-base);
}

.modal-enter-active .modal {
  transition: transform var(--transition-slow) cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active .modal {
  transition: transform var(--transition-base) ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal {
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to .modal {
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .modal {
    max-width: 100%;
    max-height: 95vh;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    margin-top: auto;
  }

  .modal-enter-from .modal {
    transform: translateY(100%);
  }
}
</style>
