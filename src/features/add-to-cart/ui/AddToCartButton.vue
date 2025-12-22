<template>
  <Button
    :variant="variant"
    :class="{ 'add-to-cart-button--added': isAdded }"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="!isAdded">
      <slot>Добавить в корзину</slot>
    </span>
    <span
      v-else
      class="add-to-cart-button__success"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="3" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Добавлено в корзину
    </span>
  </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/shared/ui';
import { useAddToCart } from '../model/useAddToCart';
import type { Product } from '@/shared/types/global';

interface Props {
  product: Product;
  quantity?: number;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  quantity: 1,
  variant: 'primary',
  disabled: false,
});

const { addToCart } = useAddToCart();
const isAdded = ref(false);

function handleClick() {
  addToCart(props.product, props.quantity);
  
  // Show success state
  isAdded.value = true;
  
  // Reset after 2 seconds
  setTimeout(() => {
    isAdded.value = false;
  }, 2000);
}
</script>

<style scoped>
.add-to-cart-button--added {
  background-color: var(--color-success) !important;
  border-color: var(--color-success) !important;
  animation: successPulse 0.4s ease-out;
}

.add-to-cart-button__success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  animation: fadeIn 0.3s ease-out;
}

.add-to-cart-button__success svg {
  animation: checkmark 0.4s ease-out;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
