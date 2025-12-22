#!/usr/bin/env sh

# Остановка при ошибках
set -e

# Сборка проекта
npm run build

# Переход в директорию сборки
cd dist

# Инициализация git репозитория (если нужно)
git init
git add -A
git commit -m 'deploy'

# Деплой в ветку gh-pages
# Замените <USERNAME>/<REPO> на ваши данные
git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

cd -
