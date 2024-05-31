from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Testimonial)
from django.contrib import admin
from .models import Project, ProjectImage, ProjectImagePanorama
from .forms import ProjectForm
from django.utils.safestring import mark_safe

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        return mark_safe(f'<img src="{obj.image.url}" width="150" height="150" />')

class ProjectImagePanoramaInline(admin.TabularInline):
    model = ProjectImagePanorama
    extra = 1
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="150" height="150" />')
        return "No Image"

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectForm
    list_display = ('id', 'title', 'location', 'description')
    inlines = [ProjectImageInline, ProjectImagePanoramaInline]  # Добавлен ProjectImagePanoramaInline

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('images', 'panoramas')

@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('project', 'image_preview')
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        return mark_safe(f'<img src="{obj.image.url}" width="150" height="150" />')

@admin.register(ProjectImagePanorama)
class ProjectImagePanoramaAdmin(admin.ModelAdmin):
    list_display = ('project', 'image_preview')
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="150" height="150" />')
        return "No Image"
