/**
 * Formatting utilities for displaying data
 */

/**
 * Format price with currency symbol
 * @param price - Price value to format
 * @param currency - Currency symbol (default: '₽')
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = '₽'): string {
  return `${price.toFixed(2)} ${currency}`;
}

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @returns Formatted date string (DD.MM.YYYY HH:MM)
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
