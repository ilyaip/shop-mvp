<template>
  <header
    class="app-header"
    role="banner"
  >
    <div class="header-container">
      <div class="header-left">
        <router-link
          to="/catalog"
          class="logo"
          aria-label="Vue Shop - Главная страница"
        >
          <Store
            :size="28"
            aria-hidden="true"
          />
          <span class="logo-text">Vue Shop</span>
        </router-link>
      </div>

      <nav 
        class="header-nav" 
        :class="{ 'nav-open': isMobileMenuOpen }"
        role="navigation"
        aria-label="Основная навигация"
      >
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

const isMobileMenuOpen = ref(false);

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
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
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
  color: var(--text-primary);
  text-decoration: none;
  transition: all var(--transition-base);
}

.logo:hover {
  color: var(--primary);
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
  color: var(--text-secondary);
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
  background-color: var(--primary);
  transition: width var(--transition-base);
}

.nav-link:hover {
  color: var(--primary);
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
  color: var(--primary);
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
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.mobile-menu-button:hover {
  background-color: var(--bg-secondary);
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
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    padding: 1rem 1.5rem;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform var(--transition-slow) cubic-bezier(0.34, 1.56, 0.64, 1), 
                opacity var(--transition-base);
    pointer-events: none;
  }

  .header-nav.nav-open {
    display: flex;
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-link {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-color);
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
}
</style>
