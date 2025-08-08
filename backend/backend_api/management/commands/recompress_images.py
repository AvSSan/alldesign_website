from django.core.management.base import BaseCommand
from django.apps import apps
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db import transaction
from pathlib import Path

# ВАЖНО: путь импорта — в точности к вашей функции
from ...image_utils import compress_image


class Command(BaseCommand):
    help = "Перекодировать все ImageField в WebP"

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Только показать изменения.")
        parser.add_argument("--force", action="store_true", help="Перекодировать даже .webp.")
        parser.add_argument("--keep-original", action="store_true", help="Не удалять исходники.")
        parser.add_argument("--max-side", type=int, default=2560, help="Макс. длинная сторона.")
        parser.add_argument("--quality", type=int, default=82, help="Качество для фото.")

        parser.add_argument("--app", type=str, default=None, help="Фильтр по app_label.")
        parser.add_argument("--model", type=str, default=None, help="Фильтр по имени модели.")

    def handle(self, *args, **opts):
        dry = opts["dry_run"]
        force = opts["force"]
        keep_original = opts["keep_original"]
        max_side = opts["max_side"]
        quality = opts["quality"]
        app_label_filter = opts["app"]
        model_name_filter = (opts["model"] or "").lower() if opts["model"] else None

        converted = skipped = errors = 0

        for Model in apps.get_models():
            if app_label_filter and Model._meta.app_label != app_label_filter:
                continue
            if model_name_filter and Model.__name__.lower() != model_name_filter:
                continue

            image_fields = [f for f in Model._meta.fields if f.get_internal_type() == "ImageField"]
            if not image_fields:
                continue

            for obj in Model.objects.iterator():
                for field in image_fields:
                    f = getattr(obj, field.name)
                    if not f or not getattr(f, "name", ""):
                        continue
                    old_name = f.name

                    if old_name.lower().endswith(".webp") and not force:
                        skipped += 1
                        continue

                    try:
                        with f.open("rb") as src:
                            new_cf: ContentFile = compress_image(src, max_side=max_side, quality=quality)

                        new_name = Path(old_name).with_suffix(".webp").as_posix()

                        if dry:
                            self.stdout.write(f"[DRY] {Model.__name__}#{obj.pk} {old_name} -> {new_name}")
                            converted += 1
                            continue

                        saved_name = default_storage.save(new_name, ContentFile(new_cf.read()))
                        with transaction.atomic():
                            setattr(obj, field.name, saved_name)
                            obj.save(update_fields=[field.name])

                        if not keep_original and saved_name != old_name and default_storage.exists(old_name):
                            default_storage.delete(old_name)

                        self.stdout.write(self.style.SUCCESS(
                            f"[OK] {Model.__name__}#{obj.pk} {old_name} -> {saved_name}"
                        ))
                        converted += 1
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(
                            f"[ERR] {Model.__name__}#{obj.pk} {old_name}: {e}"
                        ))
                        errors += 1

        self.stdout.write(self.style.NOTICE(
            f"Done. Converted: {converted}, Skipped: {skipped}, Errors: {errors}"
        ))
