import requests
import urllib.parse

def send_whatsapp_callmebot(phone, api_key, message):
    try:
        # Форматирование сообщения
        message_encoded = urllib.parse.quote(message)
        
        # URL для запроса
        url = f"https://api.callmebot.com/whatsapp.php?phone={phone}&text={message_encoded}&apikey={api_key}"
        
        # Отправляем GET запрос
        response = requests.get(url)
        
        # Логируем ответ для отладки
        return response.status_code == 200, response.text
    except Exception as e:
        return False, str(e)