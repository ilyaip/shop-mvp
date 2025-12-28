/**
 * Composable for checkout form
 * Handles form state, validation, and order submission
 */

import { ref, computed } from 'vue';
import { useCartStore } from '@/app/stores/cart';
import { useUserStore } from '@/app/stores/user';
import { useUIStore } from '@/app/stores/ui';
import { useThemeStore } from '@/app/stores/theme';
import { validateEmail, validatePhone, validateRequired } from '@/shared/lib/validators';
import { generateOrderEmailHTML } from '@/shared/lib/email-template';
import { sendOrderEmail } from '@/shared/api/email';
import type { OrderData, Order } from '@/shared/types/global';

export function useCheckoutForm() {
  const cartStore = useCartStore();
  const userStore = useUserStore();
  const uiStore = useUIStore();
  const themeStore = useThemeStore();

  // Form fields
  const name = ref('');
  const email = ref('');
  const phone = ref('');
  const address = ref('');

  // Field errors
  const nameError = ref('');
  const emailError = ref('');
  const phoneError = ref('');
  const addressError = ref('');

  // Form state
  const isSubmitting = ref(false);

  // Computed
  const isValid = computed(() => {
    return (
      name.value.trim() !== '' &&
      email.value.trim() !== '' &&
      phone.value.trim() !== '' &&
      address.value.trim() !== '' &&
      !nameError.value &&
      !emailError.value &&
      !phoneError.value &&
      !addressError.value
    );
  });

  // Validation methods
  function validateName() {
    const result = validateRequired(name.value, 'Имя');
    nameError.value = result.error || '';
    return result.isValid;
  }

  function validateEmailField() {
    const result = validateEmail(email.value);
    emailError.value = result.error || '';
    return result.isValid;
  }

  function validatePhoneField() {
    const result = validatePhone(phone.value);
    phoneError.value = result.error || '';
    return result.isValid;
  }

  function validateAddress() {
    const result = validateRequired(address.value, 'Адрес');
    addressError.value = result.error || '';
    return result.isValid;
  }

  function validateAllFields(): boolean {
    const isNameValid = validateName();
    const isEmailValid = validateEmailField();
    const isPhoneValid = validatePhoneField();
    const isAddressValid = validateAddress();

    return isNameValid && isEmailValid && isPhoneValid && isAddressValid;
  }

  // Submit handler
  async function submitOrder(): Promise<boolean> {
    if (!validateAllFields()) {
      uiStore.showNotification('Пожалуйста, заполните все поля корректно', 'error');
      return false;
    }

    if (cartStore.items.length === 0) {
      uiStore.showNotification('Корзина пуста', 'error');
      return false;
    }

    isSubmitting.value = true;

    try {
      // Generate unique order number
      const orderNumber = `${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const brandName = themeStore.brand?.name || 'Магазин';

      // Create order data
      const orderData: OrderData = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        items: [...cartStore.items],
        total: cartStore.total,
      };

      // Generate email HTML
      const emailHTML = generateOrderEmailHTML({
        orderNumber,
        brandName,
        customerName: name.value,
        customerEmail: email.value,
        customerPhone: phone.value,
        customerAddress: address.value,
        items: cartStore.items,
        total: cartStore.total,
      });

      // Send email
      try {
        await sendOrderEmail({
          address_to: email.value,
          subject: `Заказ с сайта ${brandName} № ${orderNumber}`,
          body_html: emailHTML,
        });
      } catch (emailError) {
        console.error('Failed to send order email:', emailError);
        // Don't fail the order if email fails, just log it
        uiStore.showNotification('Заказ оформлен, но письмо не отправлено', 'warning');
      }

      // Create order with ID and date
      const order: Order = {
        ...orderData,
        id: `order-${orderNumber}`,
        date: new Date().toISOString(),
      };

      // Add order to user store
      userStore.addOrder(order);

      // Clear cart
      cartStore.clearCart();

      // Show success notification
      uiStore.showNotification('Заказ успешно оформлен!', 'success');

      // Reset form
      resetForm();

      return true;
    } catch (error) {
      console.error('Order submission error:', error);
      uiStore.showNotification('Ошибка при оформлении заказа', 'error');
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  function resetForm() {
    name.value = '';
    email.value = '';
    phone.value = '';
    address.value = '';
    nameError.value = '';
    emailError.value = '';
    phoneError.value = '';
    addressError.value = '';
  }

  return {
    // Form fields
    name,
    email,
    phone,
    address,
    // Field errors
    nameError,
    emailError,
    phoneError,
    addressError,
    // Form state
    isSubmitting,
    isValid,
    // Methods
    validateName,
    validateEmailField,
    validatePhoneField,
    validateAddress,
    validateAllFields,
    submitOrder,
    resetForm,
  };
}
