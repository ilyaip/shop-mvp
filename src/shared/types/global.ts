/**
 * Global types and interfaces for the e-commerce application
 */

// Product related types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string; // Main image (for backward compatibility)
  images?: string[]; // Array of images for gallery/slider
  category: string;
}

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

// Cart related types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// Order related types
export interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
}

export interface Order extends OrderData {
  id: string;
  date: string;
}

// User related types
export interface UserState {
  orders: Order[];
}

// UI related types
export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

// Utility types
export type ValidationResult = {
  isValid: boolean;
  error?: string;
};
