# CORS Setup Guide для Backend API

## Проблема

Фронтенд приложение на `http://localhost:5173` (Vite dev server) не может делать запросы к бэкенду на `http://localhost:8000` из-за CORS (Cross-Origin Resource Sharing) ограничений.

## Ошибка

```
Access to XMLHttpRequest at 'http://localhost:8000/dev-api/site-settings/active' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## Решение

Необходимо настроить CORS middleware на бэкенде для разрешения запросов от фронтенда.

---

## Настройка для FastAPI (Python)

Если ваш бэкенд использует FastAPI, добавьте следующий код:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  # Alternative localhost
        "http://localhost:3000",  # Alternative port
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Your routes here...
```

### Для Production

```python
import os

# Get allowed origins from environment variable
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

---

## Настройка для Express.js (Node.js)

Если ваш бэкенд использует Express:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 3600
};

app.use(cors(corsOptions));

// Your routes here...
```

---

## Настройка для Django (Python)

Если ваш бэкенд использует Django:

1. Установите `django-cors-headers`:
```bash
pip install django-cors-headers
```

2. Добавьте в `settings.py`:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Должен быть первым
    'django.middleware.common.CommonMiddleware',
    # ...
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'origin',
    'user-agent',
]

CORS_ALLOW_CREDENTIALS = False
```

---

## Проверка настройки CORS

После настройки CORS на бэкенде, проверьте что он работает:

### 1. Проверка через curl

```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     http://localhost:8000/dev-api/site-settings/active
```

Ожидаемый ответ должен содержать заголовки:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

### 2. Проверка через браузер

Откройте DevTools (F12) → Network → попробуйте сделать запрос с фронтенда.

Успешный запрос должен показывать:
- Status: 200 OK
- Response Headers должны содержать `Access-Control-Allow-Origin`

### 3. Проверка через тестовый скрипт

Запустите тестовый скрипт:
```bash
node test-api-integration.js
```

Все тесты должны пройти успешно.

---

## Распространенные проблемы

### Проблема 1: Preflight запросы (OPTIONS) не обрабатываются

**Симптом:** Браузер делает OPTIONS запрос, который возвращает 404 или 405

**Решение:** Убедитесь что ваш бэкенд обрабатывает OPTIONS запросы:

```python
# FastAPI
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {"message": "OK"}
```

### Проблема 2: Credentials не работают

**Симптом:** Ошибка при попытке отправить cookies или credentials

**Решение:** 
1. На бэкенде: `allow_credentials=True`
2. На фронтенде: `withCredentials: true` в axios

```typescript
// src/shared/api/client.ts
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // Если нужны credentials
  // ...
})
```

### Проблема 3: Wildcard (*) с credentials

**Симптом:** Ошибка "Wildcard not allowed with credentials"

**Решение:** Укажите конкретные origins вместо "*":
```python
allow_origins=["http://localhost:5173"],  # Не "*"
```

---

## Production Configuration

### Environment Variables

Создайте `.env` файл на бэкенде:

```env
# Development
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Production
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Безопасность

1. **Никогда не используйте `allow_origins=["*"]` в production**
2. **Указывайте только доверенные домены**
3. **Используйте HTTPS в production**
4. **Ограничьте методы только необходимыми**
5. **Не включайте credentials без необходимости**

---

## Текущая конфигурация фронтенда

Фронтенд настроен для работы с CORS:

```typescript
// src/shared/api/client.ts
export const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false  // Credentials отключены для локальной разработки
})
```

---

## Следующие шаги

1. ✅ Настройте CORS на бэкенде согласно инструкциям выше
2. ✅ Перезапустите бэкенд сервер
3. ✅ Проверьте что CORS заголовки присутствуют в ответах
4. ✅ Запустите фронтенд и проверьте что запросы работают
5. ✅ Запустите `node test-api-integration.js` для проверки

---

## Дополнительные ресурсы

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)

---

## Контакт

Если проблема сохраняется после настройки CORS:
1. Проверьте логи бэкенда
2. Проверьте Network tab в DevTools
3. Убедитесь что бэкенд запущен на правильном порту
4. Проверьте что фронтенд использует правильный BASE_URL
