from django.contrib import admin
from django.urls import path
from .views import *


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('testimonials/', TestimonialListAPIView.as_view(), name='testimonials'),
    path('', include(router.urls)),
]
