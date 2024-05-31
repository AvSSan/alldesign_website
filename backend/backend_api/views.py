from django.shortcuts import render
from .models import *
from django.http import HttpResponse
from rest_framework import generics, viewsets
from .models import Testimonial, Project
from .serializers import TestimonialSerializer, ProjectSerializer


class TestimonialListAPIView(generics.ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def get_serializer_context(self):
        return {'request': self.request}
    

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
