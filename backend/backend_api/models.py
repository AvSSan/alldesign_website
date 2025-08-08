from django.db import models
from django.conf import settings
from .image_utils import compress_image
from django.core.exceptions import ValidationError
import re

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

class Implementation(models.Model):
    title = models.CharField('Название', max_length=200)
    description = models.TextField('Описание')
    location = models.CharField('Адрес', max_length=200, default='')
    area = models.FloatField('Площадь (кв.м)', null=True, blank=True)
    start_date = models.DateField('Дата начала')
    end_date = models.DateField('Дата завершения', null=True, blank=True)
    is_completed = models.BooleanField('Завершен', default=False)
    main_image = models.ImageField('Главное изображение', upload_to='implementation/main/', null=True, blank=True)

    class Meta:
        verbose_name = 'Реализация'
        verbose_name_plural = 'Реализации'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.main_image:
            self.main_image = compress_image(
                self.main_image,
                max_width=PROJECT_IMAGE_MAX_WIDTH,
                max_height=PROJECT_IMAGE_MAX_HEIGHT,
                quality=PROJECT_IMAGE_QUALITY
            )
        super().save(*args, **kwargs)

class ImplementationStage(models.Model):
    STAGE_CHOICES = [
        ('planning', 'Планирование'),
        ('demolition', 'Демонтаж'),
        ('rough_work', 'Черновые работы'),
        ('communications', 'Коммуникации'),
        ('finishing', 'Чистовые работы'),
        ('furniture', 'Мебель'),
        ('decoration', 'Декор'),
        ('completed', 'Завершено'),
    ]

    implementation = models.ForeignKey(Implementation, verbose_name='Реализация', related_name='stages', on_delete=models.CASCADE)
    stage_type = models.CharField('Тип этапа', max_length=50, choices=STAGE_CHOICES)
    title = models.CharField('Название', max_length=200)
    description = models.TextField('Описание')
    start_date = models.DateField('Дата начала')
    end_date = models.DateField('Дата завершения', null=True, blank=True)
    is_completed = models.BooleanField('Завершен', default=False)
    order = models.IntegerField('Порядок', help_text='Порядковый номер этапа')

    class Meta:
        ordering = ['order']
        verbose_name = 'Этап реализации'
        verbose_name_plural = 'Этапы реализации'

    def __str__(self):
        return f"{self.get_stage_type_display()} - {self.implementation.title}"

class ImplementationMedia(models.Model):
    MEDIA_TYPES = (
        ('image', 'Изображение'),
        ('video', 'Видео'),
    )
    
    stage = models.ForeignKey(
        ImplementationStage,
        on_delete=models.CASCADE,
        related_name='media',
        verbose_name='Этап'
    )
    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPES,
        default='image',
        verbose_name='Тип медиа'
    )
    title = models.CharField(
        max_length=255,
        verbose_name='Название'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Описание'
    )
    file = models.FileField(
        upload_to='implementation_media/',
        blank=True,
        null=True,
        verbose_name='Файл (только для изображений)'
    )
    video_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='Ссылка на видео (Rutube)'
    )
    video_embed = models.TextField(
        blank=True,
        null=True,
        verbose_name='Код для встраивания видео'
    )
    thumbnail = models.ImageField(
        upload_to='implementation_media/thumbnails/',
        blank=True,
        null=True,
        verbose_name='Превью для видео'
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Порядок'
    )

    class Meta:
        verbose_name = 'Медиафайл реализации'
        verbose_name_plural = 'Медиафайлы реализации'
        ordering = ['order']

    def __str__(self):
        return f"{self.get_media_type_display()} - {self.title}"

    def clean(self):
        if self.media_type == 'video' and not self.video_url:
            raise ValidationError('Для видео необходимо указать ссылку на Rutube')
        if self.media_type == 'image' and not self.file:
            raise ValidationError('Для изображения необходимо загрузить файл')
        if self.media_type == 'video' and self.file:
            raise ValidationError('Для видео не нужно загружать файл, укажите только ссылку')
        
        # Обработка видео из Rutube
        if self.video_url and 'rutube.ru' in self.video_url:
            try:
                # Извлекаем ID видео из URL Rutube
                video_id = ''
                
                if '/video/' in self.video_url:
                    video_id = self.video_url.split('/video/')[1].replace('/', '')
                elif '/play/embed/' in self.video_url:
                    video_id = self.video_url.split('/play/embed/')[1].replace('/', '')
                else:
                    # Пытаемся извлечь ID из любого другого формата
                    matches = re.search(r'[a-zA-Z0-9]{32}', self.video_url)
                    if matches:
                        video_id = matches.group(0)
                
                if video_id:
                    self.video_embed = f'<iframe src="https://rutube.ru/play/embed/{video_id}" width="640" height="360" frameborder="0" allow="clipboard-write; autoplay; fullscreen" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>'
                else:
                    raise ValidationError('Не удалось извлечь ID видео из ссылки Rutube')
            except Exception as e:
                raise ValidationError(f'Ошибка обработки ссылки на видео Rutube: {str(e)}')

    def save(self, *args, **kwargs):
        if self.media_type == 'image' and self.file:
            self.file = compress_image(
                self.file,
                max_width=PROJECT_IMAGE_MAX_WIDTH,
                max_height=PROJECT_IMAGE_MAX_HEIGHT,
                quality=PROJECT_IMAGE_QUALITY
            )
        super().save(*args, **kwargs)