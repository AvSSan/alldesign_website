#!/bin/bash

# Настройки подключения
HOST="loshga99.beget.tech"  # Хост SSH для Beget
USER="loshga99"       # Ваш пользователь
BACKEND_PATH="/home/l/$USER/loshga99.beget.tech/"  # Путь к бэкенду на сервере

# Цвета для терминала
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}1. Создание архива проекта...${NC}"
# Исключаем ненужные файлы и директории
tar --exclude="*.pyc" \
    --exclude="__pycache__" \
    --exclude="venv" \
    --exclude="*.zip" \
    --exclude="*.tar.gz" \
    --exclude=".git" \
    --exclude="media" \
    -czf backend_deploy.tar.gz .

echo -e "${GREEN}2. Загрузка архива на сервер...${NC}"
scp backend_deploy.tar.gz $USER@$HOST:~/

echo -e "${GREEN}3. Распаковка и применение изменений на сервере...${NC}"
ssh $USER@$HOST << EOF
  # Сохраняем важные файлы
  cd $BACKEND_PATH
  if [ -f .env ]; then
    cp .env ~/env_backup
  fi
  
  # Сохраняем медиа-файлы
  mkdir -p ~/media_backup
  if [ -d $BACKEND_PATH/media ]; then
    cp -r $BACKEND_PATH/media/* ~/media_backup/
  fi
  
  # Создаем временную директорию для распаковки
  mkdir -p ~/temp_backend
  cd ~/temp_backend
  
  # Распаковываем архив во временную директорию
  tar -xzf ~/backend_deploy.tar.gz
  
  # Удаляем и пересоздаем директорию бэкенда, кроме media
  find $BACKEND_PATH -mindepth 1 -maxdepth 1 ! -name 'media' -exec rm -rf {} \;
  
  # Копируем все новые файлы
  cp -r ~/temp_backend/* $BACKEND_PATH/
  
  # Восстанавливаем .env
  if [ -f ~/env_backup ]; then
    cp ~/env_backup $BACKEND_PATH/.env
    rm ~/env_backup
  fi
  
  # Восстанавливаем медиа-файлы
  mkdir -p $BACKEND_PATH/media
  if [ -d ~/media_backup ]; then
    cp -r ~/media_backup/* $BACKEND_PATH/media/
    rm -rf ~/media_backup
  fi
  
  # Очищаем временные файлы
  rm -rf ~/temp_backend
  rm ~/backend_deploy.tar.gz
  
  # Активируем виртуальное окружение и выполняем команды Django
  cd $BACKEND_PATH
  source ~/myenv/bin/activate
  
  # Устанавливаем зависимости
  pip install -r requirements.txt
  
  # Выполняем миграции
  python manage.py migrate
  
  # Собираем статические файлы
  python manage.py collectstatic --noinput
  
  # Перезапускаем приложение
  touch wsgi.py
  
  echo "Деплой бэкенда успешно завершен!"
EOF

# Удаляем локальный архив
rm backend_deploy.tar.gz

echo -e "${GREEN}4. Деплой бэкенда успешно завершен!${NC}"

# chmod +x deploy_backend.sh
# ./deploy_backend.sh