<template>
  <header
    class="app-header"
    role="banner"
  >
    <div class="header-container">
      <div class="header-left">
        <router-link
          to="/"
          class="logo"
          :aria-label="`${brand?.name || 'Modern Store'} - Главная страница`"
        >
          <img
            v-if="brand?.logo"
            :src="brand.logo"
            :alt="brand.name"
            class="logo-image"
            loading="lazy"
            decoding="async"
          />
          <Store
            v-else
            :size="28"
            aria-hidden="true"
          />
          <span class="logo-text">{{ brand?.name || 'Modern Store' }}</span>
        </router-link>
      </div>

      <nav 
        class="header-nav" 
        :class="{ 'nav-open': isMobileMenuOpen }"
        role="navigation"
        aria-label="Основная навигация"
      >
        <router-link
          to="/"
          class="nav-link"
          @click="closeMobileMenu"
        >
          Главная
        </router-link>
        <router-link
          to="/catalog"
          class="nav-link"
          @click="closeMobileMenu"
        >
          Каталог
        </router-link>
        <router-link
          to="/profile"
          class="nav-link"
          @click="closeMobileMenu"
        >
          Профиль
        </router-link>
      </nav>

      <div class="header-right">
        <CartWidget />
        <button 
          class="mobile-menu-button" 
          :aria-label="isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'" 
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-navigation"
          @click="toggleMobileMenu"
        >
          <Menu
            v-if="!isMobileMenuOpen"
            :size="24"
            aria-hidden="true"
          />
          <X
            v-else
            :size="24"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Store, Menu, X } from 'lucide-vue-next';
import { CartWidget } from '@/widgets/cart-widget';
import { useTheme } from '@/features/apply-theme';

const isMobileMenuOpen = ref(false);
const { brand } = useTheme();

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  /* Liquid glass effect with theme colors */
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  will-change: backdrop-filter, transform;
}

/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(20px)) {
  .app-header {
    background: var(--color-bg);
  }
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  gap: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-base);
}

.logo:hover {
  color: var(--color-primary);
  transform: scale(1.02);
}

.logo:active {
  transform: scale(0.98);
}

.logo:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}

.logo-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.logo-text {
  display: none;
}

.header-nav {
  display: none;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-base);
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-primary);
  transition: width var(--transition-base);
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
}

.nav-link.router-link-active {
  color: var(--color-primary);
}

.nav-link.router-link-active::after {
  width: 100%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.mobile-menu-button:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-primary);
  transform: scale(1.1);
}

.mobile-menu-button:active {
  transform: scale(1.05);
}

.mobile-menu-button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .logo-text {
    display: inline;
  }

  .header-nav {
    display: flex;
  }

  .mobile-menu-button {
    display: none;
  }
}

/* Mobile menu */
@media (max-width: 767px) {
  .header-container {
    padding: 0.75rem 1rem;
  }

  .header-nav {
    position: fixed;
    top: 65px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    /* Liquid glass effect for mobile menu */
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
    padding: 1rem 1.5rem;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform var(--transition-slow) cubic-bezier(0.34, 1.56, 0.64, 1), 
                opacity var(--transition-base);
    pointer-events: none;
    will-change: transform, opacity;
  }
  
  @supports not (backdrop-filter: blur(20px)) {
    .header-nav {
      background: var(--color-bg);
    }
  }

  .header-nav.nav-open {
    display: flex;
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-link {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .nav-link::after {
    display: none;
  }

  .nav-link:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.5rem 0.75rem;
  }

  .logo {
    font-size: 1.125rem;
  }
  
  .logo-image {
    width: 28px;
    height: 28px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .app-header,
  .logo,
  .nav-link,
  .mobile-menu-button,
  .header-nav {
    transition: none;
    animation: none;
  }
  
  .app-header,
  .header-nav {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: var(--color-bg);
    will-change: auto;
  }
}

/* Optimize backdrop-filter on mobile devices */
@media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
  .app-header,
  .header-nav {
    backdrop-filter: blur(10px) saturate(150%);
    -webkit-backdrop-filter: blur(10px) saturate(150%);
  }
}
</style>
