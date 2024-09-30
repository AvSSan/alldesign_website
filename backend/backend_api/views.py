from django.shortcuts import render
from .models import *
from django.http import HttpResponse
from rest_framework import generics, viewsets
from .models import Testimonial, Project
from .serializers import TestimonialSerializer, ProjectSerializer
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

from django.views import View
from django.utils.decorators import method_decorator
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class SendDesignRequestView(View):
    def options(self, request, *args, **kwargs):
        response = JsonResponse({'message': 'OK'})
        self.set_cors_headers(response)
        return response

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            
            subject = 'Новая заявка на дизайн-проект'
            message = f"""
            ФИО: {data.get('fio', 'Не указано')}
            Email: {data.get('email', 'Не указано')}
            Объект: {data.get('object', 'Не указано')}
            Телефон: {data.get('phone', 'Не указано')}
            Пожелания: {data.get('wishes', 'Не указано')}
            """
            
            send_mail(
                subject,
                message,
                'order@alldesignkhv.ru',
                ['loshgame@mail.ru'],
                fail_silently=False,
            )
            
            logger.info(f"Email sent successfully for {data.get('email', 'unknown email')}")
            response = JsonResponse({'success': True})
        except json.JSONDecodeError:
            logger.error("Invalid JSON in request body")
            response = JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
        except KeyError as e:
            logger.error(f"Missing required field: {str(e)}")
            response = JsonResponse({'success': False, 'error': f'Missing required field: {str(e)}'}, status=400)
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}", exc_info=True)
            response = JsonResponse({'success': False, 'error': f'Internal server error - {str(e)}'}, status=500)

        self.set_cors_headers(response)
        return response

    def get(self, request, *args, **kwargs):
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    def set_cors_headers(self, response):
        response["Access-Control-Allow-Origin"] = "https://alldesignkhv.store"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"

class TestimonialListAPIView(generics.ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def get_serializer_context(self):
        return {'request': self.request}
    

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    

