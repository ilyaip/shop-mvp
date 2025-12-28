/**
 * API Response Types
 * Types for backend API responses (snake_case format)
 */

// Site Settings Response Types
export interface SiteSettingsResponse {
  id: number;
  colors: {
    primary: string;
    primary_hover: string;
    primary_light: string;
    secondary: string;
    secondary_hover: string;
    text: string;
    text_light: string;
    text_lighter: string;
    background: string;
    background_secondary: string;
    background_tertiary: string;
    border: string;
    border_light: string;
    success: string;
    error: string;
    warning: string;
  };
  brand: {
    name: string;
    logo: string;
    description: string;
    tagline: string;
  };
  hero: {
    image: string;
    title: string;
    subtitle: string;
    cta_text: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Product Response Types
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  manufacturer: string;
  category: string;
  primary_image: string;
  images: string[];
  video: string;
  height: number;
  depth: number;
  width: number;
  weight: number;
  weight_unit: string;
  is_site_active: boolean;
  qdrant_point_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  price?: number; // Optional - will be generated randomly if not provided
}

export interface ProductListResponse {
  products: ProductResponse[];
  total: number;
}

// Error Types
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

// Email Order Types
export interface SendOrderEmailRequest {
  address_to: string;
  subject: string;
  body_html: string;
}

export interface SendOrderEmailResponse {
  success: boolean;
  message?: string;
}
