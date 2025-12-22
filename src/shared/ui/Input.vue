<template>
  <div class="input-wrapper">
    <label
      v-if="label"
      :for="inputId"
      class="input__label"
    >
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :class="['input', { 'input--error': error }]"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      :aria-required="required"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <span
      v-if="error"
      :id="`${inputId}-error`"
      class="input__error"
      role="alert"
      aria-live="assertive"
    >{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

withDefaults(defineProps<{
  type?: string
  label?: string
  modelValue: string
  error?: string
  placeholder?: string
  required?: boolean
}>(), {
  type: 'text',
  label: undefined,
  error: undefined,
  placeholder: undefined,
  required: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

// Generate unique ID for accessibility
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.input__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  transition: color var(--transition-fast);
}

.input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.input:hover:not(:focus) {
  border-color: var(--color-border);
  box-shadow: var(--shadow-md);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light), var(--shadow-md);
}

.input::placeholder {
  color: var(--color-text-lighter);
  transition: opacity var(--transition-fast);
}

.input:focus::placeholder {
  opacity: 0.6;
}

.input--error {
  border-color: var(--color-error);
  background-color: rgba(239, 68, 68, 0.02);
}

.input--error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1), var(--shadow-md);
}

.input--error + .input__label {
  color: var(--color-error);
}

.input__error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  animation: slideIn var(--transition-base) ease-out;
}

@media (max-width: 480px) {
  .input {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
