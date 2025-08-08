import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings

from django.core.files.base import ContentFile
from ...image_utils import compress_image  # ваша улучшенная функция

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif"}
DEFAULT_MAX_SIDE = 2560
DEFAULT_QUALITY = 82


class Command(BaseCommand):
    help = "Рекурсивно перекодировать все изображения в MEDIA_ROOT в .webp (файловая система)."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Только показать, что будет сделано.")
        parser.add_argument("--keep-original", action="store_true", help="Не удалять исходные файлы.")
        parser.add_argument("--max-side", type=int, default=DEFAULT_MAX_SIDE, help="Макс. длинная сторона.")
        parser.add_argument("--quality", type=int, default=DEFAULT_QUALITY, help="Качество для фото.")

        parser.add_argument("--subdir", type=str, default="", help="Обрабатывать только подкаталог внутри MEDIA_ROOT.")

    def handle(self, *args, **opts):
        dry = opts["dry_run"]
        keep_original = opts["keep_original"]
        max_side = opts["max_side"]
        quality = opts["quality"]
        subdir = opts["subdir"].strip("/")

        media_root = Path(getattr(settings, "MEDIA_ROOT", "media")).resolve()
        base_dir = media_root / subdir if subdir else media_root

        if not base_dir.exists():
            self.stderr.write(f"Каталог не найден: {base_dir}")
            return

        converted = skipped = errors = 0

        for root, _, files in os.walk(base_dir):
            for fname in files:
                p = Path(root) / fname
                ext = p.suffix.lower()

                # Пропускаем уже WebP
                if ext == ".webp":
                    skipped += 1
                    continue

                if ext not in IMAGE_EXTS:
                    continue

                out_path = p.with_suffix(".webp")
                # Если уже существует .webp и он свежее — пропустим
                if out_path.exists() and out_path.stat().st_mtime >= p.stat().st_mtime:
                    skipped += 1
                    continue

                try:
                    if dry:
                        self.stdout.write(f"[DRY] {p.relative_to(media_root)} -> {out_path.relative_to(media_root)}")
                        converted += 1
                        continue

                    # Читаем файл в память и гоняем через compress_image
                    with p.open("rb") as fp:
                        cf: ContentFile = compress_image(fp, max_side=max_side, quality=quality)

                    # Записываем .webp на диск
                    out_path.parent.mkdir(parents=True, exist_ok=True)
                    with open(out_path, "wb") as out:
                        out.write(cf.read())

                    # Удаляем оригинал при необходимости
                    if not keep_original:
                        try:
                            p.unlink()
                        except Exception:
                            pass

                    self.stdout.write(f"[OK] {p.relative_to(media_root)} -> {out_path.relative_to(media_root)}")
                    converted += 1

                except Exception as e:
                    self.stderr.write(f"[ERR] {p.relative_to(media_root)}: {e}")
                    errors += 1

        self.stdout.write(self.style.NOTICE(
            f"FS done. Converted: {converted}, Skipped: {skipped}, Errors: {errors}"
        ))
