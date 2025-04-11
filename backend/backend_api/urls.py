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
    path('order/', SendDesignRequestView.as_view(), name='send_design_request'),
    path('ordertest/', message_consume),
    path('test/', test_view),
    path('', include(router.urls)),
]
