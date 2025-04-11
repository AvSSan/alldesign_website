#!/bin/bash

# Сборка проекта
echo "Сборка проекта..."
npm run build

# Создание архива с помощью tar
echo "Создание архива..."
cd build
tar -czf ../build.tar.gz .
cd ..

# Настройки подключения
HOST="loshga99.beget.tech"  # Правильный хост для SSH на Beget
USER="loshga99"       # Ваш пользователь на Beget

# Загрузка архива на сервер
echo "Загрузка архива на сервер..."
scp build.tar.gz $USER@$HOST:/home/l/$USER/

# Распаковка на сервере
echo "Распаковка на сервере..."
ssh $USER@$HOST "mkdir -p /home/l/$USER/fronthost/public_html_backup && \
  mv /home/l/$USER/fronthost/public_html/* /home/l/$USER/fronthost/public_html_backup/ 2>/dev/null || true && \
  mkdir -p /home/l/$USER/fronthost/public_html && \
  tar -xzf /home/l/$USER/build.tar.gz -C /home/l/$USER/fronthost/public_html/ && \
  rm /home/l/$USER/build.tar.gz"

# Удаление локального архива
echo "Очистка..."
rm build.tar.gz

echo "Деплой завершен!"

# chmod +x deploy.sh
# ./deploy.sh
