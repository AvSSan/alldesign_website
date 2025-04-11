from django.apps import AppConfig
import os
from django.conf import settings


class BackendApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend_api'

    def ready(self):
        """
        Вызывается при загрузке приложения.
        Создает необходимые директории для хранения изображений, если они отсутствуют.
        """
        # Создаем директории для изображений
        media_root = getattr(settings, 'MEDIA_ROOT', os.path.join(settings.BASE_DIR, 'media'))
        
        # Директории для хранения различных типов изображений
        image_dirs = [
            os.path.join(media_root, 'images'),
            os.path.join(media_root, 'images/projects'),
            os.path.join(media_root, 'images/panoramas'),
            os.path.join(media_root, 'images/testimonials'),
        ]
        
        # Создаем директории, если они не существуют
        for directory in image_dirs:
            os.makedirs(directory, exist_ok=True)
            
        # Выводим сообщение о готовности приложения и настройках сжатия изображений
        try:
            from .settings_local import (
                PROJECT_IMAGE_MAX_WIDTH, PROJECT_IMAGE_MAX_HEIGHT, PROJECT_IMAGE_QUALITY,
                PANORAMA_IMAGE_MAX_WIDTH, PANORAMA_IMAGE_MAX_HEIGHT, PANORAMA_IMAGE_QUALITY,
                TESTIMONIAL_IMAGE_MAX_WIDTH, TESTIMONIAL_IMAGE_MAX_HEIGHT, TESTIMONIAL_IMAGE_QUALITY
            )
            print(f"Изображения проектов будут сжиматься до {PROJECT_IMAGE_MAX_WIDTH}x{PROJECT_IMAGE_MAX_HEIGHT}, качество: {PROJECT_IMAGE_QUALITY}")
            print(f"Панорамы будут сжиматься до {PANORAMA_IMAGE_MAX_WIDTH}x{PANORAMA_IMAGE_MAX_HEIGHT}, качество: {PANORAMA_IMAGE_QUALITY}")
            print(f"Изображения отзывов будут сжиматься до {TESTIMONIAL_IMAGE_MAX_WIDTH}x{TESTIMONIAL_IMAGE_MAX_HEIGHT}, качество: {TESTIMONIAL_IMAGE_QUALITY}")
        except ImportError:
            # Значения по умолчанию, если файл настроек не найден
            print("Используются значения сжатия изображений по умолчанию")
