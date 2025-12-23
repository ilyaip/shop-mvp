#!/usr/bin/env node

/**
 * Checkpoint 11 Verification Script
 * Verifies the main functionality of the theming system
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REQUIRED_FILES = [
  'src/shared/types/theme.ts',
  'src/shared/api/theme-data.ts',
  'src/app/stores/theme.ts',
  'src/features/apply-theme/model/useTheme.ts',
  'src/features/apply-theme/index.ts',
  'src/pages/landing/LandingPage.vue',
  'src/widgets/theme-switcher/ui/ThemeSwitcher.vue',
  'src/widgets/theme-switcher/index.ts',
  'src/app/styles/variables.css',
  'src/app/router/index.ts'
];

const REQUIRED_CSS_VARIABLES = [
  '--color-primary',
  '--color-secondary',
  '--color-bg',
  '--color-text',
  '--glass-bg',
  '--glass-blur',
  '--shadow-glass'
];

console.log('🔍 Checkpoint 11: Проверка основной функциональности\n');

let allPassed = true;

// Test 1: Check required files exist
console.log('📁 Test 1: Проверка наличия необходимых файлов');
REQUIRED_FILES.forEach(file => {
  const exists = existsSync(file);
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
  if (!exists) allPassed = false;
});
console.log('');

// Test 2: Check CSS variables are defined
console.log('🎨 Test 2: Проверка CSS-переменных');
try {
  const cssContent = readFileSync('src/app/styles/variables.css', 'utf-8');
  REQUIRED_CSS_VARIABLES.forEach(variable => {
    const exists = cssContent.includes(variable);
    console.log(`  ${exists ? '✓' : '✗'} ${variable}`);
    if (!exists) allPassed = false;
  });
} catch (error) {
  console.log('  ✗ Не удалось прочитать variables.css');
  allPassed = false;
}
console.log('');

// Test 3: Check theme store implementation
console.log('🏪 Test 3: Проверка useThemeStore');
try {
  const storeContent = readFileSync('src/app/stores/theme.ts', 'utf-8');
  const checks = [
    { name: 'defineStore', exists: storeContent.includes('defineStore') },
    { name: 'loadSettings', exists: storeContent.includes('loadSettings') },
    { name: 'applyTheme', exists: storeContent.includes('applyTheme') },
    { name: 'applyPreset', exists: storeContent.includes('applyPreset') },
    { name: 'CSS variables update', exists: storeContent.includes('setProperty') }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.exists ? '✓' : '✗'} ${check.name}`);
    if (!check.exists) allPassed = false;
  });
} catch (error) {
  console.log('  ✗ Не удалось прочитать theme.ts');
  allPassed = false;
}
console.log('');

// Test 4: Check Landing Page
console.log('🏠 Test 4: Проверка Landing Page');
try {
  const landingContent = readFileSync('src/pages/landing/LandingPage.vue', 'utf-8');
  const checks = [
    { name: 'Hero section', exists: landingContent.includes('hero') },
    { name: 'Glass card effect', exists: landingContent.includes('backdrop-filter') },
    { name: 'useTheme composable', exists: landingContent.includes('useTheme') },
    { name: 'Router navigation', exists: landingContent.includes('router.push') },
    { name: 'Features section', exists: landingContent.includes('features') }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.exists ? '✓' : '✗'} ${check.name}`);
    if (!check.exists) allPassed = false;
  });
} catch (error) {
  console.log('  ✗ Не удалось прочитать LandingPage.vue');
  allPassed = false;
}
console.log('');

// Test 5: Check ThemeSwitcher
console.log('🎛️  Test 5: Проверка ThemeSwitcher');
try {
  const switcherContent = readFileSync('src/widgets/theme-switcher/ui/ThemeSwitcher.vue', 'utf-8');
  const checks = [
    { name: 'useThemeStore', exists: switcherContent.includes('useThemeStore') },
    { name: 'applyPreset', exists: switcherContent.includes('applyPreset') },
    { name: 'Theme buttons', exists: switcherContent.includes('theme-button') },
    { name: 'Active indication', exists: switcherContent.includes('theme-button--active') },
    { name: 'Accessibility', exists: switcherContent.includes('aria-label') }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.exists ? '✓' : '✗'} ${check.name}`);
    if (!check.exists) allPassed = false;
  });
} catch (error) {
  console.log('  ✗ Не удалось прочитать ThemeSwitcher.vue');
  allPassed = false;
}
console.log('');

// Test 6: Check AppHeader liquid glass
console.log('💎 Test 6: Проверка Liquid Glass эффектов');
try {
  const headerContent = readFileSync('src/widgets/header/ui/AppHeader.vue', 'utf-8');
  const checks = [
    { name: 'backdrop-filter', exists: headerContent.includes('backdrop-filter') },
    { name: 'Transparent background', exists: headerContent.includes('rgba') },
    { name: 'Browser fallback', exists: headerContent.includes('@supports not') },
    { name: 'useTheme integration', exists: headerContent.includes('useTheme') }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.exists ? '✓' : '✗'} ${check.name}`);
    if (!check.exists) allPassed = false;
  });
} catch (error) {
  console.log('  ✗ Не удалось прочитать AppHeader.vue');
  allPassed = false;
}
console.log('');

// Test 7: Check router configuration
console.log('🛣️  Test 7: Проверка маршрутизации');
try {
  const routerContent = readFileSync('src/app/router/index.ts', 'utf-8');
  const checks = [
    { name: 'Landing route /', exists: routerContent.includes("path: '/'") && routerContent.includes('landing') },
    { name: 'Catalog route', exists: routerContent.includes("path: '/catalog'") },
    { name: 'Profile route', exists: routerContent.includes("path: '/profile'") }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.exists ? '✓' : '✗'} ${check.name}`);
    if (!check.exists) allPassed = false;
  });
} catch (error) {
  console.log('  ✗ Не удалось прочитать router/index.ts');
  allPassed = false;
}
console.log('');

// Test 8: Check mock data
console.log('📦 Test 8: Проверка моковых данных');
try {
  const mockContent = readFileSync('src/shared/api/theme-data.ts', 'utf-8');
  const checks = [
    { name: 'lightTheme', exists: mockContent.includes('lightTheme') },
    { name: 'darkTheme', exists: mockContent.includes('darkTheme') },
    { name: 'blueTheme', exists: mockContent.includes('blueTheme') },
    { name: 'greenTheme', exists: mockContent.includes('greenTheme') },
    { name: 'fetchThemeSettings', exists: mockContent.includes('fetchThemeSettings') },
    { name: 'getPresetTheme', exists: mockContent.includes('getPresetTheme') }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.exists ? '✓' : '✗'} ${check.name}`);
    if (!check.exists) allPassed = false;
  });
} catch (error) {
  console.log('  ✗ Не удалось прочитать theme-data.ts');
  allPassed = false;
}
console.log('');

// Summary
console.log('═'.repeat(60));
if (allPassed) {
  console.log('✅ Все автоматические проверки пройдены!');
  console.log('\n📋 Следующие шаги для ручной проверки:');
  console.log('  1. Откройте http://localhost:5175/');
  console.log('  2. Проверьте загрузку Landing Page');
  console.log('  3. Проверьте liquid glass эффекты в header');
  console.log('  4. Перейдите в /profile и проверьте ThemeSwitcher');
  console.log('  5. Переключите темы и проверьте применение');
  console.log('  6. Проверьте адаптивность на разных размерах экрана');
} else {
  console.log('❌ Некоторые проверки не пройдены');
  console.log('   Проверьте вывод выше для деталей');
}
console.log('═'.repeat(60));

process.exit(allPassed ? 0 : 1);
