from django.contrib import admin
from django.utils.safestring import mark_safe
from django import forms
import nested_admin
from django.conf import settings
from django.core.exceptions import ValidationError
from .models import (
    Project, ProjectImage, ProjectImagePanorama, Testimonial,
    Implementation, ImplementationStage, ImplementationMedia
)
from PIL import Image
import os

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

class ImplementationMediaForm(forms.ModelForm):
    class Meta:
        model = ImplementationMedia
        fields = ['media_type', 'title', 'description', 'file', 'video_url', 'order']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['file'].label = 'Файл (если выбран тип "Изображение")'
        self.fields['file'].help_text = 'Загрузите изображение, если выбран тип "Изображение"'
        self.fields['video_url'].label = 'Ссылка на видео (если выбран тип "Видео")'
        self.fields['video_url'].help_text = 'Укажите ссылку на видео Rutube, если выбран тип "Видео"'

class ImplementationMediaInline(nested_admin.NestedStackedInline):
    model = ImplementationMedia
    extra = 1
    form = ImplementationMediaForm
    
    fields = [
        'media_type',
        'title',
        'description',
        'file',
        'video_url',
        'order'
    ]

    readonly_fields = ('file_preview', 'video_preview')

    def file_preview(self, obj):
        if obj and obj.file:
            return mark_safe(f'<img src="{obj.file.url}" width="150" height="auto" />')
        return "Нет файла"
    file_preview.short_description = 'Предпросмотр файла'

    def video_preview(self, obj):
        if obj and obj.video_embed:
            return mark_safe(obj.video_embed)
        return "Нет видео"
    video_preview.short_description = 'Предпросмотр видео'

class ImplementationStageInline(nested_admin.NestedStackedInline):
    model = ImplementationStage
    extra = 1
    fields = [
        ('title', 'stage_type'),
        'description',
        ('start_date', 'end_date'),
        ('is_completed', 'order')
    ]
    classes = ['collapsible']
    inlines = [ImplementationMediaInline]
    
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        form = formset.form
        form.base_fields['title'].widget.attrs['style'] = 'border: 1px solid #d32f2f;'
        form.base_fields['title'].widget.attrs['placeholder'] = '* Обязательное поле'
        form.base_fields['stage_type'].widget.attrs['style'] = 'border: 1px solid #d32f2f;'
        form.base_fields['description'].widget.attrs['style'] = 'border: 1px solid #d32f2f;'
        form.base_fields['description'].widget.attrs['placeholder'] = '* Обязательное поле'
        form.base_fields['start_date'].widget.attrs['style'] = 'border: 1px solid #d32f2f;'
        form.base_fields['start_date'].widget.attrs['placeholder'] = '* Обязательное поле'
        form.base_fields['order'].widget.attrs['style'] = 'border: 1px solid #d32f2f;'
        form.base_fields['order'].widget.attrs['placeholder'] = '* Обязательное поле'
        return formset

@admin.register(Implementation)
class ImplementationAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', 'location', 'area', 'start_date', 'end_date', 'is_completed', 'main_image_preview')
    list_filter = ('is_completed', 'location')
    search_fields = ('title', 'description', 'location')
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'description', 'location', 'area'),
            'description': '<span style="color: #d32f2f;">* - обязательные поля</span>'
        }),
        ('Даты', {
            'fields': ('start_date', 'end_date', 'is_completed')
        }),
        ('Изображение', {
            'fields': ('main_image', 'main_image_preview'),
        }),
    )
    readonly_fields = ['main_image_preview']
    inlines = [ImplementationStageInline]
    
    class Media:
        css = {
            'all': ('admin/css/mobile_admin.css',)
        }

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['title'].widget.attrs['style'] = 'border: 1px solid #d32f2f;'
        form.base_fields['title'].widget.attrs['placeholder'] = '* Обязательное поле'
        form.base_fields['description'].widget.attrs['style'] = 'border: 1px solid #d32f2f;'
        form.base_fields['description'].widget.attrs['placeholder'] = '* Обязательное поле'
        form.base_fields['start_date'].widget.attrs['style'] = 'border: 1px solid #d32f2f;'
        form.base_fields['start_date'].widget.attrs['placeholder'] = '* Обязательное поле'
        return form

    def main_image_preview(self, obj):
        if obj.main_image:
            return mark_safe(f'<img src="{obj.main_image.url}" width="150" height="auto" />')
        return "Нет изображения"
    main_image_preview.short_description = 'Предпросмотр главного изображения'

@admin.register(ImplementationStage)
class ImplementationStageAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', 'implementation', 'stage_type', 'start_date', 'end_date', 'is_completed', 'order')
    list_filter = ('stage_type', 'is_completed', 'implementation')
    search_fields = ('title', 'description', 'implementation__title')
    fieldsets = (
        ('Основная информация', {
            'fields': ('implementation', 'title', 'stage_type', 'description')
        }),
        ('Даты и статус', {
            'fields': ('start_date', 'end_date', 'is_completed', 'order')
        }),
    )
    inlines = [ImplementationMediaInline]