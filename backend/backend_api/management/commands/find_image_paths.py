from pathlib import Path
from django.core.management.base import BaseCommand
from django.apps import apps
from django.conf import settings

IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif", ".webp")


class Command(BaseCommand):
    help = "Найти все поля в БД, где встречаются пути к изображениям (вывод примеров)."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=50, help="Максимум строк на модель/поле для вывода.")

    def handle(self, *args, **opts):
        print("RUNNING:", __file__)
        limit = opts["limit"]

        media_root = Path(getattr(settings, "MEDIA_ROOT", "media")).resolve()
        found_any = False

        for Model in apps.get_models():
            # Берём все строковые поля: CharField, TextField, ImageField
            text_fields = [
                f for f in Model._meta.fields
                if f.get_internal_type() in {"CharField", "TextField", "ImageField"}
            ]
            if not text_fields:
                continue

            for field in text_fields:
                # Берём первые limit значений, которые оканчиваются на известные расширения
                values = (
                    Model.objects
                    .values_list(field.name, flat=True)
                    .filter(**{f"{field.name}__iregex": r"\.(jpg|jpeg|png|bmp|tiff|gif|webp)$"})[:limit]
                )

                if values:
                    found_any = True
                    self.stdout.write(f"\n=== {Model.__module__}.{Model.__name__}.{field.name} ===")
                    for v in values:
                        if v:
                            self.stdout.write(str(v))

        if not found_any:
            self.stdout.write("⚠️ В БД не найдено строк, оканчивающихся на картинные расширения.")
