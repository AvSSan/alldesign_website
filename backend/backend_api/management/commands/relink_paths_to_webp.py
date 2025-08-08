import os
import hashlib
from django.core.management.base import BaseCommand
from django.db import connection
from backend_api import models

def generate_hashed_name(path):
    """
    Генерирует имя файла с таким же хэшем, как в конвертере.
    """
    base_name = os.path.splitext(path)[0]
    hash_suffix = hashlib.md5(path.encode()).hexdigest()[:7]
    return f"{base_name}_{hash_suffix}.webp"

class Command(BaseCommand):
    help = "Перелинковка изображений в БД на WEBP (с учётом хэшей), без вызова save()"

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Показать изменения, но не сохранять их')

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        changed = 0
        scanned = 0

        models_fields = [
            (models.Testimonial, 'image'),
            (models.ProjectImage, 'image'),
            (models.ProjectImagePanorama, 'image'),
            (models.Implementation, 'main_image'),
            (models.ImplementationMedia, 'file'),
        ]

        for model, field_name in models_fields:
            table = model._meta.db_table
            for obj in model.objects.all().only('id', field_name):
                scanned += 1
                old_path = getattr(obj, field_name)
                if not old_path:
                    continue
                old_path = str(old_path)

                ext = os.path.splitext(old_path)[1].lower()
                if ext not in ['.jpg', '.jpeg', '.png']:
                    continue

                new_path = generate_hashed_name(old_path)

                if old_path != new_path:
                    self.stdout.write(f"[{model.__name__} id={obj.id}] {old_path} -> {new_path}")
                    if not dry_run:
                        with connection.cursor() as cursor:
                            cursor.execute(
                                f"UPDATE {table} SET {field_name} = %s WHERE id = %s",
                                [new_path, obj.id]
                            )
                    changed += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done. Changed: {changed}, Scanned: {scanned}"
        ))
