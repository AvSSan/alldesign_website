import os
import hashlib
from PIL import Image
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = "Конвертирует JPG/PNG в WEBP с нужным качеством, избегая коллизий имён"

    def add_arguments(self, parser):
        parser.add_argument('--quality', type=int, default=90, help='Качество WEBP (по умолчанию 90)')
        parser.add_argument('--max-width', type=int, default=2560, help='Максимальная ширина')
        parser.add_argument('--max-height', type=int, default=1440, help='Максимальная высота')

    def handle(self, *args, **options):
        media_root = settings.MEDIA_ROOT
        quality = options['quality']
        max_w = options['max_width']
        max_h = options['max_height']

        converted_count = 0
        skipped_count = 0

        for root, dirs, files in os.walk(media_root):
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext not in ['.jpg', '.jpeg', '.png']:
                    continue

                src_path = os.path.join(root, file)
                try:
                    img = Image.open(src_path)
                    img = img.convert("RGBA") if img.mode in ("RGBA", "LA") else img.convert("RGB")

                    # Масштабирование
                    w, h = img.size
                    if w > max_w or h > max_h:
                        ratio = min(max_w / w, max_h / h)
                        img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)

                    # Генерация имени с хэшем
                    base_name = os.path.splitext(file)[0]
                    hash_suffix = hashlib.md5(src_path.encode()).hexdigest()[:7]
                    new_name = f"{base_name}_{hash_suffix}.webp"
                    dst_path = os.path.join(root, new_name)

                    # Если уже есть — пропускаем
                    if os.path.exists(dst_path):
                        skipped_count += 1
                        continue

                    img.save(dst_path, "WEBP", quality=quality, method=6)
                    converted_count += 1

                    self.stdout.write(f"✅ {src_path} -> {dst_path}")

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Ошибка с {src_path}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Готово! Конвертировано: {converted_count}, Пропущено: {skipped_count}"))
