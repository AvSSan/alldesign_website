from rest_framework import serializers
from .models import Testimonial, Project, ProjectImage, ProjectImagePanorama
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
    

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['image']

class ProjectImagePanoramaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImagePanorama
        fields = ['image', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    panoramas = ProjectImagePanoramaSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'title', 'location', 'description', 'room_parameters', 'images', 'panoramas']
