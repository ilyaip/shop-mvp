<template>
  <div class="landing-page">
    <!-- Hero Section - Loading State -->
    <section 
      v-if="isLoading" 
      class="hero hero--loading"
      aria-labelledby="hero-title"
      aria-busy="true"
    >
      <div class="hero__overlay" aria-hidden="true"></div>
      <div class="hero__content">
        <div class="hero__glass-card">
          <Skeleton variant="rectangular" width="100%" height="60px" class="hero__skeleton-title" />
          <Skeleton variant="rectangular" width="80%" height="30px" class="hero__skeleton-subtitle" />
          <Skeleton variant="rectangular" width="200px" height="48px" class="hero__skeleton-button" />
        </div>
      </div>
    </section>

    <!-- Hero Section - Loaded State -->
    <section 
      v-else
      class="hero" 
      :class="{ 'hero--no-image': !hero?.image }"
      :style="heroBackgroundStyle"
      aria-labelledby="hero-title"
    >
      <div class="hero__overlay" aria-hidden="true"></div>
      <div class="hero__content">
        <div class="hero__glass-card">
          <h1 id="hero-title" class="hero__title">{{ hero?.title || 'Добро пожаловать' }}</h1>
          <p class="hero__subtitle">{{ hero?.subtitle || 'Откройте для себя коллекцию премиальных товаров' }}</p>
          <Button 
            variant="primary" 
            class="hero__cta"
            @click="goToCatalog"
          >
            {{ hero?.ctaText || 'Перейти в каталог' }}
          </Button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <!-- <section class="features" aria-labelledby="features-title">
      <div class="container">
        <h2 id="features-title" class="visually-hidden">Наши преимущества</h2>
        <div class="features__grid">
          <article class="feature-card">
            <div class="feature-card__icon" aria-hidden="true">🚀</div>
            <h3 class="feature-card__title">Быстрая доставка</h3>
            <p class="feature-card__text">Доставим ваш заказ в кратчайшие сроки</p>
          </article>
          <article class="feature-card">
            <div class="feature-card__icon" aria-hidden="true">✨</div>
            <h3 class="feature-card__title">Качество</h3>
            <p class="feature-card__text">Только проверенные товары</p>
          </article>
          <article class="feature-card">
            <div class="feature-card__icon" aria-hidden="true">💎</div>
            <h3 class="feature-card__title">Гарантия</h3>
            <p class="feature-card__text">Полная гарантия на все товары</p>
          </article>
        </div>
      </div>
    </section> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/features/apply-theme'
import { Button, Skeleton } from '@/shared/ui'

const router = useRouter()
const { hero, isLoading } = useTheme()

const heroBackgroundStyle = computed(() => {
  if (hero?.value?.image) {
    return {
      backgroundImage: `url(${hero.value.image})`
    }
  }
  // Gradient fallback when no image is available
  return {
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
  }
})

const goToCatalog = () => {
  router.push('/catalog')
}

// Preload hero image for better performance
onMounted(() => {
  if (hero?.value?.image) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = hero.value.image
    document.head.appendChild(link)
  }
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  margin-top: -64px; /* Компенсируем высоту header */
}

/* Hero Section */
.hero {
  position: relative;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 64px; /* Добавляем отступ для header */
}

/* Hero with gradient fallback (no image) */
.hero--no-image {
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Hero loading state */
.hero--loading {
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );
}

/* Skeleton styles for hero section */
.hero__skeleton-title {
  margin-bottom: var(--spacing-md);
  border-radius: var(--radius-lg);
}

.hero__skeleton-subtitle {
  margin: 0 auto var(--spacing-xl);
  border-radius: var(--radius-md);
}

.hero__skeleton-button {
  margin: 0 auto;
  border-radius: var(--radius-md);
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: var(--spacing-xl);
  max-width: 800px;
  width: 100%;
}

.hero__glass-card {
  /* Liquid glass effect */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  animation: fadeInUp 0.8s ease-out;
  will-change: backdrop-filter, transform;
}

/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(20px)) {
  .hero__glass-card {
    background: rgba(0, 0, 0, 0.7);
  }
}

.hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3);
  line-height: var(--line-height-tight);
}

.hero__subtitle {
  font-size: var(--font-size-xl);
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: var(--spacing-xl);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3);
  line-height: var(--line-height-relaxed);
}

.hero__cta {
  font-size: var(--font-size-lg);
  padding: var(--spacing-md) var(--spacing-2xl);
}

.hero__cta:focus-visible {
  outline: 3px solid white;
  outline-offset: 4px;
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.3);
}

/* Features Section */
.features {
  padding: var(--spacing-3xl) var(--spacing-xl);
  background: var(--color-bg-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  background: var(--color-bg);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  box-shadow: var(--shadow-sm);
  will-change: transform;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-card__icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.feature-card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.feature-card__text {
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accessibility - Visually hidden but available to screen readers */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    height: 100vh;
    min-height: 600px;
  }

  .hero__title {
    font-size: var(--font-size-3xl);
  }
  
  .hero__subtitle {
    font-size: var(--font-size-lg);
  }
  
  .hero__glass-card {
    padding: var(--spacing-xl);
  }

  .hero__cta {
    font-size: var(--font-size-base);
    padding: var(--spacing-sm) var(--spacing-xl);
  }

  .features {
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  .features__grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .hero__title {
    font-size: var(--font-size-2xl);
  }
  
  .hero__subtitle {
    font-size: var(--font-size-base);
  }

  .hero__glass-card {
    padding: var(--spacing-lg);
  }

  .feature-card {
    padding: var(--spacing-lg);
  }

  .feature-card__icon {
    font-size: 2.5rem;
  }
}

/* Accessibility - Disable effects for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero__glass-card {
    animation: none;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(255, 255, 255, 0.95);
    will-change: auto;
  }

  .hero--no-image {
    animation: none;
    background-size: 100% 100%;
  }

  .feature-card {
    transition: none;
    will-change: auto;
  }

  .feature-card:hover {
    transform: none;
  }
}

/* Performance optimization for mobile devices */
@media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
  .hero__glass-card {
    backdrop-filter: blur(10px) saturate(150%);
    -webkit-backdrop-filter: blur(10px) saturate(150%);
  }
}
</style>
