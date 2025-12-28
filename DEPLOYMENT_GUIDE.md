# Руководство по деплою

## Подготовка к деплою

### 1. Проверка переменных окружения

Убедитесь, что файл `.env.production` содержит правильный URL бэкенда:

```env
VITE_API_BASE_URL=https://idigeneri.ru
```

### 2. Сборка для production

```bash
npm run build
```

Это создаст оптимизированную сборку в папке `dist/` с использованием настроек из `.env.production`.

### 3. Проверка сборки локально

```bash
npm run preview
```

Это запустит локальный сервер для просмотра production сборки.

## Деплой на сервер

### Вариант 1: Статический хостинг (Netlify, Vercel, GitHub Pages)

1. Подключите репозиторий к платформе
2. Настройте build команду: `npm run build`
3. Укажите папку для публикации: `dist`
4. Добавьте переменную окружения:
   - `VITE_API_BASE_URL=https://idigeneri.ru`

### Вариант 2: Собственный сервер (Nginx, Apache)

1. Соберите проект:
   ```bash
   npm run build
   ```

2. Скопируйте содержимое папки `dist/` на сервер:
   ```bash
   scp -r dist/* user@server:/var/www/html/
   ```

3. Настройте веб-сервер для SPA (пример для Nginx):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Настройка CORS на бэкенде

Убедитесь, что бэкенд на `https://idigeneri.ru` настроен для приема запросов с вашего фронтенд домена:

```python
# Пример для FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Ваш фронтенд домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

См. `CORS_SETUP_GUIDE.md` для подробной настройки.

## Проверка после деплоя

1. Откройте сайт в браузере
2. Откройте DevTools (F12) → Network
3. Проверьте, что запросы идут на `https://idigeneri.ru`
4. Убедитесь, что нет CORS ошибок
5. Проверьте, что данные загружаются корректно

## Troubleshooting

### Проблема: API запросы идут на localhost

**Решение:** Убедитесь, что:
- Файл `.env.production` существует и содержит правильный URL
- Вы используете `npm run build` (не `npm run dev`)
- Очистили кэш браузера

### Проблема: CORS ошибки

**Решение:**
- Проверьте настройки CORS на бэкенде
- Убедитесь, что бэкенд доступен по HTTPS
- См. `CORS_SETUP_GUIDE.md`

### Проблема: 404 ошибки при переходе по URL

**Решение:**
- Настройте веб-сервер для SPA (все запросы должны возвращать index.html)
- Для Netlify создайте файл `public/_redirects`:
  ```
  /*    /index.html   200
  ```

## Continuous Deployment

### GitHub Actions пример

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: https://idigeneri.ru
      
      - name: Deploy
        # Добавьте шаги для деплоя на ваш сервер
```

## Мониторинг

После деплоя рекомендуется настроить:
- Мониторинг доступности API
- Логирование ошибок (Sentry, LogRocket)
- Аналитику (Google Analytics, Plausible)
