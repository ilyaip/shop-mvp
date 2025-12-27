import { apiClient } from './client'
import { transformSiteSettings } from './transformers'
import type { SiteSettingsResponse } from './types'
import type { FrontSettings } from '@/shared/types/theme'

// Дефолтная светлая тема как fallback
const defaultSettings: FrontSettings = {
  colors: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryLight: '#DBEAFE',
    secondary: '#6B7280',
    secondaryHover: '#4B5563',
    text: '#111827',
    textLight: '#6B7280',
    textLighter: '#9CA3AF',
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B'
  },
  brand: {
    name: 'Modern Store',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
    description: 'Ваш источник качественных товаров и отличного сервиса',
    tagline: 'Качество, которому можно доверять'
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
    title: 'Добро пожаловать в Modern Store',
    subtitle: 'Откройте для себя коллекцию премиальных товаров',
    ctaText: 'Перейти в каталог'
  }
}

/**
 * Загрузка активных настроек сайта с бэкенда
 * 
 * @returns Promise<FrontSettings> - Настройки сайта или дефолтная тема при ошибке
 * 
 * Requirements:
 * - 2.1: Запрос к /dev-api/site-settings/active
 * - 2.2: Преобразование snake_case в camelCase
 * - 2.3: Преобразование структуры colors
 * - 2.4: Преобразование структуры brand
 * - 2.5: Преобразование структуры hero
 * - 2.6: Fallback на дефолтную тему при ошибке
 * - 2.7: Логирование ошибок в консоль
 */
export const fetchSiteSettings = async (): Promise<FrontSettings> => {
  try {
    const response = await apiClient.get<SiteSettingsResponse>('/dev-api/site-settings/active')
    return transformSiteSettings(response.data)
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    // Возвращаем дефолтные настройки при ошибке
    return defaultSettings
  }
}
