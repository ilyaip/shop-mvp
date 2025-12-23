import type { FrontSettings, ThemePreset } from '@/shared/types/theme'

// Светлая тема - Классический синий
const lightTheme: FrontSettings = {
  colors: {
    primary: '#4F46E5', // Indigo
    primaryHover: '#4338CA',
    primaryLight: '#E0E7FF',
    secondary: '#8B5CF6', // Purple
    secondaryHover: '#7C3AED',
    text: '#1E1B4B',
    textLight: '#6366F1',
    textLighter: '#A5B4FC',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F3FF',
    backgroundTertiary: '#EDE9FE',
    border: '#DDD6FE',
    borderLight: '#EDE9FE',
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

// Темная тема - Midnight Purple
const darkTheme: FrontSettings = {
  colors: {
    primary: '#A78BFA', // Violet
    primaryHover: '#8B5CF6',
    primaryLight: '#2E1065',
    secondary: '#F472B6', // Pink
    secondaryHover: '#EC4899',
    text: '#FAF5FF',
    textLight: '#E9D5FF',
    textLighter: '#C084FC',
    background: '#0F0A1E', // Deep purple-black
    backgroundSecondary: '#1E1433',
    backgroundTertiary: '#2D1B4E',
    border: '#3B2667',
    borderLight: '#4C3575',
    success: '#34D399',
    error: '#FB7185',
    warning: '#FBBF24'
  },
  brand: {
    name: 'Midnight Store',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
    description: 'Премиальные товары в элегантном темном стиле',
    tagline: 'Элегантность в каждой детали'
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920',
    title: 'Добро пожаловать в Midnight Store',
    subtitle: 'Премиальное качество в темном исполнении',
    ctaText: 'Исследовать каталог'
  }
}

// Синяя тема - Ocean Breeze
const blueTheme: FrontSettings = {
  colors: {
    primary: '#06B6D4', // Cyan
    primaryHover: '#0891B2',
    primaryLight: '#CFFAFE',
    secondary: '#3B82F6', // Blue
    secondaryHover: '#2563EB',
    text: '#0C4A6E',
    textLight: '#0369A1',
    textLighter: '#38BDF8',
    background: '#F0FDFF',
    backgroundSecondary: '#E0F7FA',
    backgroundTertiary: '#B2EBF2',
    border: '#99D5E0',
    borderLight: '#B2EBF2',
    success: '#14B8A6',
    error: '#EF4444',
    warning: '#F59E0B'
  },
  brand: {
    name: 'Ocean Store',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
    description: 'Свежесть и качество в каждом товаре',
    tagline: 'Глоток свежего воздуха'
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920',
    title: 'Добро пожаловать в Ocean Store',
    subtitle: 'Погрузитесь в мир качественных товаров',
    ctaText: 'Начать покупки'
  }
}

// Зеленая тема - Forest Harmony
const greenTheme: FrontSettings = {
  colors: {
    primary: '#059669', // Emerald
    primaryHover: '#047857',
    primaryLight: '#D1FAE5',
    secondary: '#84CC16', // Lime
    secondaryHover: '#65A30D',
    text: '#064E3B',
    textLight: '#047857',
    textLighter: '#6EE7B7',
    background: '#F0FDF4',
    backgroundSecondary: '#DCFCE7',
    backgroundTertiary: '#BBF7D0',
    border: '#86EFAC',
    borderLight: '#BBF7D0',
    success: '#10B981',
    error: '#F87171',
    warning: '#FBBF24'
  },
  brand: {
    name: 'Eco Store',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
    description: 'Экологичные товары для осознанной жизни',
    tagline: 'В гармонии с природой'
  },
  hero: {
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920',
    title: 'Добро пожаловать в Eco Store',
    subtitle: 'Экологичный выбор для лучшего будущего',
    ctaText: 'Смотреть товары'
  }
}

const themes: Record<ThemePreset, FrontSettings> = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme
}

// Имитация API запроса
export const fetchThemeSettings = async (): Promise<FrontSettings> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // В реальном приложении здесь будет API запрос
  // const response = await fetch('/api/front-settings')
  // return response.json()
  
  return lightTheme
}

// Получение предустановленной темы
export const getPresetTheme = (preset: ThemePreset): FrontSettings => {
  return themes[preset]
}

// Получение всех доступных пресетов
export const getAvailablePresets = (): ThemePreset[] => {
  return Object.keys(themes) as ThemePreset[]
}
