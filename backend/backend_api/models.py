from django.db import models
from django.conf import settings

# Create your models here.
class Testimonial(models.Model):
    image = models.ImageField(upload_to='images/testimonials')
    text = models.TextField()
    name = models.CharField(max_length=100)


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
    
class ProjectImagePanorama(models.Model):
    project = models.ForeignKey(Project, related_name='panoramas', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/panoramas')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Panorama image for project: {self.project.title}"