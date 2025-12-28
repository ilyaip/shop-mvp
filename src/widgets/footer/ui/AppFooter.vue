<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3 class="footer-title">
          {{ brandName }}
        </h3>
        <p class="footer-description">
          Современный интернет-магазин с удобным интерфейсом и широким ассортиментом товаров.
        </p>
      </div>

      <div class="footer-section">
        <h4 class="footer-subtitle">
          Социальные сети
        </h4>
        <div class="social-links">
          <a
            href="#"
            class="social-link"
            aria-label="Facebook"
          >
            <Facebook :size="20" />
          </a>
          <a
            href="#"
            class="social-link"
            aria-label="Twitter"
          >
            <Twitter :size="20" />
          </a>
          <a
            href="#"
            class="social-link"
            aria-label="Instagram"
          >
            <Instagram :size="20" />
          </a>
          <a
            href="#"
            class="social-link"
            aria-label="GitHub"
          >
            <Github :size="20" />
          </a>
        </div>
      </div>

      <div class="footer-section">
        <h4 class="footer-subtitle">
          Контакты
        </h4>
        <div class="contact-info">
          <a
            href="mailto:info@vueshop.com"
            class="contact-link"
          >
            <Mail :size="16" />
            <span>info@vueshop.com</span>
          </a>
          <a
            href="tel:+1234567890"
            class="contact-link"
          >
            <Phone :size="16" />
            <span>+1 (234) 567-890</span>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">
        &copy; {{ currentYear }} {{ brandName }}. Все права защищены.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Facebook, Twitter, Instagram, Github, Mail, Phone } from 'lucide-vue-next';
import { useThemeStore } from '@/app/stores/theme';

const themeStore = useThemeStore();
const currentYear = computed(() => new Date().getFullYear());
const brandName = computed(() => themeStore.brand?.name || 'Vue Shop');
</script>

<style scoped>
.app-footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.footer-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn var(--transition-base) ease-out;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  transition: color var(--transition-base);
}

.footer-title:hover {
  color: var(--primary);
}

.footer-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.footer-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  max-width: 400px;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-secondary);
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.social-link:hover {
  color: var(--primary);
  background-color: var(--bg-primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.social-link:active {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-base);
  padding: 0.25rem 0;
}

.contact-link:hover {
  color: var(--primary);
  transform: translateX(4px);
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.02);
}

.copyright {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Tablet and up */
@media (min-width: 768px) {
  .footer-container {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .footer-container {
    padding: 4rem 1.5rem 2rem;
  }
}

@media (max-width: 640px) {
  .footer-container {
    padding: 2rem 1rem 1.5rem;
    gap: 1.5rem;
  }

  .footer-title {
    font-size: 1.25rem;
  }

  .footer-subtitle {
    font-size: 0.9375rem;
  }

  .social-links {
    gap: 0.75rem;
  }

  .social-link {
    width: 36px;
    height: 36px;
  }

  .footer-bottom {
    padding: 1rem;
  }

  .copyright {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 1.5rem 0.75rem 1rem;
  }

  .footer-section {
    gap: 0.75rem;
  }
}
</style>
