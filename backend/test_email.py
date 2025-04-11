import os
import django
import sys

# Устанавливаем переменную окружения для загрузки настроек
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.mail import send_mail

def test_send_email():
    try:
        send_mail(
            subject='Тестовое письмо',
            message='Это тестовое письмо для проверки настроек SMTP.',
            from_email='order@alldesignkhv.ru',
            recipient_list=['loshgame@mail.ru'],
            fail_silently=False,
        )
        print("Письмо успешно отправлено!")
    except Exception as e:
        print(f"Ошибка при отправке письма: {e}")

if __name__ == "__main__":
    test_send_email()