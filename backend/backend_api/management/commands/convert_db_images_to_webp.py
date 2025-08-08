import os
import hashlib
from pathlib import Path
from io import BytesIO
from django.core.management.base import BaseCommand
from django.conf import settings
from django.apps import apps
from PIL import Image, ImageOps

# какие модели/поля трогаем
MODEL_FIELDS = [
    ("backend_api.Testimonial", "image"),
    ("backend_api.ProjectImage", "image"),
    ("backend_api.ProjectImagePanorama", "image"),
    ("backend_api.Implementation", "main_image"),
    ("backend_api.ImplementationMedia", "file"),  # только media_type='image' в коде модели
    ("backend_api.ImplementationMedia", "thumbnail"),
]

# пресеты по папкам (по длинной стороне)
PRESETS = {
    "images/projects/":   dict(max_side=1920, quality=90),
    "images/panoramas/":  dict(max_side=2560, quality=90),
    "images/testimonials/": dict(max_side=800,  quality=85),
    "implementation/main/": dict(max_side=1920, quality=90),
    "implementation_media/": dict(max_side=1920, quality=90),
    "implementation_media/thumbnails/": dict(max_side=800, quality=85),
}

IMG_EXTS = (".jpg", ".jpeg", ".png")

def pick_preset(rel_path: str):
    for prefix, cfg in PRESETS.items():
        if prefix in rel_path:
            return cfg
    return dict(max_side=1920, quality=85)

def hashed_webp_name(rel_path: str) -> str:
    """
    Делаем ИМЕННО тот же хэш, что использовал релинкер:
    md5 от относительного пути, 7 символов.
    """
    base, _ = os.path.splitext(rel_path)
    h = hashlib.md5(rel_path.encode("utf-8")).hexdigest()[:7]
    return f"{base}_{h}.webp"

def load_and_convert(src_path: Path, max_side: int, quality: int) -> bytes:
    img = Image.open(src_path)
    img = ImageOps.exif_transpose(img)

    # режим
    if img.mode in ("P", "LA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")
    if img.mode == "CMYK":
        img = img.convert("RGB")

    # ресайз по длинной стороне
    w, h = img.size
    longest = max(w, h)
    if longest > max_side:
        k = max_side / float(longest)
        img = img.resize((int(w * k), int(h * k)), Image.LANCZOS)

    has_alpha = (img.mode == "RGBA") or ("transparency" in img.info)
    img = img.convert("RGBA") if has_alpha else img.convert("RGB")

    out = BytesIO()
    img.save(out, format="WEBP", quality=quality, method=6)
    return out.getvalue()


class Command(BaseCommand):
    help = "Создать .webp файлы под имена с хэшами по данным из БД (чтобы соответствовали релинку)."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Только показать план.")
        parser.add_argument("--force", action="store_true", help="Пересоздавать даже если .webp уже есть.")

    def handle(self, *args, **opts):
        media_root = Path(getattr(settings, "MEDIA_ROOT", "media")).resolve()
        dry = opts["dry_run"]
        force = opts["force"]

        created = 0
        skipped = 0
        missing_src = 0
        errors = 0

        for dotted_model, field in MODEL_FIELDS:
            AppLabel, ModelName = dotted_model.split(".")
            Model = apps.get_model(AppLabel, ModelName)
            qs = Model.objects.all()

            # узкое место: ImplementationMedia.file только для image — отфильтруем мягко
            if ModelName == "ImplementationMedia" and field == "file":
                qs = qs.filter(media_type="image")

            for obj in qs.iterator():
                val = getattr(obj, field, None)
                if not val:
                    continue
                rel = str(val)
                ext = os.path.splitext(rel)[1].lower()
                if ext not in IMG_EXTS:
                    continue

                src_path = media_root / rel
                if not src_path.exists():
                    self.stdout.write(self.style.WARNING(f"[MISS SRC] {rel}"))
                    missing_src += 1
                    continue

                cfg = pick_preset(rel)
                dst_name = hashed_webp_name(rel)
                dst_path = src_path.with_name(Path(dst_name).name)

                if dst_path.exists() and not force:
                    skipped += 1
                    continue

                try:
                    if dry:
                        self.stdout.write(f"[DRY] {rel} -> {dst_path.relative_to(media_root)}  "
                                          f"(max_side={cfg['max_side']}, q={cfg['quality']})")
                        created += 1
                        continue

                    data = load_and_convert(src_path, cfg["max_side"], cfg["quality"])
                    dst_path.parent.mkdir(parents=True, exist_ok=True)
                    with open(dst_path, "wb") as f:
                        f.write(data)
                    self.stdout.write(self.style.SUCCESS(
                        f"[OK] {rel} -> {dst_path.relative_to(media_root)}"))
                    created += 1
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f"[ERR] {rel}: {e}"))
                    errors += 1

        self.stdout.write(self.style.NOTICE(
            f"Done. Created: {created}, Skipped(existing): {skipped}, Missing src: {missing_src}, Errors: {errors}"
        ))
