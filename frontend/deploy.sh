#!/bin/bash

echo "Сборка проекта..."
npm run build

echo "Создание архива..."
cd build
tar -czf ../build.tar.gz .
cd ..

HOST="loshga99.beget.tech"
USER="loshga99"

echo "Загрузка архива на сервер..."
scp build.tar.gz $USER@$HOST:/home/l/$USER/

echo "Распаковка на сервере..."
ssh $USER@$HOST "mkdir -p /home/l/$USER/fronthost/public_html_backup && \
  mv /home/l/$USER/fronthost/public_html/* /home/l/$USER/fronthost/public_html_backup/ 2>/dev/null || true && \
  mkdir -p /home/l/$USER/fronthost/public_html && \
  tar -xzf /home/l/$USER/build.tar.gz -C /home/l/$USER/fronthost/public_html/ && \
  rm /home/l/$USER/build.tar.gz"

echo "Очистка..."
rm build.tar.gz

echo "Деплой завершен!"