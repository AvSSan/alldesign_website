from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'testimonials', views.TestimonialViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'implementations', views.ImplementationViewSet)
router.register(r'implementation-stages', views.ImplementationStageViewSet)
router.register(r'implementation-media', views.ImplementationMediaViewSet)

urlpatterns = [
    path('testimonials/', views.TestimonialListAPIView.as_view(), name='testimonials'),
    path('order/', views.SendDesignRequestView.as_view(), name='send_design_request'),
    path('ordertest/', views.message_consume),
    path('test/', views.test_view),
    path('api/', include(router.urls)),
]
