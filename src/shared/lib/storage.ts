/**
 * Utilities for working with localStorage
 */

/**
 * Load data from localStorage
 * @param key - The key to load from localStorage
 * @param defaultValue - Default value to return if key doesn't exist or parsing fails
 * @returns Parsed data or default value
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 * @param key - The key to save to localStorage
 * @param value - The value to save
 * @returns true if successful, false otherwise
 */
export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
    return false;
  }
}

/**
 * Remove data from localStorage
 * @param key - The key to remove from localStorage
 * @returns true if successful, false otherwise
 */
export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
}
