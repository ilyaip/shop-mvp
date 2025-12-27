/**
 * Formatting utilities for displaying data
 */

/**
 * Format price with currency symbol and thousands separator
 * @param price - Price value to format
 * @param currency - Currency symbol (default: '₽')
 * @returns Formatted price string or "Цена уточняется" if price is 0 or undefined
 */
export function formatPrice(price: number | undefined, currency: string = '₽'): string {
  // Handle missing or zero price
  if (price === undefined || price === null || price === 0) {
    return 'Цена уточняется';
  }
  
  // Format number with thousands separator (space)
  const formattedNumber = price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return `${formattedNumber} ${currency}`;
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

/**
 * Format product description by converting <br/> tags to paragraphs
 * @param description - Raw description text with <br/> tags
 * @returns Array of paragraph strings
 */
export function formatDescription(description: string): string[] {
  if (!description) {
    return [];
  }
  
  // Split by <br/> or <br> tags (case insensitive, with or without closing slash)
  const paragraphs = description
    .split(/<br\s*\/?>/gi)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  return paragraphs;
}
