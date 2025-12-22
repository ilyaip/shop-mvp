<template>
  <div
    :class="['skeleton', `skeleton--${variant}`]"
    :style="{
      width: width,
      height: height
    }"
  />
</template>

<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  variant?: 'text' | 'circular' | 'rectangular'
}>()
</script>

<style scoped>
.skeleton {
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

.skeleton--text {
  height: 1em;
  border-radius: var(--radius-sm);
}

.skeleton--circular {
  border-radius: 50%;
}

.skeleton--rectangular {
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
</style>
