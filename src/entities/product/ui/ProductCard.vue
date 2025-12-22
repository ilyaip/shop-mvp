<template>
  <article 
    class="product-card" 
    role="button"
    tabindex="0"
    :aria-label="`${product.title}, ${formatPrice(product.price)}`"
    @click="$emit('click', product)"
    @keydown.enter="$emit('click', product)"
    @keydown.space.prevent="$emit('click', product)"
  >
    <div 
      class="product-card__image-wrapper"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <img
        :src="currentImage"
        :alt="`Изображение товара: ${product.title}`"
        class="product-card__image"
        loading="lazy"
      >
      <!-- Image indicators -->
      <div 
        v-if="images.length > 1" 
        class="product-card__indicators"
        role="presentation"
      >
        <span
          v-for="(_, index) in images"
          :key="index"
          class="product-card__indicator"
          :class="{ 'product-card__indicator--active': index === currentImageIndex }"
        />
      </div>
      <div class="product-card__overlay">
        <Button
          variant="primary"
          class="product-card__add-button"
          :class="{ 'product-card__add-button--added': isAdded }"
          :aria-label="`Добавить ${product.title} в корзину`"
          @click.stop="handleAddToCart"
        >
          <span v-if="!isAdded">Добавить в корзину</span>
          <span
            v-else
            class="product-card__success"
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
            Добавлено
          </span>
        </Button>
      </div>
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">
        {{ product.title }}
      </h3>
      <span
        class="product-card__price"
        aria-label="`Цена: ${formatPrice(product.price)}`"
      >{{ formatPrice(product.price) }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/formatters';
import type { Product } from '../model/types';

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  addToCart: [product: Product];
  click: [product: Product];
}>();

// Get images array (fallback to single image if images array is not provided)
const images = computed(() => {
  return props.product.images && props.product.images.length > 0
    ? props.product.images
    : [props.product.image];
});

const currentImageIndex = ref(0);
const currentImage = computed(() => images.value[currentImageIndex.value]);
const isAdded = ref(false);

// Handle mouse move to change image based on position
function handleMouseMove(event: MouseEvent) {
  if (images.value.length <= 1) return;

  const target = event.currentTarget;
  if (!target) return;
  
   
  const rect = (target as any).getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = x / rect.width;
  
  // Calculate which image to show based on mouse position
  const imageIndex = Math.floor(percentage * images.value.length);
  currentImageIndex.value = Math.min(imageIndex, images.value.length - 1);
}

// Reset to first image when mouse leaves
function handleMouseLeave() {
  currentImageIndex.value = 0;
}

// Handle add to cart with animation
function handleAddToCart() {
  emit('addToCart', props.product);
  
  // Show success state
  isAdded.value = true;
  
  // Reset after 2 seconds
  setTimeout(() => {
    isAdded.value = false;
  }, 2000);
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  transition: all var(--transition-base);
  cursor: pointer;
  height: 100%;
}

.product-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: var(--radius-md);
}

.product-card__image-wrapper {
  width: 100%;
  height: 400px;
  overflow: hidden;
  background-color: var(--color-bg-tertiary);
  position: relative;
  margin-bottom: var(--spacing-md);
  cursor: pointer;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
  user-select: none;
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__indicators {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-xs);
  z-index: 2;
  pointer-events: none;
}

.product-card__indicator {
  width: 24px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: background-color var(--transition-fast);
}

.product-card__indicator--active {
  background-color: rgba(255, 255, 255, 1);
}

.product-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-xl);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  opacity: 0;
  transition: opacity var(--transition-base);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.product-card:hover .product-card__overlay {
  opacity: 1;
}

.product-card__add-button {
  width: 100%;
  max-width: 280px;
  transform: translateY(20px);
  transition: all var(--transition-base);
}

.product-card:hover .product-card__add-button {
  transform: translateY(0);
}

.product-card__add-button--added {
  background-color: var(--color-success) !important;
  border-color: var(--color-success) !important;
  animation: successPulse 0.4s ease-out;
}

.product-card__success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  animation: fadeIn 0.3s ease-out;
}

.product-card__success svg {
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

.product-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-xs);
}

.product-card__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  color: var(--color-text);
  margin: 0;
  line-height: var(--line-height-normal);
  transition: color var(--transition-fast);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4em;
}

.product-card:hover .product-card__title {
  color: var(--color-primary);
}

.product-card__price {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

@media (max-width: 1024px) {
  .product-card__image-wrapper {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .product-card__image-wrapper {
    height: 300px;
  }

  .product-card__overlay {
    padding: var(--spacing-lg);
  }

  .product-card__title {
    font-size: var(--font-size-sm);
  }

  .product-card__price {
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 640px) {
  .product-card__image-wrapper {
    height: 280px;
  }
}

@media (max-width: 480px) {
  .product-card__image-wrapper {
    height: 320px;
  }

  .product-card__content {
    padding: 0;
  }

  /* На мобильных показываем кнопку всегда */
  .product-card__overlay {
    opacity: 1;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  }

  .product-card__add-button {
    transform: translateY(0);
    font-size: var(--font-size-sm);
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>
