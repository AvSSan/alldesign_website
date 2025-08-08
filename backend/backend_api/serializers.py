from rest_framework import serializers
from .models import Testimonial, Project, ProjectImage, ProjectImagePanorama, Implementation, ImplementationStage, ImplementationMedia
from django.conf import settings

class TestimonialSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ['id', 'image', 'image_url', 'text', 'name']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None
    

#class ProjectImageSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = ProjectImage
#        fields = ['image']
        
class ProjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

#class ProjectImagePanoramaSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = ProjectImagePanorama
#        fields = ['image', 'name']

class ProjectImagePanoramaSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectImagePanorama
        fields = ['id', 'image', 'name', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            return f"https://alldesignkhv.store{obj.image.url}"
        return None

class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    panoramas = ProjectImagePanoramaSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'title', 'location', 'description', 'room_parameters', 'images', 'panoramas']

class ImplementationMediaSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    video_embed_code = serializers.SerializerMethodField()

    class Meta:
        model = ImplementationMedia
        fields = [
            'id', 'stage', 'media_type', 'title', 'description',
            'file', 'file_url', 'video_url', 'video_embed',
            'thumbnail', 'thumbnail_url', 'order', 'video_embed_code'
        ]

    def get_file_url(self, obj):
        if obj.file:
            return f"https://alldesignkhv.store{obj.file.url}"
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return f"https://alldesignkhv.store{obj.thumbnail.url}"
        return None

    def get_video_embed_code(self, obj):
        if obj.video_embed:
            return obj.video_embed
        return None

class ImplementationStageSerializer(serializers.ModelSerializer):
    media = ImplementationMediaSerializer(many=True, read_only=True)

    class Meta:
        model = ImplementationStage
        fields = [
            'id', 'implementation', 'stage_type', 'title', 'description',
            'start_date', 'end_date', 'is_completed', 'order', 'media'
        ]

class ImplementationSerializer(serializers.ModelSerializer):
    stages = ImplementationStageSerializer(many=True, read_only=True)
    main_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Implementation
        fields = [
            'id', 'title', 'description', 'location', 'area',
            'start_date', 'end_date', 'is_completed', 'main_image',
            'main_image_url', 'stages'
        ]

    def get_main_image_url(self, obj):
        if obj.main_image:
            return f"https://alldesignkhv.store{obj.main_image.url}"
        return None
