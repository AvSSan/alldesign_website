from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile
import os

def compress_image(image_field, max_width=1920, max_height=1080, quality=85):
    """
    Сжимает изображение до указанных размеров, сохраняя пропорции.
    Если изображение меньше указанных размеров, оно не изменяется.
    
    Args:
        image_field: Поле ImageField из модели Django
        max_width: Максимальная ширина (по умолчанию 1920px)
        max_height: Максимальная высота (по умолчанию 1080px)
        quality: Качество JPEG (0-100)
        
    Returns:
        Обработанное изображение или исходное, если оно не требует обработки
    """
    if not image_field:
        return image_field
    
    # Открываем изображение
    img = Image.open(image_field)
    
    # Получаем текущие размеры
    width, height = img.size
    
    # Определяем тип файла из оригинального имени
    file_name = os.path.basename(image_field.name)
    file_ext = os.path.splitext(file_name)[1].lower()
    
    # Проверяем нужно ли изменять размер
    if width > max_width or height > max_height:
        # Вычисляем соотношение сторон
        ratio = min(max_width / width, max_height / height)
        new_width = int(width * ratio)
        new_height = int(height * ratio)
        
        # Изменяем размер с высоким качеством
        img = img.resize((new_width, new_height), Image.LANCZOS)
        
        # Сохраняем изображение в буфер
        output = BytesIO()
        
        # Сохраняем в соответствующем формате и с соответствующими настройками
        if file_ext in ['.jpg', '.jpeg']:
            # JPEG не поддерживает прозрачность
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])  # 3 is the alpha channel
                img = background
            
            img.save(output, format='JPEG', quality=quality, optimize=True, progressive=True)
        elif file_ext == '.png':
            # Сохраняем PNG с прозрачностью, если она есть
            img.save(output, format='PNG', optimize=True)
        elif file_ext == '.webp':
            # Для WEBP используем оптимизацию и указанное качество
            img.save(output, format='WEBP', quality=quality)
        else:
            # Для других форматов по умолчанию используем JPEG
            if img.mode != 'RGB':
                img = img.convert('RGB')
            img.save(output, format='JPEG', quality=quality, optimize=True)
            
        output.seek(0)
        
        # Возвращаем новое сжатое изображение
        return ContentFile(output.getvalue(), name=file_name)
    
    # Если изображение не требует изменения
    return image_field 