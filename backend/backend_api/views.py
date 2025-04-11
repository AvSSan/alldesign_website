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

from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from django.core.mail import send_mail
import json
import logging
from .callmebot_whatsapp import send_whatsapp_callmebot

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(require_http_methods(["POST", "OPTIONS"]), name='dispatch')
class SendDesignRequestView(View):
    def options(self, request, *args, **kwargs):
        response = JsonResponse({'message': 'OK'})
        self.set_cors_headers(response)
        return response

    def post(self, request, *args, **kwargs):
        # Сразу создаем успешный ответ
        response = JsonResponse({'success': True})
        self.set_cors_headers(response)
        
        try:
            # Сохраняем запрос для отладки
            import os
            log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'request_logs')
            os.makedirs(log_dir, exist_ok=True)
            
            with open(os.path.join(log_dir, 'last_request.txt'), 'w', encoding='utf-8') as f:
                f.write(str(request.body.decode('utf-8')))
            
            # Пытаемся разобрать JSON
            try:
                data = json.loads(request.body)
                
                # Формируем сообщение для WhatsApp
                message = f"""
Новая заявка на дизайн-проект:

ФИО: {data.get('fio', 'Не указано')}
Email: {data.get('email', 'Не указано')}
Объект: {data.get('object', 'Не указано')}
Телефон: {data.get('phone', 'Не указано')}
Пожелания: {data.get('wishes', 'Не указано')}
                """
                
                # Отправляем WhatsApp через CallMeBot
                phone = "+79098728757"  # ЗАМЕНИТЕ НА ВАШ НОМЕР!
                api_key = "1435607"      # ЗАМЕНИТЕ НА ВАШ API КЛЮЧ!
                
                phone2 = "+79996179316"  # ЗАМЕНИТЕ НА ВАШ НОМЕР!
                api_key2 = "5638472"      # ЗАМЕНИТЕ НА ВАШ API КЛЮЧ!
                
                success, result = send_whatsapp_callmebot(phone, api_key, message)
                success2, result2 = send_whatsapp_callmebot(phone2, api_key2, message)
                
                if success:
                    logger.info("WhatsApp уведомление успешно отправлено")
                else:
                    logger.error(f"Ошибка отправки WhatsApp: {result}")
                
                # Сохраняем данные в файл для логирования
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
                
        # В любом случае возвращаем успех
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
    

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    
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
            # Простая проверка данных
            if not fio or not email or not phone or consent is False:
                return JsonResponse({'success': False, 'error': 'Required fields are missing or consent not given.'}, status=400)
            # Обработка данных (можно добавить любую логику)
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

