import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend_api.models import ProjectImage, ProjectImagePanorama, Testimonial

def fix_image_paths():
    # Проверка и исправление путей в ProjectImage
    images = ProjectImage.objects.all()
    print(f"Найдено {images.count()} записей ProjectImage")
    
    for img in images:
        if img.image:
            # Вывод текущего пути для отладки
            print(f"ID: {img.id}, Текущий путь: {img.image.name}")
            
            # Проверяем существование файла
            full_path = os.path.join('/home/l/loshga99/loshga99.beget.tech/backend/media/', img.image.name)
            if not os.path.exists(full_path):
                print(f"ВНИМАНИЕ: Файл не существует: {full_path}")
            
    # Аналогично для панорам
    panoramas = ProjectImagePanorama.objects.all()
    print(f"Найдено {panoramas.count()} записей ProjectImagePanorama")
    
    for pan in panoramas:
        if pan.image:
            print(f"ID: {pan.id}, Текущий путь: {pan.image.name}")
            
            full_path = os.path.join('/home/l/loshga99/loshga99.beget.tech/backend/media/', pan.image.name)
            if not os.path.exists(full_path):
                print(f"ВНИМАНИЕ: Файл не существует: {full_path}")
    
    # И для отзывов
    testimonials = Testimonial.objects.all()
    print(f"Найдено {testimonials.count()} записей Testimonial")
    
    for test in testimonials:
        if test.image:
            print(f"ID: {test.id}, Текущий путь: {test.image.name}")
            
            full_path = os.path.join('/home/l/loshga99/loshga99.beget.tech/backend/media/', test.image.name)
            if not os.path.exists(full_path):
                print(f"ВНИМАНИЕ: Файл не существует: {full_path}")

if __name__ == "__main__":
    fix_image_paths()