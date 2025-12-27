<template>
  <article 
    class="product-card"
    :class="{ 'product-card--hovered': isHovered }"
    role="button"
    tabindex="0"
    :aria-label="`${product.title}, ${formatPrice(product.price)}`"
    @click="$emit('click', product)"
    @keydown.enter="$emit('click', product)"
    @keydown.space.prevent="$emit('click', product)"
    @mouseenter="isHovered = true"
    @mouseleave="handleCardMouseLeave"
  >
    <div 
      class="product-card__image-wrapper"
      @mousemove="handleMouseMove"
    >
      <!-- Render all images but show only current one -->
      <img
        v-for="(image, index) in images"
        :key="image"
        :src="image"
        :alt="`Изображение товара: ${product.title} (${index + 1}/${images.length})`"
        class="product-card__image"
        :class="{ 'product-card__image--active': index === currentImageIndex }"
        loading="lazy"
        decoding="async"
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
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">
        {{ product.title }}
      </h3>
      <div class="product-card__footer">
        <span
          class="product-card__price"
          aria-label="`Цена: ${formatPrice(product.price)}`"
        >{{ formatPrice(product.price) }}</span>
        <button
          class="product-card__cart-button"
          :class="{ 'product-card__cart-button--added': isAdded }"
          :aria-label="`Добавить ${product.title} в корзину`"
          @click.stop="handleAddToCart"
        >
          <svg
            v-if="!isAdded"
            class="product-card__cart-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="10" y1="11" x2="14" y2="11" />
          </svg>
          <svg
            v-else
            class="product-card__check-icon"
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
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
const isAdded = ref(false);
const imagesPreloaded = ref(false);
const isHovered = ref(false);

// Preload all images on mount for smooth transitions
onMounted(() => {
  if (images.value.length > 1) {
    preloadImages();
  }
});

// Preload images to prevent flickering
function preloadImages() {
  const imagePromises = images.value.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  });

  Promise.all(imagePromises)
    .then(() => {
      imagesPreloaded.value = true;
    })
    .catch((error) => {
      console.warn('Failed to preload some images:', error);
      imagesPreloaded.value = true; // Continue anyway
    });
}

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
function handleCardMouseLeave() {
  isHovered.value = false;
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
  will-change: transform;
}

.product-card:hover,
.product-card--hovered {
  transform: translateY(-8px) scale(1.02);
}

.product-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: var(--radius-xl);
}

.product-card__image-wrapper {
  width: 100%;
  height: 400px;
  overflow: hidden;
  background-color: var(--color-bg-tertiary);
  position: relative;
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}

.product-card:hover .product-card__image-wrapper,
.product-card--hovered .product-card__image-wrapper {
  box-shadow: var(--shadow-xl);
}

.product-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  border-radius: var(--radius-xl);
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform var(--transition-slow);
  will-change: opacity;
}

.product-card__image--active {
  opacity: 1;
  z-index: 1;
}

.product-card:hover .product-card__image--active,
.product-card--hovered .product-card__image--active {
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

.product-card:hover .product-card__title,
.product-card--hovered .product-card__title {
  color: var(--color-primary);
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.product-card__price {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.product-card__cart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: var(--color-primary);
  border: none;
  border-radius: var(--radius-full);
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.8);
}

.product-card:hover .product-card__cart-button,
.product-card--hovered .product-card__cart-button {
  opacity: 1;
  transform: scale(1);
}

.product-card__cart-button:hover {
  background-color: var(--color-primary-hover);
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.product-card__cart-button:active {
  transform: scale(0.95);
}

.product-card__cart-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.product-card__cart-button--added {
  background-color: var(--color-success);
  animation: successPulse 0.4s ease-out;
  opacity: 1;
  transform: scale(1);
}

.product-card__cart-button--added:hover {
  background-color: var(--color-success);
  transform: scale(1.1);
}

.product-card__cart-icon,
.product-card__check-icon {
  flex-shrink: 0;
}

.product-card__check-icon {
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

@media (max-width: 1024px) {
  .product-card__image-wrapper {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .product-card__image-wrapper {
    height: 300px;
  }

  .product-card__title {
    font-size: var(--font-size-sm);
  }

  .product-card__price {
    font-size: var(--font-size-sm);
  }

  .product-card__cart-button {
    width: 36px;
    height: 36px;
  }

  .product-card__cart-icon,
  .product-card__check-icon {
    width: 18px;
    height: 18px;
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

  .product-card__cart-button {
    width: 36px;
    height: 36px;
  }

  /* На мобильных показываем кнопку всегда */
  .product-card__cart-button {
    opacity: 1;
    transform: scale(1);
  }
}

  /* Disable animations and will-change for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-card__image,
  .product-card__cart-button {
    will-change: auto;
    transition: none;
    animation: none;
  }
  
  .product-card:hover,
  .product-card--hovered {
    transform: none;
  }
  
  .product-card:hover .product-card__image--active,
  .product-card--hovered .product-card__image--active {
    transform: none;
  }
  
  .product-card__image {
    transition: opacity 0.15s ease-in-out;
  }
}
</style>
