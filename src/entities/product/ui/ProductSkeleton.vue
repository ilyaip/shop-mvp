<template>
  <div class="product-skeleton">
    <div class="product-skeleton__image" />
    <div class="product-skeleton__content">
      <div class="product-skeleton__title" />
      <div class="product-skeleton__description">
        <div class="product-skeleton__line" />
        <div class="product-skeleton__line product-skeleton__line--short" />
      </div>
      <div class="product-skeleton__footer">
        <div class="product-skeleton__price" />
        <div class="product-skeleton__button" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed - skeleton has fixed structure
</script>

<style scoped>
.product-skeleton {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 100%;
}

.product-skeleton__image {
  width: 100%;
  height: 240px;
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-border-light) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

.product-skeleton__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--spacing-lg);
  gap: var(--spacing-sm);
}

.product-skeleton__title {
  height: 28px;
  width: 80%;
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-border-light) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.product-skeleton__description {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.product-skeleton__line {
  height: 16px;
  width: 100%;
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-border-light) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.product-skeleton__line--short {
  width: 60%;
}

.product-skeleton__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.product-skeleton__price {
  height: 32px;
  width: 100px;
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-border-light) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.product-skeleton__button {
  height: 40px;
  width: 180px;
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-border-light) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .product-skeleton__footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .product-skeleton__button {
    width: 100%;
  }
}
</style>
