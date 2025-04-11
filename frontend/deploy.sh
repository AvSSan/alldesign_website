#!/bin/bash

# Сборка проекта
echo "Сборка проекта..."
npm run build

# Инкрементальный деплой (загружает только изменившиеся файлы)
echo "Деплой на сервер..."
rsync -avz --delete build/ loshga99@beget.com:/home/l/loshga99/fronthost/public_html/

echo "Деплой завершен!"