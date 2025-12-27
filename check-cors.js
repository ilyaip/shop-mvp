/**
 * CORS Check Script
 * Быстрая проверка настройки CORS на бэкенде
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
const FRONTEND_ORIGIN = 'http://localhost:5173';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function checkCORS() {
  console.log('\n' + '='.repeat(60));
  log('🔍 Проверка настройки CORS', 'cyan');
  console.log('='.repeat(60) + '\n');

  try {
    // Проверка OPTIONS запроса (preflight)
    log('1. Проверка OPTIONS запроса (preflight)...', 'cyan');
    try {
      const optionsResponse = await axios.options(
        `${BASE_URL}/dev-api/site-settings/active`,
        {
          headers: {
            'Origin': FRONTEND_ORIGIN,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
          }
        }
      );
      
      const corsHeaders = {
        allowOrigin: optionsResponse.headers['access-control-allow-origin'],
        allowMethods: optionsResponse.headers['access-control-allow-methods'],
        allowHeaders: optionsResponse.headers['access-control-allow-headers']
      };
      
      if (corsHeaders.allowOrigin) {
        log('✓ OPTIONS запрос успешен', 'green');
        log(`  Allow-Origin: ${corsHeaders.allowOrigin}`, 'green');
        log(`  Allow-Methods: ${corsHeaders.allowMethods}`, 'green');
        log(`  Allow-Headers: ${corsHeaders.allowHeaders}`, 'green');
      } else {
        log('✗ CORS заголовки отсутствуют в OPTIONS ответе', 'red');
      }
    } catch (error) {
      log('⚠ OPTIONS запрос не поддерживается или заблокирован', 'yellow');
    }

    // Проверка GET запроса
    log('\n2. Проверка GET запроса...', 'cyan');
    const getResponse = await axios.get(
      `${BASE_URL}/dev-api/site-settings/active`,
      {
        headers: {
          'Origin': FRONTEND_ORIGIN
        }
      }
    );
    
    const allowOrigin = getResponse.headers['access-control-allow-origin'];
    
    if (allowOrigin) {
      log('✓ GET запрос успешен', 'green');
      log(`  Allow-Origin: ${allowOrigin}`, 'green');
      
      if (allowOrigin === FRONTEND_ORIGIN || allowOrigin === '*') {
        log('\n✅ CORS настроен правильно!', 'green');
        log('Фронтенд должен работать без ошибок.', 'green');
      } else {
        log(`\n⚠ CORS настроен, но для другого origin: ${allowOrigin}`, 'yellow');
        log(`Ожидается: ${FRONTEND_ORIGIN}`, 'yellow');
      }
    } else {
      log('✗ CORS заголовки отсутствуют в GET ответе', 'red');
      log('\n❌ CORS НЕ настроен на бэкенде!', 'red');
      printCORSInstructions();
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log('\n❌ Не удалось подключиться к бэкенду', 'red');
      log(`Убедитесь что бэкенд запущен на ${BASE_URL}`, 'yellow');
    } else if (error.response) {
      log(`\n⚠ Бэкенд ответил с ошибкой: ${error.response.status}`, 'yellow');
      
      const allowOrigin = error.response.headers['access-control-allow-origin'];
      if (!allowOrigin) {
        log('❌ CORS заголовки отсутствуют', 'red');
        printCORSInstructions();
      }
    } else {
      log(`\n❌ Ошибка: ${error.message}`, 'red');
    }
  }
  
  console.log('\n');
}

function printCORSInstructions() {
  console.log('\n' + '─'.repeat(60));
  log('📋 Инструкции по настройке CORS:', 'cyan');
  console.log('─'.repeat(60));
  
  log('\n1. Откройте файл с настройками вашего бэкенда', 'yellow');
  log('\n2. Добавьте CORS middleware:', 'yellow');
  
  console.log('\n   FastAPI (Python):');
  console.log(`
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["${FRONTEND_ORIGIN}"],
       allow_credentials=False,
       allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
       allow_headers=["*"],
   )
  `);
  
  console.log('\n   Express.js (Node.js):');
  console.log(`
   const cors = require('cors');
   
   app.use(cors({
       origin: "${FRONTEND_ORIGIN}",
       methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   }));
  `);
  
  log('\n3. Перезапустите бэкенд сервер', 'yellow');
  log('4. Запустите эту проверку снова: node check-cors.js', 'yellow');
  log('\n📖 Подробная документация: CORS_SETUP_GUIDE.md', 'cyan');
  console.log('─'.repeat(60) + '\n');
}

// Запуск проверки
checkCORS().catch(error => {
  log(`Критическая ошибка: ${error.message}`, 'red');
  process.exit(1);
});
