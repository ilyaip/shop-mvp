/**
 * Email Template Generator
 * Generates HTML email templates for orders
 */

import type { CartItem } from '@/shared/types/global'
import { formatPrice } from './formatters'

interface OrderEmailData {
  orderNumber: string
  brandName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: CartItem[]
  total: number
}

/**
 * Generate HTML email body for order confirmation
 * @param data - Order data
 * @returns HTML string
 */
export function generateOrderEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img 
            src="${item.product.image}" 
            alt="${item.product.title}"
            style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"
          />
          <div>
            <div style="font-weight: 600; color: #111827; margin-bottom: 5px;">
              ${item.product.title}
            </div>
            <div style="color: #6b7280; font-size: 14px;">
              Количество: ${item.quantity}
            </div>
          </div>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #111827;">
        ${formatPrice((item.product.price ?? 0) * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Заказ ${data.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ${data.brandName}
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                Спасибо за ваш заказ!
              </p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 600;">
                Заказ № ${data.orderNumber}
              </h2>
              
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">
                  Информация о доставке
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Имя:</td>
                    <td style="padding: 5px 0; color: #111827; font-size: 14px; text-align: right; font-weight: 500;">
                      ${data.customerName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Email:</td>
                    <td style="padding: 5px 0; color: #111827; font-size: 14px; text-align: right; font-weight: 500;">
                      ${data.customerEmail}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Телефон:</td>
                    <td style="padding: 5px 0; color: #111827; font-size: 14px; text-align: right; font-weight: 500;">
                      ${data.customerPhone}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Адрес:</td>
                    <td style="padding: 5px 0; color: #111827; font-size: 14px; text-align: right; font-weight: 500;">
                      ${data.customerAddress}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Order Items -->
              <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">
                Состав заказа
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${itemsHTML}
                
                <!-- Total -->
                <tr>
                  <td style="padding: 20px; background-color: #f9fafb; font-weight: 600; color: #111827; font-size: 18px;">
                    Итого:
                  </td>
                  <td style="padding: 20px; background-color: #f9fafb; text-align: right; font-weight: 700; color: #667eea; font-size: 24px;">
                    ${formatPrice(data.total)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Мы свяжемся с вами в ближайшее время для подтверждения заказа.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} ${data.brandName}. Все права защищены.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
