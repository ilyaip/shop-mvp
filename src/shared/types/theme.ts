export interface ThemeColors {
  primary: string
  primaryHover: string
  primaryLight: string
  secondary: string
  secondaryHover: string
  text: string
  textLight: string
  textLighter: string
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  border: string
  borderLight: string
  success: string
  error: string
  warning: string
}

export interface BrandSettings {
  name: string
  logo: string
  description: string
  tagline?: string
}

export interface HeroSettings {
  image: string
  title: string
  subtitle: string
  ctaText: string
}

export interface FrontSettings {
  colors: ThemeColors
  brand: BrandSettings
  hero: HeroSettings
}

export type ThemePreset = 'light' | 'dark' | 'blue' | 'green'
