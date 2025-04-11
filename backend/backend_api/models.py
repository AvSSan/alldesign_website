from django.db import models
from django.conf import settings
from .image_utils import compress_image

# Импортируем настройки для сжатия изображений
try:
    from .settings_local import (
        PROJECT_IMAGE_MAX_WIDTH, PROJECT_IMAGE_MAX_HEIGHT, PROJECT_IMAGE_QUALITY,
        PANORAMA_IMAGE_MAX_WIDTH, PANORAMA_IMAGE_MAX_HEIGHT, PANORAMA_IMAGE_QUALITY,
        TESTIMONIAL_IMAGE_MAX_WIDTH, TESTIMONIAL_IMAGE_MAX_HEIGHT, TESTIMONIAL_IMAGE_QUALITY
    )
except ImportError:
    # Значения по умолчанию, если файл настроек не найден
    PROJECT_IMAGE_MAX_WIDTH, PROJECT_IMAGE_MAX_HEIGHT, PROJECT_IMAGE_QUALITY = 1920, 1080, 90
    PANORAMA_IMAGE_MAX_WIDTH, PANORAMA_IMAGE_MAX_HEIGHT, PANORAMA_IMAGE_QUALITY = 2560, 1440, 90
    TESTIMONIAL_IMAGE_MAX_WIDTH, TESTIMONIAL_IMAGE_MAX_HEIGHT, TESTIMONIAL_IMAGE_QUALITY = 800, 800, 85

# Create your models here.
class Testimonial(models.Model):
    image = models.ImageField(upload_to='images/testimonials')
    text = models.TextField()
    name = models.CharField(max_length=100)
    
    def save(self, *args, **kwargs):
        # Сжатие изображения отзыва с использованием параметров из настроек
        if self.image:
            self.image = compress_image(
                self.image, 
                max_width=TESTIMONIAL_IMAGE_MAX_WIDTH, 
                max_height=TESTIMONIAL_IMAGE_MAX_HEIGHT, 
                quality=TESTIMONIAL_IMAGE_QUALITY
            )
        super().save(*args, **kwargs)


class Project(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField()
    room_parameters = models.JSONField()  # Для хранения параметров помещения в формате JSON

    def __str__(self):
        return self.title

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/projects')

    def __str__(self):
        return f"Image for project: {self.project.title}"
    
    def save(self, *args, **kwargs):
        # Сжатие изображения проекта с использованием параметров из настроек
        if self.image:
            self.image = compress_image(
                self.image, 
                max_width=PROJECT_IMAGE_MAX_WIDTH, 
                max_height=PROJECT_IMAGE_MAX_HEIGHT, 
                quality=PROJECT_IMAGE_QUALITY
            )
        super().save(*args, **kwargs)
    
class ProjectImagePanorama(models.Model):
    project = models.ForeignKey(Project, related_name='panoramas', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/panoramas')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Panorama image for project: {self.project.title}"
        
    def save(self, *args, **kwargs):
        # Сжатие панорамного изображения с использованием параметров из настроек
        if self.image:
            self.image = compress_image(
                self.image, 
                max_width=PANORAMA_IMAGE_MAX_WIDTH, 
                max_height=PANORAMA_IMAGE_MAX_HEIGHT, 
                quality=PANORAMA_IMAGE_QUALITY
            )
        super().save(*args, **kwargs)