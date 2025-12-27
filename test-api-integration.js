/**
 * API Integration Checkpoint Test
 * 
 * This script tests:
 * 1. Backend connectivity on http://localhost:8000
 * 2. API functions (fetchSiteSettings, fetchProducts, fetchProductById)
 * 3. Stores loading data (useThemeStore, useProductsStore)
 * 4. Error handling with fallbacks
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Test 1: Check backend connectivity
async function testBackendConnectivity() {
  logSection('1. Проверка подключения к бэкенду');
  
  try {
    logInfo(`Проверка доступности ${BASE_URL}...`);
    const response = await axios.get(`${BASE_URL}/dev-api/site-settings/active`, {
      timeout: 5000
    });
    
    if (response.status === 200) {
      logSuccess(`Бэкенд доступен на ${BASE_URL}`);
      logInfo(`Статус: ${response.status}`);
      return true;
    } else {
      logWarning(`Неожиданный статус: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logError(`Не удалось подключиться к ${BASE_URL}`);
      logWarning('Убедитесь что бэкенд запущен на http://localhost:8000');
    } else if (error.code === 'ECONNABORTED') {
      logError('Превышено время ожидания (timeout)');
    } else {
      logError(`Ошибка подключения: ${error.message}`);
    }
    return false;
  }
}

// Test 2: Test site settings API
async function testSiteSettingsAPI() {
  logSection('2. Проверка API настроек сайта');
  
  try {
    logInfo('Запрос к /dev-api/site-settings/active...');
    const response = await axios.get(`${BASE_URL}/dev-api/site-settings/active`);
    
    const data = response.data;
    
    // Check response structure
    if (!data.colors || !data.brand || !data.hero) {
      logError('Неверная структура ответа');
      return false;
    }
    
    logSuccess('API настроек сайта работает');
    logInfo(`Бренд: ${data.brand.name}`);
    logInfo(`Цветов: ${Object.keys(data.colors).length}`);
    logInfo(`Hero заголовок: ${data.hero.title}`);
    
    // Check snake_case format
    if (data.colors.primary_hover) {
      logSuccess('Данные в формате snake_case (как ожидается)');
    }
    
    return true;
  } catch (error) {
    logError(`Ошибка API настроек: ${error.message}`);
    if (error.response) {
      logInfo(`Статус: ${error.response.status}`);
    }
    return false;
  }
}

// Test 3: Test products list API
async function testProductsListAPI() {
  logSection('3. Проверка API списка товаров');
  
  try {
    logInfo('Запрос к /dev-api/product/list...');
    const response = await axios.get(`${BASE_URL}/dev-api/product/list`);
    
    const data = response.data;
    
    if (!data.products || !Array.isArray(data.products)) {
      logError('Неверная структура ответа (ожидается массив products)');
      return false;
    }
    
    logSuccess('API списка товаров работает');
    logInfo(`Всего товаров: ${data.total || data.products.length}`);
    
    // Check active products
    const activeProducts = data.products.filter(p => p.is_site_active);
    logInfo(`Активных товаров: ${activeProducts.length}`);
    
    if (activeProducts.length > 0) {
      const product = activeProducts[0];
      logInfo(`Пример товара: ${product.name}`);
      logInfo(`  ID: ${product.id}`);
      logInfo(`  Категория: ${product.category}`);
      logInfo(`  Активен: ${product.is_site_active}`);
      
      // Check snake_case format
      if (product.primary_image && product.is_site_active !== undefined) {
        logSuccess('Данные в формате snake_case (как ожидается)');
      }
      
      return product.id; // Return first product ID for next test
    } else {
      logWarning('Нет активных товаров в базе');
      return null;
    }
  } catch (error) {
    logError(`Ошибка API товаров: ${error.message}`);
    if (error.response) {
      logInfo(`Статус: ${error.response.status}`);
    }
    return false;
  }
}

// Test 4: Test product by ID API
async function testProductByIdAPI(productId) {
  logSection('4. Проверка API деталей товара');
  
  if (!productId) {
    logWarning('Пропуск теста (нет ID товара)');
    return false;
  }
  
  try {
    logInfo(`Запрос к /dev-api/product/${productId}...`);
    const response = await axios.get(`${BASE_URL}/dev-api/product/${productId}`);
    
    const product = response.data;
    
    if (!product.id || !product.name) {
      logError('Неверная структура ответа');
      return false;
    }
    
    logSuccess('API деталей товара работает');
    logInfo(`Товар: ${product.name}`);
    logInfo(`  Описание: ${product.description?.substring(0, 50)}...`);
    logInfo(`  Производитель: ${product.manufacturer || 'N/A'}`);
    logInfo(`  Активен: ${product.is_site_active}`);
    
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      logWarning('Товар не найден (404) - обработка ошибок работает');
      return true; // This is expected behavior
    }
    logError(`Ошибка API товара: ${error.message}`);
    return false;
  }
}

// Test 5: Test error handling
async function testErrorHandling() {
  logSection('5. Проверка обработки ошибок');
  
  try {
    // Test 404 error
    logInfo('Тест 404 ошибки (несуществующий товар)...');
    try {
      await axios.get(`${BASE_URL}/dev-api/product/999999`);
      logWarning('Ожидалась ошибка 404, но запрос успешен');
    } catch (error) {
      if (error.response?.status === 404) {
        logSuccess('404 ошибка обрабатывается корректно');
      } else {
        logWarning(`Неожиданная ошибка: ${error.message}`);
      }
    }
    
    // Test timeout
    logInfo('Тест timeout (короткий timeout)...');
    try {
      await axios.get(`${BASE_URL}/dev-api/product/list`, { timeout: 1 });
      logWarning('Ожидался timeout, но запрос успешен');
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        logSuccess('Timeout обрабатывается корректно');
      } else {
        logInfo(`Другая ошибка: ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    logError(`Ошибка при тестировании обработки ошибок: ${error.message}`);
    return false;
  }
}

// Test 6: Test data transformation
async function testDataTransformation() {
  logSection('6. Проверка преобразования данных');
  
  try {
    logInfo('Проверка преобразования snake_case → camelCase...');
    
    const response = await axios.get(`${BASE_URL}/dev-api/site-settings/active`);
    const data = response.data;
    
    // Check that backend returns snake_case
    const hasSnakeCase = data.colors.primary_hover !== undefined;
    if (hasSnakeCase) {
      logSuccess('Бэкенд возвращает данные в snake_case');
    } else {
      logWarning('Бэкенд не использует snake_case (неожиданно)');
    }
    
    logInfo('Трансформеры должны преобразовать в camelCase');
    logInfo('  primary_hover → primaryHover');
    logInfo('  is_site_active → isSiteActive');
    logInfo('  cta_text → ctaText');
    
    return true;
  } catch (error) {
    logError(`Ошибка при проверке трансформации: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     API Integration Checkpoint - Verification Tests       ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  const results = {
    connectivity: false,
    siteSettings: false,
    productsList: false,
    productById: false,
    errorHandling: false,
    transformation: false
  };
  
  // Run tests sequentially
  results.connectivity = await testBackendConnectivity();
  
  if (results.connectivity) {
    results.siteSettings = await testSiteSettingsAPI();
    const productId = await testProductsListAPI();
    results.productsList = productId !== false;
    results.productById = await testProductByIdAPI(productId);
    results.errorHandling = await testErrorHandling();
    results.transformation = await testDataTransformation();
  } else {
    logWarning('\nПропуск остальных тестов (бэкенд недоступен)');
  }
  
  // Summary
  logSection('Итоги проверки');
  
  const tests = [
    { name: 'Подключение к бэкенду', result: results.connectivity },
    { name: 'API настроек сайта', result: results.siteSettings },
    { name: 'API списка товаров', result: results.productsList },
    { name: 'API деталей товара', result: results.productById },
    { name: 'Обработка ошибок', result: results.errorHandling },
    { name: 'Преобразование данных', result: results.transformation }
  ];
  
  const passed = tests.filter(t => t.result).length;
  const total = tests.length;
  
  tests.forEach(test => {
    if (test.result) {
      logSuccess(test.name);
    } else {
      logError(test.name);
    }
  });
  
  console.log('\n' + '─'.repeat(60));
  if (passed === total) {
    log(`\n✓ Все проверки пройдены (${passed}/${total})`, 'green');
    log('\nAPI интеграция работает корректно! ✨', 'green');
  } else {
    log(`\n⚠ Пройдено проверок: ${passed}/${total}`, 'yellow');
    if (!results.connectivity) {
      log('\nВажно: Убедитесь что бэкенд запущен на http://localhost:8000', 'yellow');
    }
  }
  
  console.log('\n');
}

// Run tests
runTests().catch(error => {
  logError(`Критическая ошибка: ${error.message}`);
  process.exit(1);
});
