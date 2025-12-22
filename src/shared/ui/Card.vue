<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup lang="ts">
// No props needed - just a styled container with slot
</script>

<style scoped>
.card {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
}
</style>
