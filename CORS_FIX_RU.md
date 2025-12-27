# 🔧 Исправление CORS ошибки

## Проблема

Фронтенд не может подключиться к бэкенду из-за отсутствия настройки CORS.

```
CORS error: Access to XMLHttpRequest has been blocked by CORS policy
```

## Быстрое решение

### Для FastAPI (Python)

Откройте главный файл вашего бэкенда (обычно `main.py` или `app.py`) и добавьте:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Добавьте ЭТО перед определением роутов
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  # Альтернативный localhost
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)

# Ваши роуты здесь...
@app.get("/dev-api/site-settings/active")
async def get_settings():
    # ...
```

### Для Express.js (Node.js)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Добавьте ЭТО перед определением роутов
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Ваши роуты здесь...
app.get('/dev-api/site-settings/active', (req, res) => {
  // ...
});
```

### Для Django (Python)

1. Установите пакет:
```bash
pip install django-cors-headers
```

2. В `settings.py`:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Добавьте первым!
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
CORS_ALLOW_HEADERS = ['*']
CORS_ALLOW_CREDENTIALS = False
```

## Шаги для исправления

1. ✅ Добавьте CORS middleware в ваш бэкенд (код выше)
2. ✅ Перезапустите бэкенд сервер
3. ✅ Проверьте настройку: `node check-cors.js`
4. ✅ Обновите страницу фронтенда (F5)

## Проверка

После настройки CORS запустите проверку:

```bash
node check-cors.js
```

Вы должны увидеть:
```
✅ CORS настроен правильно!
Фронтенд должен работать без ошибок.
```

## Что делает CORS?

CORS (Cross-Origin Resource Sharing) - это механизм безопасности браузера, который блокирует запросы между разными доменами/портами.

- Фронтенд: `http://localhost:5173` (Vite)
- Бэкенд: `http://localhost:8000` (API)

Это разные порты → браузер блокирует запросы → нужна настройка CORS на бэкенде.

## Важно для Production

⚠️ В production **НЕ используйте** `allow_origins=["*"]`!

Вместо этого укажите конкретный домен:

```python
# Production
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

## Дополнительная помощь

- 📖 Подробная документация: `CORS_SETUP_GUIDE.md`
- 🧪 Тест API: `node test-api-integration.js`
- 🔍 Проверка CORS: `node check-cors.js`

## Частые вопросы

### Q: Я добавил CORS, но ошибка осталась
A: Убедитесь что вы:
1. Перезапустили бэкенд сервер
2. Обновили страницу фронтенда (Ctrl+F5)
3. Проверили что порт правильный (5173)

### Q: Работает в Postman, но не в браузере
A: Это нормально! Postman не проверяет CORS. Браузеры проверяют.

### Q: Нужно ли что-то менять на фронтенде?
A: Нет! Фронтенд уже настроен правильно. Нужно только настроить бэкенд.

---

**После настройки CORS все должно работать! 🎉**
