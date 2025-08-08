import hashlib
from collections import defaultdict
from pathlib import Path, PurePosixPath
from django.core.management.base import BaseCommand
from django.apps import apps
from django.conf import settings
from django.db import transaction

IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif")
TARGET_KEYWORDS = {"projects/", "panoramas/", "testimonials/"}

def webp_name_for_rel(rel_posix: str, stem: str) -> str:
    """Генерация имени .webp с хэшем на основе исходного относительного пути."""
    h = hashlib.sha1(rel_posix.encode("utf-8")).hexdigest()[:8]
    return f"{stem}_{h}.webp"


class Command(BaseCommand):
    help = (
        "Заменить пути в БД на .webp с уникальным именем (hash), "
        "если файл существует. В dry-run выводит полный отчёт по моделям/полям."
    )

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Только показать изменения.")

    def handle(self, *args, **opts):
        print("RUNNING:", __file__)

        dry = opts["dry_run"]
        media_root = Path(getattr(settings, "MEDIA_ROOT", "media")).resolve()
        changed = scanned = errors = 0

        # Словарь для предварительного отчёта
        found_by_model = defaultdict(lambda: defaultdict(int))

        for Model in apps.get_models():
            text_fields = [
                f for f in Model._meta.fields
                if f.get_internal_type() in {"CharField", "TextField"}
            ]
            if not text_fields:
                continue

            for obj in Model.objects.iterator():
                updated_fields = []
                for field in text_fields:
                    val = getattr(obj, field.name, None)
                    if not isinstance(val, str):
                        continue

                    s = val.strip()
                    if not s or not s.lower().endswith(IMAGE_EXTS):
                        continue
                    if not any(k in s for k in TARGET_KEYWORDS):
                        continue

                    # Отчёт — считаем совпадения
                    if dry:
                        for keyword in TARGET_KEYWORDS:
                            if keyword in s:
                                found_by_model[f"{Model.__module__}.{Model.__name__}"][field.name] += 1

                    rel = PurePosixPath(s)
                    rel_posix = rel.as_posix()
                    src_path = media_root / rel_posix
                    if not src_path.exists():
                        if dry:
                            self.stdout.write(f"[MISS] {Model.__name__}#{obj.pk}.{field.name}: {s} (исходного файла нет)")
                        continue

                    webp_fname = webp_name_for_rel(rel_posix, rel.stem)
                    webp_path = src_path.with_name(webp_fname)
                    new_val = str(rel.with_name(webp_fname))

                    scanned += 1

                    if dry:
                        status = "[FOUND]" if webp_path.exists() else "[NO WEBP]"
                        self.stdout.write(
                            f"{status} {Model.__name__}#{obj.pk}.{field.name}: "
                            f"{s} -> {new_val}  (хэш={webp_fname.split('_')[-1].split('.')[0]})"
                        )

                    if webp_path.exists() and not dry:
                        setattr(obj, field.name, new_val)
                        updated_fields.append(field.name)

                if updated_fields and not dry:
                    try:
                        with transaction.atomic():
                            obj.save(update_fields=list(set(updated_fields)))
                        changed += 1
                    except Exception as e:
                        self.stderr.write(f"[ERR] Save {Model.__name__}#{obj.pk}: {e}")
                        errors += 1

        if dry:
            # Выводим предварительный отчёт по моделям/полям
            self.stdout.write("\n=== Отчёт по моделям и полям с найденными ссылками ===")
            for model_name, fields in found_by_model.items():
                self.stdout.write(f"\n{model_name}:")
                for field_name, count in fields.items():
                    self.stdout.write(f"  {field_name}: {count} ссылок")
            self.stdout.write("\n=== Конец отчёта ===\n")

            self.stdout.write(self.style.NOTICE(
                f"Dry-run complete. Scanned: {scanned}"
            ))
        else:
            self.stdout.write(self.style.NOTICE(
                f"DB relink done. Changed rows: {changed}, Scanned: {scanned}, Errors: {errors}"
            ))
