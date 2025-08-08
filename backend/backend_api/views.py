from .models import *
from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Testimonial, Project
from .serializers import TestimonialSerializer, ProjectSerializer, ProjectImageSerializer, ProjectImagePanoramaSerializer, ImplementationSerializer, ImplementationStageSerializer, ImplementationMediaSerializer
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
import json
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from django.core.mail import send_mail
import json
import logging
from .callmebot_whatsapp import send_whatsapp_callmebot
from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(require_http_methods(["POST", "OPTIONS"]), name='dispatch')
class SendDesignRequestView(View):
    def options(self, request, *args, **kwargs):
        response = JsonResponse({'message': 'OK'})
        self.set_cors_headers(response)
        return response

    def post(self, request, *args, **kwargs):
        response = JsonResponse({'success': True})
        self.set_cors_headers(response)
        
        try:
            import os
            log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'request_logs')
            os.makedirs(log_dir, exist_ok=True)
            
            with open(os.path.join(log_dir, 'last_request.txt'), 'w', encoding='utf-8') as f:
                f.write(str(request.body.decode('utf-8')))
            
            try:
                data = json.loads(request.body)
                
                message = f"""
Новая заявка на дизайн-проект:

ФИО: {data.get('fio', 'Не указано')}
Email: {data.get('email', 'Не указано')}
Объект: {data.get('object', 'Не указано')}
Телефон: {data.get('phone', 'Не указано')}
Пожелания: {data.get('wishes', 'Не указано')}
                """
                
                phone = os.getenv("PHONE1")
                api_key = os.getenv("APIKEY1")
                
                phone2 = os.getenv("PHONE2")
                api_key2 = os.getenv("APIKEY2")
                
                success, result = send_whatsapp_callmebot(phone, api_key, message)
                success2, result2 = send_whatsapp_callmebot(phone2, api_key2, message)
                
                if success:
                    logger.info("WhatsApp уведомление успешно отправлено")
                else:
                    logger.error(f"Ошибка отправки WhatsApp: {result}")
                
                import datetime
                now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                
                with open(os.path.join(log_dir, f'request_{now}.txt'), 'w', encoding='utf-8') as f:
                    f.write(f"ФИО: {data.get('fio', 'Не указано')}\n")
                    f.write(f"Email: {data.get('email', 'Не указано')}\n")
                    f.write(f"Объект: {data.get('object', 'Не указано')}\n")
                    f.write(f"Телефон: {data.get('phone', 'Не указано')}\n")
                    f.write(f"Пожелания: {data.get('wishes', 'Не указано')}\n")
                    f.write(f"WhatsApp отправлен: {success}\n")
                    f.write(f"Результат отправки: {result}\n")
                
            except json.JSONDecodeError:
                logger.error("Невалидный JSON в запросе")
            
        except Exception as e:
            logger.error(f"Общая ошибка: {str(e)}")
                
        return response

    def get(self, request, *args, **kwargs):
        response = JsonResponse({'success': True})
        self.set_cors_headers(response)
        return response

    def set_cors_headers(self, response):
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"
        return response


@csrf_exempt
def message_consume(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        queue_name = data.get('queue')
        fio = data.get('fio')
        email = data.get('email')
        object_ = data.get('object')
        phone = data.get('phone')
        wishes = data.get('wishes')
        
        subject = 'Новая заявка на дизайн-проект'
        message = f"""
        ФИО: {fio}
        Email: {email}
        Объект: {object_}
        Телефон: {phone}
        Пожелания: {wishes}
        """
        
        send_mail(
                subject,
                message,
                'order@alldesignkhv.ru',
                ['loshgame@mail.ru'],
                fail_silently=False,
            )

        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Неверный метод запроса'}, status=400)
        
        
class TestimonialListAPIView(generics.ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def get_serializer_context(self):
        return {'request': self.request}
    

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def add_image(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_panorama(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectImagePanoramaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImplementationViewSet(viewsets.ModelViewSet):
    queryset = Implementation.objects.all()
    serializer_class = ImplementationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def add_stage(self, request, pk=None):
        implementation = self.get_object()
        serializer = ImplementationStageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(implementation=implementation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImplementationStageViewSet(viewsets.ModelViewSet):
    queryset = ImplementationStage.objects.all()
    serializer_class = ImplementationStageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        implementation_id = self.request.query_params.get('implementation', None)
        if implementation_id is not None:
            queryset = queryset.filter(implementation_id=implementation_id)
        return queryset

    @action(detail=True, methods=['post'])
    def add_media(self, request, pk=None):
        stage = self.get_object()
        serializer = ImplementationMediaSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(stage=stage)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def complete_stage(self, request, pk=None):
        stage = self.get_object()
        stage.is_completed = True
        stage.save()
        return Response({'status': 'stage completed'})

class ImplementationMediaViewSet(viewsets.ModelViewSet):
    queryset = ImplementationMedia.objects.all()
    serializer_class = ImplementationMediaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        stage_id = self.request.query_params.get('stage', None)
        if stage_id is not None:
            queryset = queryset.filter(stage_id=stage_id)
        return queryset

    def perform_create(self, serializer):
        stage_id = self.request.data.get('stage')
        stage = get_object_or_404(ImplementationStage, id=stage_id)
        serializer.save(stage=stage)

@csrf_exempt
def test_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            fio = data.get('fio')
            email = data.get('email')
            object_ = data.get('object')
            phone = data.get('phone')
            wishes = data.get('wishes')
            consent = data.get('consent')
            # Простая проверка даных
            if not fio or not email or not phone or consent is False:
                return JsonResponse({'success': False, 'error': 'Required fields are missing or consent not given.'}, status=400)
            subject = 'Новая заявка на дизайн-проект'
            message = f"""
            ФИО: {fio}
            Email: {email}
            Объект: {object_}
            Телефон: {phone}
            Пожелания: {wishes}
            """
            
            send_mail(
                subject,
                message,
                'order@alldesignkhv.ru',
                ['loshgame@mail.ru'],
                fail_silently=False,
            )
            return JsonResponse({'success': True, 'message': 'Data received successfully!', 'data': data})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON.'}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid method.'}, status=405)

