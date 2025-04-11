import sqlite3
import pymysql
import os
import shutil
pymysql.install_as_MySQLdb()

# Измените настройки базы данных:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'loshga99_design',
        'USER': 'loshga99_design',
        'PASSWORD': '(147369fgH+)',
        'HOST': 'localhost',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'use_unicode': True,
        }
    }
}

# Конфигурация
SQLITE_DB = 'db.sqlite3'  # Путь к SQLite-базе
MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'loshga99_design',  # Замените на ваше имя пользователя
    'password': '(147369fgH+)',  # Замените на ваш пароль, используя только ASCII символы
    'db': 'loshga99_design',  # Замените на имя вашей базы
    'charset': 'utf8mb4'
}

# Создаем подключения
sqlite_conn = sqlite3.connect(SQLITE_DB)
sqlite_conn.row_factory = sqlite3.Row
sqlite_cursor = sqlite_conn.cursor()

mysql_conn = pymysql.connect(**MYSQL_CONFIG)
mysql_cursor = mysql_conn.cursor()

try:
    # 1. Миграция таблицы backend_api_project
    print("Миграция проектов...")
    sqlite_cursor.execute("SELECT * FROM backend_api_project")
    projects = sqlite_cursor.fetchall()
    
    for project in projects:
        # Проверяем, существует ли проект
        mysql_cursor.execute("SELECT id FROM backend_api_project WHERE id=%s", (project['id'],))
        if not mysql_cursor.fetchone():
            sql = """INSERT INTO backend_api_project 
                    (id, title, location, description, room_parameters) 
                    VALUES (%s, %s, %s, %s, %s)"""
            
            mysql_cursor.execute(sql, (
                project['id'], project['title'], project['location'], 
                project['description'], project['room_parameters']
            ))
    
    # 2. Миграция таблицы backend_api_testimonial
    print("Миграция отзывов...")
    sqlite_cursor.execute("SELECT * FROM backend_api_testimonial")
    testimonials = sqlite_cursor.fetchall()
    
    for testimonial in testimonials:
        # Проверяем, существует ли отзыв
        mysql_cursor.execute("SELECT id FROM backend_api_testimonial WHERE id=%s", (testimonial['id'],))
        if not mysql_cursor.fetchone():
            sql = """INSERT INTO backend_api_testimonial 
                    (id, image, text, name) 
                    VALUES (%s, %s, %s, %s)"""
            
            mysql_cursor.execute(sql, (
                testimonial['id'], testimonial['image'], testimonial['text'], testimonial['name']
            ))
    
    # 3. Миграция таблицы backend_api_projectimage
    print("Миграция изображений проектов...")
    sqlite_cursor.execute("SELECT * FROM backend_api_projectimage")
    images = sqlite_cursor.fetchall()
    
    for image in images:
        # Проверяем, существует ли изображение
        mysql_cursor.execute("SELECT id FROM backend_api_projectimage WHERE id=%s", (image['id'],))
        if not mysql_cursor.fetchone():
            sql = """INSERT INTO backend_api_projectimage 
                    (id, image, project_id) 
                    VALUES (%s, %s, %s)"""
            
            mysql_cursor.execute(sql, (
                image['id'], image['image'], image['project_id']
            ))
    
    # 4. Миграция таблицы backend_api_projectimagepanorama
    print("Миграция панорам...")
    sqlite_cursor.execute("SELECT * FROM backend_api_projectimagepanorama")
    panoramas = sqlite_cursor.fetchall()
    
    for panorama in panoramas:
        # Проверяем, существует ли панорама
        mysql_cursor.execute("SELECT id FROM backend_api_projectimagepanorama WHERE id=%s", (panorama['id'],))
        if not mysql_cursor.fetchone():
            sql = """INSERT INTO backend_api_projectimagepanorama 
                    (id, image, name, project_id) 
                    VALUES (%s, %s, %s, %s)"""
            
            mysql_cursor.execute(sql, (
                panorama['id'], panorama['image'], panorama['name'], panorama['project_id']
            ))
    
    # Коммит всех изменений
    mysql_conn.commit()
    print("Миграция базы данных успешно завершена!")
    
    # Копирование файлов медиа (если необходимо)
    print("Копирование медиа-файлов...")
    if os.path.exists('media'):
        if not os.path.exists('media_backup'):
            os.makedirs('media_backup')
        
        # Копируем файлы из директории media
        for root, dirs, files in os.walk('media'):
            for file in files:
                src_path = os.path.join(root, file)
                dst_path = os.path.join('media_backup', os.path.relpath(src_path, 'media'))
                os.makedirs(os.path.dirname(dst_path), exist_ok=True)
                shutil.copy2(src_path, dst_path)
                print(f"Скопирован файл: {src_path} -> {dst_path}")
    
    print("Миграция и копирование файлов завершены успешно!")

except Exception as e:
    # В случае ошибки откатываем все изменения
    mysql_conn.rollback()
    print(f"Ошибка при миграции: {e}")

finally:
    # Закрываем подключения
    sqlite_cursor.close()
    sqlite_conn.close()
    mysql_cursor.close()
    mysql_conn.close()