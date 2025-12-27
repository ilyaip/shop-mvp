/**
 * Data transformation utilities
 * Converts API responses (snake_case) to application format (camelCase)
 */

import type { SiteSettingsResponse, ProductResponse } from './types'
import type { FrontSettings } from '@/shared/types/theme'
import type { Product } from '@/shared/types/global'

/**
 * Converts snake_case string to camelCase
 * @param str - String in snake_case format
 * @returns String in camelCase format
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Recursively transforms object keys from snake_case to camelCase
 * @param obj - Object with snake_case keys
 * @returns Object with camelCase keys
 */
export const transformKeys = <T extends Record<string, any>>(obj: T): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item))
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key)
      acc[camelKey] = transformKeys(obj[key])
      return acc
    }, {} as any)
  }
  
  return obj
}

/**
 * Transforms site settings response from API to application format
 * @param response - Site settings response from backend
 * @returns Front settings in application format
 */
export const transformSiteSettings = (response: SiteSettingsResponse): FrontSettings => {
  return {
    colors: {
      primary: response.colors.primary,
      primaryHover: response.colors.primary_hover,
      primaryLight: response.colors.primary_light,
      secondary: response.colors.secondary,
      secondaryHover: response.colors.secondary_hover,
      text: response.colors.text,
      textLight: response.colors.text_light,
      textLighter: response.colors.text_lighter,
      background: response.colors.background,
      backgroundSecondary: response.colors.background_secondary,
      backgroundTertiary: response.colors.background_tertiary,
      border: response.colors.border,
      borderLight: response.colors.border_light,
      success: response.colors.success,
      error: response.colors.error,
      warning: response.colors.warning
    },
    brand: {
      name: response.brand.name,
      logo: response.brand.logo,
      description: response.brand.description,
      tagline: response.brand.tagline
    },
    hero: {
      image: response.hero.image,
      title: response.hero.title,
      subtitle: response.hero.subtitle,
      ctaText: response.hero.cta_text
    }
  }
}

/**
 * Transforms product response from API to application format
 * @param response - Product response from backend
 * @returns Product in application format
 */
export const transformProduct = (response: ProductResponse): Product => {
  // Generate random price between 100-10000 if not provided
  const price = response.price !== undefined && response.price !== null 
    ? response.price 
    : Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
  
  return {
    id: response.id.toString(),
    title: response.name,
    description: response.description,
    price: price,
    image: response.primary_image,
    category: response.category,
    // Additional fields
    manufacturer: response.manufacturer,
    images: response.images,
    video: response.video,
    dimensions: {
      height: response.height,
      depth: response.depth,
      width: response.width
    },
    weight: {
      value: response.weight,
      unit: response.weight_unit
    }
  }
}

/**
 * Filters products to only include active ones
 * @param products - Array of product responses
 * @returns Array of active products only
 */
export const filterActiveProducts = (products: ProductResponse[]): ProductResponse[] => {
  return products.filter(product => product.is_site_active)
}
