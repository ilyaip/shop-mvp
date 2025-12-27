/**
 * Products API
 * API functions for fetching products from backend
 */

import { apiClient } from './client'
import { transformProduct, filterActiveProducts } from './transformers'
import type { ProductListResponse, ProductResponse } from './types'
import type { Product } from '@/shared/types/global'

/**
 * Fetches list of products from backend
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.5
 * 
 * @returns Array of active products in application format
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ProductListResponse>('/dev-api/product/list')
    
    // Filter only active products (is_site_active: true)
    const activeProducts = filterActiveProducts(response.data.products)
    
    // Transform to application format
    return activeProducts.map(transformProduct)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    // Return empty array as fallback
    return []
  }
}

/**
 * Fetches single product by ID from backend
 * Requirements: 4.1, 4.2, 4.3, 4.4
 * 
 * @param id - Product ID
 * @returns Product in application format or null if not found/error
 */
export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await apiClient.get<ProductResponse>(`/dev-api/product/${id}`)
    
    // Check if product is active
    if (!response.data.is_site_active) {
      return null
    }
    
    // Transform to application format
    return transformProduct(response.data)
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error)
    // Return null on error (including 404)
    return null
  }
}
