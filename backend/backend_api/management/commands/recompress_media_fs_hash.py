import os
import hashlib
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files.base import ContentFile

from ...image_utils import compress_image  # твоя улучшенная функция

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif"}
DEFAULT_MAX_SIDE = 2560
DEFAULT_QUALITY = 82

# Обрабатываем только эти подпапки внутри media
TARGET_SUBPATHS = {
    "images/projects",
    "images/panoramas",
    "images/testimonials",
}

def webp_name_for_rel(rel_posix: str, stem: str) -> str:
    """
    Дет. имя webp с хэшем от относительного пути (POSIX).
    ex: images/projects/1.png -> 1_ab12cd34.webp
    """
    h = hashlib.sha1(rel_posix.encode("utf-8")).hexdigest()[:8]
    return f"{stem}_{h}.webp"


class Command(BaseCommand):
    help = "Рекурсивно перекодировать изображения в MEDIA_ROOT в .webp с уникальными именами (hash)."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Только показать план.")
        parser.add_argument("--keep-original", action="store_true", help="Не удалять исходники.")
        parser.add_argument("--force", action="store_true", help="Пересоздавать .webp даже если он уже есть/свежее.")
        parser.add_argument("--max-side", type=int, default=DEFAULT_MAX_SIDE, help="Макс. длинная сторона.")
        parser.add_argument("--quality", type=int, default=DEFAULT_QUALITY, help="Качество для фото.")
        parser.add_argument("--subdir", type=str, default="", help="Подкаталог внутри MEDIA_ROOT (опц.).")

    def handle(self, *args, **opts):
        print("RUNNING:", __file__)  # контроль что это наш файл

        dry = opts["dry_run"]
        keep_original = opts["keep_original"]
        force = opts["force"]
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
                src = Path(root) / fname
                ext = src.suffix.lower()

                # фильтр по подпапкам
                rel_posix = src.relative_to(media_root).as_posix()
                if not any(rel_posix.startswith(p + "/") or rel_posix == p for p in TARGET_SUBPATHS):
                    continue

                if ext not in IMAGE_EXTS:
                    continue

                # целевое имя с хэшем
                out_name = webp_name_for_rel(rel_posix, src.stem)
                out_path = src.with_name(out_name)

                # пропуск если уже есть и свежее (если не --force)
                if out_path.exists() and not force:
                    if out_path.stat().st_mtime >= src.stat().st_mtime:
                        skipped += 1
                        continue

                try:
                    if dry:
                        self.stdout.write(f"[DRY] {rel_posix} -> {out_path.relative_to(media_root).as_posix()}")
                        converted += 1
                        continue

                    with src.open("rb") as fp:
                        cf: ContentFile = compress_image(fp, max_side=max_side, quality=quality)

                    out_path.parent.mkdir(parents=True, exist_ok=True)
                    with open(out_path, "wb") as out:
                        out.write(cf.read())

                    if not keep_original:
                        try:
                            src.unlink()
                        except Exception:
                            pass

                    self.stdout.write(f"[OK] {rel_posix} -> {out_path.relative_to(media_root).as_posix()}")
                    converted += 1
                except Exception as e:
                    self.stderr.write(f"[ERR] {rel_posix}: {e}")
                    errors += 1

        self.stdout.write(self.style.NOTICE(
            f"FS done. Converted: {converted}, Skipped: {skipped}, Errors: {errors}"
        ))
