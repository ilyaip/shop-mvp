<template>
  <form
    class="checkout-form"
    aria-label="Форма оформления заказа"
    @submit.prevent="handleSubmit"
  >
    <h2 class="form-title">
      Оформление заказа
    </h2>

    <div class="form-group">
      <Input
        v-model="name"
        label="Имя"
        placeholder="Введите ваше имя"
        :error="nameError"
        required
        aria-required="true"
        @blur="validateName"
      />
    </div>

    <div class="form-group">
      <Input
        v-model="email"
        type="email"
        label="Email"
        placeholder="example@email.com"
        :error="emailError"
        required
        aria-required="true"
        @blur="validateEmailField"
      />
    </div>

    <div class="form-group">
      <Input
        v-model="phone"
        type="tel"
        label="Телефон"
        placeholder="+7 (999) 999-99-99"
        :error="phoneError"
        required
        aria-required="true"
        @blur="validatePhoneField"
      />
    </div>

    <div class="form-group">
      <Input
        v-model="address"
        label="Адрес доставки"
        placeholder="Введите адрес доставки"
        :error="addressError"
        required
        aria-required="true"
        @blur="validateAddress"
      />
    </div>

    <Button
      type="submit"
      variant="primary"
      :disabled="!isValid || isSubmitting"
      :aria-disabled="!isValid || isSubmitting"
      class="submit-button"
    >
      {{ isSubmitting ? 'Оформление...' : 'Оформить заказ' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { Input, Button } from '@/shared/ui';
import { useCheckoutForm } from '../model/useCheckoutForm';

const emit = defineEmits<{
  success: [];
}>();

const {
  name,
  email,
  phone,
  address,
  nameError,
  emailError,
  phoneError,
  addressError,
  isSubmitting,
  isValid,
  validateName,
  validateEmailField,
  validatePhoneField,
  validateAddress,
  submitOrder,
} = useCheckoutForm();

async function handleSubmit() {
  const success = await submitOrder();
  if (success) {
    emit('success');
  }
}
</script>

<style scoped>
.checkout-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.form-group {
  margin-bottom: 1.25rem;
}

.submit-button {
  width: 100%;
  margin-top: 0.5rem;
}
</style>
