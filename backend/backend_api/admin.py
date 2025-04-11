from django.contrib import admin
from django.utils.safestring import mark_safe
from django import forms
from .models import Project, ProjectImage, ProjectImagePanorama, Testimonial
from PIL import Image
import os

# Функция для получения информации о размере изображения
def get_image_dimensions(image_field):
    if not image_field:
        return "-"
    try:
        img = Image.open(image_field.path)
        width, height = img.size
        filesize = os.path.getsize(image_field.path) / 1024  # KB
        return f"{width}x{height} ({filesize:.1f} KB)"
    except Exception as e:
        return f"Ошибка: {str(e)}"

# Улучшенный интерфейс для изображений проекта
class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    max_num = 20
    fields = ['image', 'image_preview', 'image_info']
    readonly_fields = ['image_preview', 'image_info']

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="150" height="auto" />')
        return "Нет изображения"
    image_preview.short_description = 'Предпросмотр'
    
    def image_info(self, obj):
        if obj.image:
            return get_image_dimensions(obj.image)
        return "-"
    image_info.short_description = 'Размер изображения'

# Улучшенный интерфейс для панорам
class ProjectImagePanoramaInline(admin.TabularInline):
    model = ProjectImagePanorama
    extra = 1
    max_num = 10
    fields = ['name', 'image', 'image_preview', 'image_info']
    readonly_fields = ['image_preview', 'image_info']

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="150" height="auto" />')
        return "Нет изображения"
    image_preview.short_description = 'Предпросмотр'
    
    def image_info(self, obj):
        if obj.image:
            return get_image_dimensions(obj.image)
        return "-"
    image_info.short_description = 'Размер изображения'

# Улучшенная форма проекта
class ProjectForm(forms.ModelForm):
    area = forms.FloatField(required=False, label="Площадь (кв.м)")
    rooms = forms.IntegerField(required=False, label="Количество комнат")
    family = forms.IntegerField(required=False, label="Количество членов семьи")

    class Meta:
        model = Project
        fields = ['title', 'location', 'description']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk and self.instance.room_parameters:
            self.fields['area'].initial = self.instance.room_parameters.get('area')
            self.fields['rooms'].initial = self.instance.room_parameters.get('rooms')
            self.fields['family'].initial = self.instance.room_parameters.get('family')

    def clean(self):
        cleaned_data = super().clean()
        area = cleaned_data.get('area')
        rooms = cleaned_data.get('rooms')
        family = cleaned_data.get('family')
        
        room_parameters = {
            'area': area,
            'rooms': rooms,
            'family': family
        }
        cleaned_data['room_parameters'] = {k: v for k, v in room_parameters.items() if v is not None}
        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.room_parameters = self.cleaned_data['room_parameters']
        if commit:
            instance.save()
        return instance

# Улучшенный интерфейс админа для проектов
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'location'),
            'classes': ('wide',),
        }),
        ('Описание проекта', {
            'fields': ('description',),
            'classes': ('wide',),
        }),
        ('Параметры помещения', {
            'fields': ('area', 'rooms', 'family'),
            'classes': ('wide',),
            'description': 'Укажите характеристики помещения'
        }),
    )
    list_display = ('title', 'location', 'get_area', 'get_rooms', 'thumbnail')
    list_filter = ('location',)
    search_fields = ('title', 'location', 'description')
    inlines = [ProjectImageInline, ProjectImagePanoramaInline]
    
    def get_area(self, obj):
        return obj.room_parameters.get('area', '-')
    get_area.short_description = 'Площадь (кв.м)'
    
    def get_rooms(self, obj):
        return obj.room_parameters.get('rooms', '-')
    get_rooms.short_description = 'Количество комнат'
    
    def thumbnail(self, obj):
        try:
            first_image = obj.images.first()
            if first_image and first_image.image:
                return mark_safe(f'<img src="{first_image.image.url}" width="100" height="auto" />')
        except:
            pass
        return "Нет изображения"
    thumbnail.short_description = 'Превью'

# Улучшенный интерфейс для отдельных изображений
@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('project', 'image_preview', 'image_info')
    list_filter = ('project',)
    readonly_fields = ['image_preview', 'image_info']

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="150" height="auto" />')
        return "Нет изображения"
    image_preview.short_description = 'Предпросмотр'
    
    def image_info(self, obj):
        if obj.image:
            return get_image_dimensions(obj.image)
        return "-"
    image_info.short_description = 'Размер изображения'

# Улучшенный интерфейс для панорам
@admin.register(ProjectImagePanorama)
class ProjectImagePanoramaAdmin(admin.ModelAdmin):
    list_display = ('project', 'name', 'image_preview', 'image_info')
    list_filter = ('project',)
    readonly_fields = ['image_preview', 'image_info']

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="150" height="auto" />')
        return "Нет изображения"
    image_preview.short_description = 'Предпросмотр'
    
    def image_info(self, obj):
        if obj.image:
            return get_image_dimensions(obj.image)
        return "-"
    image_info.short_description = 'Размер изображения'

# Улучшенный интерфейс для отзывов
@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_text', 'image_preview', 'image_info')
    search_fields = ('name', 'text')
    readonly_fields = ['image_preview', 'image_info']
    
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" height="auto" />')
        return "Нет изображения"
    image_preview.short_description = 'Фото'
    
    def image_info(self, obj):
        if obj.image:
            return get_image_dimensions(obj.image)
        return "-"
    image_info.short_description = 'Размер изображения'
    
    def short_text(self, obj):
        if len(obj.text) > 50:
            return obj.text[:50] + '...'
        return obj.text
    short_text.short_description = 'Текст отзыва'